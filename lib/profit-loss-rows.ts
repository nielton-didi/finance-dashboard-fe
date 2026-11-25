import type {
  ProfitLossSection,
  ProfitLossStatement,
  ProfitLossSummaryRow,
} from "@/lib/profit-loss"
import { ZERO, type ItemRow, type StatementBlock } from "@/lib/statement-rows"

type SectionKey = {
  [
    K in keyof ProfitLossStatement
  ]: ProfitLossStatement[K] extends ProfitLossSection ? K : never
}[keyof ProfitLossStatement]

type SummaryKey = {
  [
    K in keyof ProfitLossStatement
  ]: ProfitLossStatement[K] extends ProfitLossSummaryRow ? K : never
}[keyof ProfitLossStatement]

const LAYOUT: (
  { section: SectionKey; higherIsBetter: boolean } | { summary: SummaryKey }
)[] = [
  { section: "sales", higherIsBetter: true },
  { section: "salesAdjustments", higherIsBetter: false },
  { summary: "netSales" },
  { section: "costOfGoodsSold", higherIsBetter: false },
  { summary: "grossProfit" },
  { section: "otherIncomes", higherIsBetter: true },
  { section: "expenses", higherIsBetter: false },
  { summary: "netProfit" },
  { section: "taxation", higherIsBetter: false },
  { summary: "netProfitAfterTax" },
]

export function hasTaxation(statements: ProfitLossStatement[]): boolean {
  return statements.some((s) => s.taxation.items.some((i) => i.amount !== 0))
}

/**
 * Lines several statements (current + comparison, or one per period) up into shared
 * rows, matching accounts by code. Without any taxation, the tax section and the
 * after-tax line are left out: they would only repeat net profit.
 */
export function buildStatementBlocks(
  statements: ProfitLossStatement[]
): StatementBlock[] {
  const showTax = hasTaxation(statements)
  const lastSummary: SummaryKey = showTax ? "netProfitAfterTax" : "netProfit"

  return LAYOUT.flatMap((entry): StatementBlock[] => {
    if ("summary" in entry) {
      const key = entry.summary
      if (key === "netProfitAfterTax" && !showTax) return []
      return [
        {
          kind: "summary",
          id: key,
          emphasis: key === lastSummary,
          row: {
            id: key,
            label: statements[0][key].label,
            higherIsBetter: true,
            cells: statements.map((s) => ({
              amount: s[key].amount,
              percent: s[key].percent,
            })),
          },
        },
      ]
    }

    const { section: key, higherIsBetter } = entry
    if (key === "taxation" && !showTax) return []
    const sections = statements.map((s) => s[key])
    const items = buildItems(sections, higherIsBetter)

    return [
      {
        kind: "section",
        id: key,
        title: sections[0].title,
        accType: sections[0].accType,
        items,
        canDrillDown: true,
        hideWhenEmpty: false,
        total: {
          id: `${key}-total`,
          label: `Total ${sections[0].title}`,
          higherIsBetter,
          cells: sections.map((s) => ({ amount: s.total, percent: s.percent })),
        },
      },
    ]
  })
}

function buildItems(
  sections: ProfitLossSection[],
  higherIsBetter: boolean
): ItemRow[] {
  const byCode = new Map<string, ItemRow>()
  sections.forEach((section, index) => {
    for (const item of section.items) {
      let row = byCode.get(item.accountCode)
      if (!row) {
        row = {
          id: item.accountCode,
          accountCode: item.accountCode,
          label: item.accountName,
          higherIsBetter,
          canDrillDown: true,
          cells: sections.map(() => ZERO),
        }
        byCode.set(item.accountCode, row)
      }
      row.cells[index] = { amount: item.amount, percent: item.percent }
      if (item.hasStockValue) row.canDrillDown = false
    }
  })
  return [...byCode.values()].sort((a, b) => a.id.localeCompare(b.id))
}

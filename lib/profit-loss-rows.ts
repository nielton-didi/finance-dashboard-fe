import type {
  ProfitLossAccType,
  ProfitLossSection,
  ProfitLossStatement,
  ProfitLossSummaryRow,
} from "@/lib/profit-loss"

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

export interface Cell {
  amount: number
  percent: number
}

interface RowBase {
  id: string
  label: string
  /** One cell per statement, in the order the statements were given. */
  cells: Cell[]
  /** Whether an increase is good news; drives variance colouring. */
  higherIsBetter: boolean
}

export interface ItemRow extends RowBase {
  accountCode: string
  canDrillDown: boolean
}

export type StatementBlock =
  | {
      kind: "section"
      id: SectionKey
      title: string
      accType: ProfitLossAccType
      items: ItemRow[]
      total: RowBase & { canDrillDown: boolean }
    }
  | { kind: "summary"; id: SummaryKey; row: RowBase; emphasis: boolean }

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

const ZERO: Cell = { amount: 0, percent: 0 }

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
        total: {
          id: `${key}-total`,
          label: `Total ${sections[0].title}`,
          higherIsBetter,
          canDrillDown: true,
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
  return [...byCode.values()].sort((a, b) =>
    a.accountCode.localeCompare(b.accountCode)
  )
}

export function isZeroRow(row: { cells: Cell[] }): boolean {
  return row.cells.every((cell) => cell.amount === 0)
}

export interface Variance {
  amount: number
  percent: number | null
  tone: "good" | "bad" | "neutral"
}

export function getVariance(row: RowBase): Variance {
  const [current, comparison] = row.cells
  const amount = Math.round((current.amount - comparison.amount) * 100) / 100
  return {
    amount,
    percent:
      comparison.amount === 0
        ? null
        : (amount / Math.abs(comparison.amount)) * 100,
    tone:
      amount === 0
        ? "neutral"
        : amount > 0 === row.higherIsBetter
          ? "good"
          : "bad",
  }
}

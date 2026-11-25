import type {
  BalanceSheetGroup,
  BalanceSheetItem,
  BalanceSheetStatement,
  BalanceSheetTotal,
} from "@/lib/balance-sheet"
import {
  ZERO,
  type ItemRow,
  type SectionBlock,
  type StatementBlock,
} from "@/lib/statement-rows"

type GroupKey =
  | "nonCurrentAssets"
  | "currentAssets"
  | "equity"
  | "nonCurrentLiabilities"
  | "currentLiabilities"

type TotalKey = "totalAssets" | "totalLiabilities" | "totalEquityAndLiabilities"

/** Lines several balance sheets up into shared rows, matching accounts by code. */
export function buildBalanceSheetBlocks(
  statements: BalanceSheetStatement[],
  { currentYearProfitHref }: { currentYearProfitHref: string }
): StatementBlock[] {
  const summary = (
    id: GroupKey | TotalKey,
    pick: (statement: BalanceSheetStatement) => BalanceSheetTotal,
    { emphasis = false, higherIsBetter = true } = {}
  ): StatementBlock => ({
    kind: "summary",
    id,
    emphasis,
    row: {
      id,
      label: pick(statements[0]).label,
      higherIsBetter,
      cells: statements.map((s) => ({
        amount: pick(s).amount,
        percent: pick(s).percent,
      })),
    },
  })

  const group = (key: GroupKey, higherIsBetter = true): StatementBlock[] => {
    const sections = buildSections(
      statements.map((s) => s[key]),
      higherIsBetter,
      currentYearProfitHref
    )
    // A single section's own total already says it.
    if (sections.length < 2) return sections
    return [...sections, summary(key, (s) => s[key], { higherIsBetter })]
  }

  return [
    { kind: "heading", id: "assets", title: "Assets" },
    ...group("nonCurrentAssets"),
    ...group("currentAssets"),
    summary("totalAssets", (s) => s.totalAssets, { emphasis: true }),
    {
      kind: "heading",
      id: "equityAndLiabilities",
      title: "Equity and liabilities",
    },
    ...group("equity"),
    ...group("nonCurrentLiabilities", false),
    ...group("currentLiabilities", false),
    summary("totalLiabilities", (s) => s.totalLiabilities, {
      higherIsBetter: false,
    }),
    summary("totalEquityAndLiabilities", (s) => s.totalEquityAndLiabilities, {
      emphasis: true,
    }),
  ]
}

function buildSections(
  groups: BalanceSheetGroup[],
  higherIsBetter: boolean,
  currentYearProfitHref: string
): SectionBlock[] {
  return groups[0].sections.map(({ accType, title }) => {
    const matching = groups.map((group) =>
      group.sections.find((section) => section.accType === accType)
    )
    return {
      kind: "section",
      id: accType,
      title,
      accType,
      items: buildItems(
        matching.map((section) => section?.items ?? []),
        higherIsBetter,
        currentYearProfitHref
      ),
      canDrillDown: false,
      hideWhenEmpty: true,
      total: {
        id: `${accType}-total`,
        label: `Total ${title}`,
        higherIsBetter,
        cells: matching.map((section) =>
          section ? { amount: section.total, percent: section.percent } : ZERO
        ),
      },
    }
  })
}

function buildItems(
  columns: BalanceSheetItem[][],
  higherIsBetter: boolean,
  currentYearProfitHref: string
): ItemRow[] {
  const rows = new Map<string, ItemRow>()
  columns.forEach((items, index) => {
    for (const item of items) {
      const id = item.accountCode ?? item.calculated ?? item.accountName
      let row = rows.get(id)
      if (!row) {
        row = {
          id,
          accountCode: item.accountCode,
          label: item.accountName,
          higherIsBetter,
          canDrillDown: item.accountCode !== null,
          href:
            item.calculated === "current_year_profit"
              ? currentYearProfitHref
              : undefined,
          cells: columns.map(() => ZERO),
        }
        rows.set(id, row)
      }
      row.cells[index] = { amount: item.amount, percent: item.percent }
      if (item.hasStockValue) row.canDrillDown = false
    }
  })
  return [...rows.values()]
}

export interface Cell {
  amount: number
  percent: number
}

export interface StatementRow {
  id: string
  label: string
  /** One cell per statement, in the order the statements were given. */
  cells: Cell[]
  /** Whether an increase is good news; drives variance colouring. */
  higherIsBetter: boolean
}

export interface ItemRow extends StatementRow {
  /** Null for lines that are calculated rather than held in an account. */
  accountCode: string | null
  canDrillDown: boolean
  /** Where a calculated line is explained. */
  href?: string
}

export type SectionBlock = {
  kind: "section"
  id: string
  title: string
  /** AutoCount's account type, e.g. SL or FA. */
  accType: string
  items: ItemRow[]
  total: StatementRow
  canDrillDown: boolean
  /** Leave the section out while zero rows are hidden and none of its rows remain. */
  hideWhenEmpty: boolean
}

export type StatementBlock =
  | SectionBlock
  | { kind: "heading"; id: string; title: string }
  | { kind: "summary"; id: string; row: StatementRow; emphasis: boolean }

export const ZERO: Cell = { amount: 0, percent: 0 }

export function isZeroRow(row: { cells: Cell[] }): boolean {
  return row.cells.every((cell) => cell.amount === 0)
}

export interface Variance {
  amount: number
  percent: number | null
  tone: "good" | "bad" | "neutral"
}

export function getVariance(row: StatementRow): Variance {
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

interface VisibleBlock {
  block: StatementBlock
  items: ItemRow[]
}

/**
 * The rows left after search and zero-row hiding. A search shows matching accounts only,
 * since totals beside a partial list would look wrong.
 */
export function filterBlocks(
  blocks: StatementBlock[],
  { search, hideZeroRows }: { search: string; hideZeroRows: boolean }
): VisibleBlock[] {
  const term = search.trim().toLowerCase()

  return blocks.flatMap((block): VisibleBlock[] => {
    if (block.kind !== "section") return term ? [] : [{ block, items: [] }]
    const items = block.items.filter(
      (item) =>
        !(hideZeroRows && isZeroRow(item)) &&
        (!term ||
          item.label.toLowerCase().includes(term) ||
          item.accountCode?.toLowerCase().includes(term))
    )
    const hidden =
      items.length === 0 &&
      (term !== "" || (hideZeroRows && block.hideWhenEmpty))
    return hidden ? [] : [{ block, items }]
  })
}

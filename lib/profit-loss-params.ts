import { parseRange, single, type RawSearchParams } from "@/lib/report-params"

export type ProfitLossView = "period" | "monthly" | "quarterly"
export type ProfitLossCompareTo = "none" | "prior_year" | "budget"

export interface ProfitLossParams {
  fromDate: string
  toDate: string
  view: ProfitLossView
  compareTo: ProfitLossCompareTo
  budgetKey?: string
  projectNo?: string
  deptNo?: string
}

const VIEWS: ProfitLossView[] = ["period", "monthly", "quarterly"]

/** Reads the report's URL state, falling back to month-to-date vs prior year. */
export function parseProfitLossParams(raw: RawSearchParams): ProfitLossParams {
  const { fromDate, toDate } = parseRange(raw)
  const view = VIEWS.find((v) => v === single(raw.view)) ?? "period"

  const compare = single(raw.compare) ?? "prior_year"
  const budgetKey = /^budget:(\d{1,18})$/.exec(compare)?.[1]

  return {
    fromDate,
    toDate,
    view,
    compareTo: budgetKey
      ? "budget"
      : compare === "none"
        ? "none"
        : "prior_year",
    budgetKey,
    projectNo: single(raw.project),
    deptNo: single(raw.dept),
  }
}

/** The `compare` URL value for the current params. */
export function compareValue({
  compareTo,
  budgetKey,
}: Pick<ProfitLossParams, "compareTo" | "budgetKey">): string {
  return compareTo === "budget" ? `budget:${budgetKey}` : compareTo
}

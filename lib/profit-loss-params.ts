import {
  endOfMonth,
  endOfYear,
  format,
  isValid,
  parseISO,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns"

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

type RawSearchParams = Record<string, string | string[] | undefined>

const VIEWS: ProfitLossView[] = ["period", "monthly", "quarterly"]

function isoDate(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined
}

function parseDateParam(value: string | undefined): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  return isValid(parseISO(value)) ? value : undefined
}

/** Reads the report's URL state, falling back to month-to-date vs prior year. */
export function parseProfitLossParams(raw: RawSearchParams): ProfitLossParams {
  const today = new Date()
  let fromDate =
    parseDateParam(single(raw.fromDate)) ?? isoDate(startOfMonth(today))
  let toDate = parseDateParam(single(raw.toDate)) ?? isoDate(today)
  if (fromDate > toDate) [fromDate, toDate] = [toDate, fromDate]

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

export const PERIOD_PRESETS = {
  this_month: "This month",
  last_month: "Last month",
  ytd: "Year to date",
  last_year: "Last year",
} as const

export type PeriodPreset = keyof typeof PERIOD_PRESETS

export function presetRange(preset: PeriodPreset): {
  fromDate: string
  toDate: string
} {
  const today = new Date()
  const range = (from: Date, to: Date) => ({
    fromDate: isoDate(from),
    toDate: isoDate(to),
  })

  switch (preset) {
    // Month to date, so a comparison is like for like (the same days last year).
    case "this_month":
      return range(startOfMonth(today), today)
    case "last_month": {
      const lastMonth = subMonths(today, 1)
      return range(startOfMonth(lastMonth), endOfMonth(lastMonth))
    }
    case "ytd":
      return range(startOfYear(today), today)
    case "last_year": {
      const lastYear = subYears(today, 1)
      return range(startOfYear(lastYear), endOfYear(lastYear))
    }
  }
}

export function matchPreset(
  fromDate: string,
  toDate: string
): PeriodPreset | "custom" {
  const presets = Object.keys(PERIOD_PRESETS) as PeriodPreset[]
  return (
    presets.find((preset) => {
      const range = presetRange(preset)
      return range.fromDate === fromDate && range.toDate === toDate
    }) ?? "custom"
  )
}

export function formatRange(fromDate: string, toDate: string): string {
  const label = (date: string) => format(parseISO(date), "MMM d, yyyy")
  return `${label(fromDate)} – ${label(toDate)}`
}

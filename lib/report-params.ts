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

export type RawSearchParams = Record<string, string | string[] | undefined>

export function isoDate(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

/** A search param's value, ignoring empty and repeated ones. */
export function single(
  value: string | string[] | undefined
): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined
}

export function parseDateParam(
  value: string | string[] | undefined
): string | undefined {
  const date = single(value)
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined
  return isValid(parseISO(date)) ? date : undefined
}

export function formatDate(date: string): string {
  return format(parseISO(date), "MMM d, yyyy")
}

export function formatRange(fromDate: string, toDate: string): string {
  return `${formatDate(fromDate)} – ${formatDate(toDate)}`
}

/** The fromDate / toDate params, falling back to the month to date. */
export function parseRange(raw: RawSearchParams): {
  fromDate: string
  toDate: string
} {
  const today = new Date()
  const fromDate = parseDateParam(raw.fromDate) ?? isoDate(startOfMonth(today))
  const toDate = parseDateParam(raw.toDate) ?? isoDate(today)
  return fromDate <= toDate
    ? { fromDate, toDate }
    : { fromDate: toDate, toDate: fromDate }
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

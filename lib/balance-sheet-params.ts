import { endOfMonth, endOfYear, subMonths, subYears } from "date-fns"

import {
  isoDate,
  parseDateParam,
  single,
  type RawSearchParams,
} from "@/lib/report-params"

export interface BalanceSheetParams {
  asOfDate: string
  compareTo: "none" | "prior_year"
  projectNo?: string
  deptNo?: string
}

export function parseBalanceSheetParams(
  raw: RawSearchParams
): BalanceSheetParams {
  return {
    asOfDate: parseDateParam(raw.asOf) ?? isoDate(new Date()),
    compareTo: single(raw.compare) === "none" ? "none" : "prior_year",
    projectNo: single(raw.project),
    deptNo: single(raw.dept),
  }
}

export const AS_OF_PRESETS = {
  today: "Today",
  last_month_end: "End of last month",
  last_year_end: "End of last year",
} as const

export type AsOfPreset = keyof typeof AS_OF_PRESETS

export function presetDate(preset: AsOfPreset): string {
  const today = new Date()
  switch (preset) {
    case "today":
      return isoDate(today)
    case "last_month_end":
      return isoDate(endOfMonth(subMonths(today, 1)))
    case "last_year_end":
      return isoDate(endOfYear(subYears(today, 1)))
  }
}

export function matchAsOfPreset(asOfDate: string): AsOfPreset | "custom" {
  const presets = Object.keys(AS_OF_PRESETS) as AsOfPreset[]
  return presets.find((preset) => presetDate(preset) === asOfDate) ?? "custom"
}

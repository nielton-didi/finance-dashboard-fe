import {
  parseAsOfDate,
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
    asOfDate: parseAsOfDate(raw),
    compareTo: single(raw.compare) === "none" ? "none" : "prior_year",
    projectNo: single(raw.project),
    deptNo: single(raw.dept),
  }
}

import { parseRange, single, type RawSearchParams } from "@/lib/report-params"

export interface CashFlowParams {
  fromDate: string
  toDate: string
  compareTo: "none" | "prior_year"
  projectNo?: string
  deptNo?: string
}

export function parseCashFlowParams(raw: RawSearchParams): CashFlowParams {
  return {
    ...parseRange(raw),
    compareTo: single(raw.compare) === "none" ? "none" : "prior_year",
    projectNo: single(raw.project),
    deptNo: single(raw.dept),
  }
}

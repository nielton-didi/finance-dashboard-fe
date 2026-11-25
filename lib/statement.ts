import { apiFetch } from "@/lib/api"

export interface StatementTransaction {
  key: string
  date: string
  accountCode: string
  accountName: string
  description: string | null
  reference: string | null
  journalType: string
  projectNo: string | null
  deptNo: string | null
  debit: number
  credit: number
}

export interface StatementTransactions {
  rows: StatementTransaction[]
  totalCount: number
  /** Included in the totals; always zero for P&L accounts. */
  openingDebit: number
  openingCredit: number
  totalDebit: number
  totalCredit: number
  truncated: boolean
}

export interface StatementFilterOptions {
  projects: { code: string; name: string }[]
  departments: { code: string; name: string }[]
  budgets: { key: string; name: string }[]
}

export const NO_FILTER_OPTIONS: StatementFilterOptions = {
  projects: [],
  departments: [],
  budgets: [],
}

/** Builds an organization-scoped API path, leaving out empty query values. */
export function statementPath(
  orgId: number,
  path: string,
  query: Record<string, string | number | undefined> = {}
): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value))
  }
  const qs = params.toString()
  return `/organizations/${orgId}/${path}${qs ? `?${qs}` : ""}`
}

/** Projects, departments and budgets come from AutoCount, the same for every report. */
export async function getStatementFilterOptions(
  orgId: number
): Promise<StatementFilterOptions> {
  return apiFetch(statementPath(orgId, "profit-loss/filters"))
}

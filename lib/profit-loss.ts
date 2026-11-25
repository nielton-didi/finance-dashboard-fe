import { apiFetch } from "@/lib/api"
import type { ProfitLossParams } from "@/lib/profit-loss-params"

export type ProfitLossAccType = "SL" | "SA" | "CO" | "OI" | "EP" | "TX"

export interface ProfitLossItem {
  accountCode: string
  accountName: string
  amount: number
  percent: number
  /** Includes a stock valuation, which has no ledger lines to drill into. */
  hasStockValue: boolean
}

export interface ProfitLossSection {
  accType: ProfitLossAccType
  title: string
  items: ProfitLossItem[]
  total: number
  percent: number
}

export interface ProfitLossSummaryRow {
  label: string
  amount: number
  percent: number
}

export interface ProfitLossStatement {
  companyName: string
  fromDate: string
  toDate: string
  sales: ProfitLossSection
  salesAdjustments: ProfitLossSection
  netSales: ProfitLossSummaryRow
  costOfGoodsSold: ProfitLossSection
  grossProfit: ProfitLossSummaryRow
  otherIncomes: ProfitLossSection
  expenses: ProfitLossSection
  /** Before taxation. */
  netProfit: ProfitLossSummaryRow
  taxation: ProfitLossSection
  netProfitAfterTax: ProfitLossSummaryRow
}

export interface ProfitLossComparison {
  kind: "prior_year" | "budget"
  label: string
  fromDate: string
  toDate: string
  statement: ProfitLossStatement
}

export interface ProfitLossReportData extends ProfitLossStatement {
  comparison: ProfitLossComparison | null
  notes: string[]
}

export interface ProfitLossBreakdown {
  interval: "monthly" | "quarterly"
  columns: { key: string; label: string; statement: ProfitLossStatement }[]
  total: ProfitLossStatement
  notes: string[]
}

export interface ProfitLossTrend {
  year: number
  months: { month: number; current: number; prior: number }[]
}

export interface ProfitLossTransaction {
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

export interface ProfitLossTransactions {
  rows: ProfitLossTransaction[]
  totalCount: number
  totalDebit: number
  totalCredit: number
  truncated: boolean
}

export interface ProfitLossFilterOptions {
  projects: { code: string; name: string }[]
  departments: { code: string; name: string }[]
  budgets: { key: string; name: string }[]
}

export interface ProfitLossTransactionsQuery {
  fromDate: string
  toDate: string
  projectNo?: string
  deptNo?: string
  accountNo?: string
  accType?: ProfitLossAccType
}

function buildPath(
  orgId: number,
  path: string,
  query: Record<string, string | number | undefined> = {}
): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value))
  }
  const qs = params.toString()
  return `/organizations/${orgId}/profit-loss${path}${qs ? `?${qs}` : ""}`
}

function dimensions({ projectNo, deptNo }: ProfitLossParams) {
  return { projectNo, deptNo }
}

export async function getProfitLoss(
  orgId: number,
  params: ProfitLossParams
): Promise<ProfitLossReportData> {
  const { fromDate, toDate, compareTo, budgetKey } = params
  return apiFetch(
    buildPath(orgId, "", {
      fromDate,
      toDate,
      compareTo,
      budgetKey,
      ...dimensions(params),
    })
  )
}

export async function getProfitLossBreakdown(
  orgId: number,
  params: ProfitLossParams,
  interval: ProfitLossBreakdown["interval"]
): Promise<ProfitLossBreakdown> {
  const { fromDate, toDate } = params
  return apiFetch(
    buildPath(orgId, "/breakdown", {
      fromDate,
      toDate,
      interval,
      ...dimensions(params),
    })
  )
}

export async function getProfitLossTrend(
  orgId: number,
  params: ProfitLossParams
): Promise<ProfitLossTrend> {
  return apiFetch(
    buildPath(orgId, "/trend", {
      year: Number(params.toDate.slice(0, 4)),
      ...dimensions(params),
    })
  )
}

export async function getProfitLossFilterOptions(
  orgId: number
): Promise<ProfitLossFilterOptions> {
  return apiFetch(buildPath(orgId, "/filters"))
}

export async function getProfitLossTransactions(
  orgId: number,
  query: ProfitLossTransactionsQuery
): Promise<ProfitLossTransactions> {
  return apiFetch(buildPath(orgId, "/transactions", { ...query }))
}

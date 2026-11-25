import { apiFetch } from "@/lib/api"
import type { ProfitLossParams } from "@/lib/profit-loss-params"
import { statementPath, type StatementTransactions } from "@/lib/statement"

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

export interface ProfitLossTransactionsQuery {
  fromDate: string
  toDate: string
  projectNo?: string
  deptNo?: string
  accountNo?: string
  accType?: ProfitLossAccType
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
    statementPath(orgId, "profit-loss", {
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
    statementPath(orgId, "profit-loss/breakdown", {
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
    statementPath(orgId, "profit-loss/trend", {
      year: Number(params.toDate.slice(0, 4)),
      ...dimensions(params),
    })
  )
}

export async function getProfitLossTransactions(
  orgId: number,
  query: ProfitLossTransactionsQuery
): Promise<StatementTransactions> {
  return apiFetch(
    statementPath(orgId, "profit-loss/transactions", { ...query })
  )
}

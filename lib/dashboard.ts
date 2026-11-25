import { apiFetch } from "@/lib/api"
import type { ProfitLossTrend } from "@/lib/profit-loss"
import { statementPath } from "@/lib/statement"

export interface DashboardPerformance {
  fromDate: string
  toDate: string
  netSales: number
  grossProfit: number
  /** After tax, as on the Profit & Loss report. */
  netProfit: number
}

export interface DashboardMetrics {
  mtd: DashboardPerformance
  /** Since the start of the fiscal year. */
  ytd: DashboardPerformance
  ttm: DashboardPerformance
  position: {
    cash: number
    tradeDebtors: number
    stock: number
    currentAssets: number
    currentLiabilities: number
    workingCapital: number
    totalAssets: number
    totalLiabilities: number
    equity: number
  }
}

export interface DashboardDocument {
  key: string
  date: string
  reference: string | null
  journalType: string
  description: string | null
  amount: number
}

export interface DashboardData {
  companyName: string
  asOfDate: string
  fiscalYearStart: string
  current: DashboardMetrics
  prior: DashboardMetrics
  trend: ProfitLossTrend
  topExpenses: { accountCode: string; accountName: string; amount: number }[]
  otherExpenses: { count: number; amount: number }
  cashFlow: {
    operating: number
    investing: number
    financing: number
    netChange: number
  }
  recentDocuments: DashboardDocument[]
  outOfBalance: number
  unreconciled: number
  notes: string[]
}

export async function getDashboard(
  orgId: number,
  asOfDate: string
): Promise<DashboardData> {
  return apiFetch(statementPath(orgId, "dashboard", { asOfDate }))
}

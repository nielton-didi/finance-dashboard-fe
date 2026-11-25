import { apiFetch } from "@/lib/api"
import type { BalanceSheetParams } from "@/lib/balance-sheet-params"
import { statementPath, type StatementTransactions } from "@/lib/statement"

export interface BalanceSheetItem {
  /** Null for lines that are calculated rather than held in an account. */
  accountCode: string | null
  calculated:
    | "retained_brought_forward"
    | "current_year_profit"
    | "current_year_other"
    | null
  accountName: string
  amount: number
  percent: number
  /** Includes a stock valuation, which has no ledger lines to drill into. */
  hasStockValue: boolean
}

export interface BalanceSheetSection {
  accType: string
  title: string
  items: BalanceSheetItem[]
  total: number
  percent: number
}

export interface BalanceSheetTotal {
  label: string
  amount: number
  percent: number
}

export interface BalanceSheetGroup extends BalanceSheetTotal {
  sections: BalanceSheetSection[]
}

export interface BalanceSheetStatement {
  companyName: string
  asOfDate: string
  fiscalYearStart: string
  nonCurrentAssets: BalanceSheetGroup
  currentAssets: BalanceSheetGroup
  totalAssets: BalanceSheetTotal
  equity: BalanceSheetGroup
  nonCurrentLiabilities: BalanceSheetGroup
  currentLiabilities: BalanceSheetGroup
  totalLiabilities: BalanceSheetTotal
  totalEquityAndLiabilities: BalanceSheetTotal
  /** Zero when the sheet balances. */
  outOfBalance: number
  assetComposition: { key: string; label: string; amount: number }[]
}

export interface BalanceSheetReportData extends BalanceSheetStatement {
  comparison: {
    kind: "prior_year"
    label: string
    asOfDate: string
    statement: BalanceSheetStatement
  } | null
  notes: string[]
}

export interface BalanceSheetTransactionsQuery {
  asOfDate: string
  accountNo: string
  projectNo?: string
  deptNo?: string
}

export async function getBalanceSheet(
  orgId: number,
  params: BalanceSheetParams
): Promise<BalanceSheetReportData> {
  return apiFetch(statementPath(orgId, "balance-sheet", { ...params }))
}

export async function getBalanceSheetTransactions(
  orgId: number,
  query: BalanceSheetTransactionsQuery
): Promise<StatementTransactions> {
  return apiFetch(
    statementPath(orgId, "balance-sheet/transactions", { ...query })
  )
}

import { apiFetch } from "@/lib/api"
import type { CashFlowParams } from "@/lib/cash-flow-params"
import { statementPath, type StatementTransactions } from "@/lib/statement"

export interface CashFlowItem {
  id: string
  kind: "net_profit" | "reclassified" | "depreciation" | "stock" | "account"
  /** Null for lines that are calculated from several accounts. */
  accountCode: string | null
  label: string
  /** Positive is cash in, negative is cash out. */
  amount: number
}

export interface CashFlowSection {
  key: "operating" | "investing" | "financing"
  title: string
  items: CashFlowItem[]
  totalLabel: string
  total: number
}

export interface CashFlowStatement {
  companyName: string
  fromDate: string
  toDate: string
  operating: CashFlowSection
  investing: CashFlowSection
  financing: CashFlowSection
  netChange: number
  openingCash: number
  closingCash: number
  cashAccounts: { accountCode: string; accountName: string; amount: number }[]
  /** Zero when opening cash plus the net change equals closing cash. */
  unreconciled: number
}

export interface CashFlowReportData extends CashFlowStatement {
  comparison: {
    kind: "prior_year"
    label: string
    fromDate: string
    toDate: string
    statement: CashFlowStatement
  } | null
  notes: string[]
}

export interface CashFlowTransactionsQuery {
  fromDate: string
  toDate: string
  accountNo: string
  projectNo?: string
  deptNo?: string
}

export async function getCashFlow(
  orgId: number,
  params: CashFlowParams
): Promise<CashFlowReportData> {
  return apiFetch(statementPath(orgId, "cash-flow", { ...params }))
}

export async function getCashFlowTransactions(
  orgId: number,
  query: CashFlowTransactionsQuery
): Promise<StatementTransactions> {
  return apiFetch(statementPath(orgId, "cash-flow/transactions", { ...query }))
}

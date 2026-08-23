import { apiFetch } from "@/lib/api"

export interface ProfitLossItem {
  accountCode: string
  accountName: string
  amount: number
  percent: number
}

export interface ProfitLossSection {
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

export interface ProfitLossResponse {
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
  netProfit: ProfitLossSummaryRow
}

export async function getProfitLoss(
  orgId: number,
  fromDate: string,
  toDate: string
): Promise<ProfitLossResponse> {
  const params = new URLSearchParams({ fromDate, toDate })
  return apiFetch<ProfitLossResponse>(
    `/organizations/${orgId}/profit-loss?${params.toString()}`
  )
}

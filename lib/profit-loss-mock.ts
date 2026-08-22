// TODO: replace with a real API call to the backend once it's available
import { organizations } from "@/config/organizations"

export interface ProfitLossItem {
  accountCode: string
  accountName: string
  amount: number
}

export interface ProfitLossSection {
  title: string
  items: ProfitLossItem[]
  total: number
}

export interface ProfitLossResponse {
  companyName: string
  fromDate: string
  toDate: string
  sales: ProfitLossSection
  salesAdjustments: ProfitLossSection
  netSales: number
  costOfGoodsSold: ProfitLossSection
  grossProfit: number
  otherIncomes: ProfitLossSection
  expenses: ProfitLossSection
  netProfit: number
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

function buildSection(title: string, items: ProfitLossItem[]): ProfitLossSection {
  const total = round(items.reduce((sum, item) => sum + item.amount, 0))
  return { title, items, total }
}

export function getMockProfitLoss(
  orgId: string,
  fromDate: string,
  toDate: string
): ProfitLossResponse {
  const companyName = organizations.find((org) => org.id === orgId)?.name ?? orgId

  const sales = buildSection("Sales", [
    { accountCode: "500-0000", accountName: "Sales", amount: 180_460 },
    { accountCode: "500-1000", accountName: "Cash Sales", amount: 41_430 },
  ])

  const salesAdjustments = buildSection("Sales Adjustments", [
    { accountCode: "510-0000", accountName: "Sales Return", amount: 1_860 },
  ])

  const netSales = round(sales.total - salesAdjustments.total)

  const costOfGoodsSold = buildSection("Cost of Goods Sold", [
    { accountCode: "600-0000", accountName: "Stock-Opening", amount: 18_000 },
    { accountCode: "610-0000", accountName: "Purchases", amount: 69_800 },
    { accountCode: "610-1000", accountName: "Cash Purchase", amount: 600 },
    { accountCode: "612-0000", accountName: "Purchases Return", amount: -740 },
  ])

  const grossProfit = round(netSales - costOfGoodsSold.total)

  const otherIncomes = buildSection("Other Incomes", [
    { accountCode: "555-0000", accountName: "Repair & Service", amount: 100 },
  ])

  const expenses = buildSection("Expenses", [
    { accountCode: "901-0000", accountName: "Advertisement", amount: 5_600 },
    { accountCode: "904-0000", accountName: "Salaries", amount: 44_000 },
    { accountCode: "905-0000", accountName: "Travelling Expenses", amount: 2_000 },
    { accountCode: "906-0000", accountName: "Upkeep of Motor Vehicle", amount: 3_000 },
    { accountCode: "907-0000", accountName: "Water & Electricity", amount: 1_500 },
    { accountCode: "909-0000", accountName: "Telephone Charges", amount: 400 },
    { accountCode: "910-0000", accountName: "Printing & Stationery", amount: 500 },
    { accountCode: "912-0000", accountName: "Postages & Stamps", amount: 200 },
    { accountCode: "913-0000", accountName: "Commission & Allowances", amount: 600 },
    { accountCode: "914-0000", accountName: "Office Rental", amount: 3_600 },
    { accountCode: "915-0000", accountName: "General Expenses", amount: 200 },
  ])

  const netProfit = round(grossProfit + otherIncomes.total - expenses.total)

  return {
    companyName,
    fromDate,
    toDate,
    sales,
    salesAdjustments,
    netSales,
    costOfGoodsSold,
    grossProfit,
    otherIncomes,
    expenses,
    netProfit,
  }
}

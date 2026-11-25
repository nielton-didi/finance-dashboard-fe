import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { DashboardKpis } from "@/components/dashboard/dashboard-kpis"
import { PerformanceCard } from "@/components/dashboard/performance-card"
import { RecentDocumentsCard } from "@/components/dashboard/recent-documents-card"
import { ReportCard } from "@/components/dashboard/report-card"
import { NetSalesTrendCard } from "@/components/profit-loss/net-sales-trend-card"
import { BarList, type BarListItem } from "@/components/statement/bar-list"
import {
  isDisplayableError,
  ReportError,
} from "@/components/statement/report-error"
import {
  ReportContent,
  ReportNavigationProvider,
} from "@/components/statement/report-navigation"
import { getDashboard, type DashboardData } from "@/lib/dashboard"
import { orgPath } from "@/lib/org-routes"
import { formatDate, formatRange, parseAsOfDate } from "@/lib/report-params"
import { formatAmount } from "@/lib/statement-format"

async function loadDashboard(orgId: number, asOfDate: string) {
  try {
    return { data: await getDashboard(orgId, asOfDate), error: null }
  } catch (error) {
    if (isDisplayableError(error)) return { error }
    throw error
  }
}

function expenseItems({
  topExpenses,
  otherExpenses,
}: DashboardData): BarListItem[] {
  const items = topExpenses.map(({ accountCode, accountName, amount }) => ({
    key: accountCode,
    label: accountName,
    value: amount,
  }))
  if (otherExpenses.count > 0) {
    items.push({
      key: "other",
      label: `Other (${otherExpenses.count} accounts)`,
      value: otherExpenses.amount,
    })
  }
  return items
}

/** Problems in the books that make the figures below unreliable. */
function DataWarnings({ data }: { data: DashboardData }) {
  const warnings = [
    data.outOfBalance !== 0 &&
      `The balance sheet is out by RM ${formatAmount(data.outOfBalance)}.`,
    data.unreconciled !== 0 &&
      `The cash flow differs from the bank and cash balances by RM ${formatAmount(data.unreconciled)}.`,
  ].filter((warning) => warning !== false)
  if (warnings.length === 0) return null

  return (
    <div
      role="alert"
      className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {warnings.join(" ")}
    </div>
  )
}

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { orgId } = await params
  const asOfDate = parseAsOfDate(await searchParams)
  const report = await loadDashboard(Number(orgId), asOfDate)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <ReportNavigationProvider>
        <DashboardFilters asOfDate={asOfDate} />
        <ReportContent>
          {report.error ? (
            <ReportError error={report.error} />
          ) : (
            <Dashboard orgId={orgId} data={report.data} />
          )}
        </ReportContent>
      </ReportNavigationProvider>
    </div>
  )
}

function Dashboard({ orgId, data }: { orgId: string; data: DashboardData }) {
  const { asOfDate, cashFlow, current } = data
  const { fromDate, toDate } = current.ytd
  const yearToDate = formatRange(fromDate, toDate)
  const rangeQuery = new URLSearchParams({ fromDate, toDate })
  const expenses = expenseItems(data)
  const { position } = current

  return (
    <>
      <DataWarnings data={data} />
      <DashboardKpis data={data} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <NetSalesTrendCard
          className="lg:col-span-2"
          trend={data.trend}
          lastMonth={Number(asOfDate.slice(5, 7))}
        />
        <ReportCard
          title="Largest expenses"
          description={`${yearToDate} (RM)`}
          href={`${orgPath(orgId, "profit-loss")}?${rangeQuery}`}
        >
          {expenses.length > 0 ? (
            <BarList items={expenses} />
          ) : (
            <p className="text-sm text-muted-foreground">
              No expenses in this period.
            </p>
          )}
        </ReportCard>
      </div>

      <PerformanceCard data={data} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportCard
          title="Financial position"
          description={`As of ${formatDate(asOfDate)} (RM)`}
          href={`${orgPath(orgId, "balance-sheet")}?${new URLSearchParams({ asOf: asOfDate })}`}
        >
          <BarList
            items={[
              {
                key: "currentAssets",
                label: "Current assets",
                value: position.currentAssets,
              },
              {
                key: "currentLiabilities",
                label: "Current liabilities",
                value: position.currentLiabilities,
              },
              {
                key: "tradeDebtors",
                label: "Trade debtors",
                value: position.tradeDebtors,
              },
              { key: "stock", label: "Stock", value: position.stock },
              { key: "equity", label: "Equity", value: position.equity },
            ]}
          />
        </ReportCard>
        <ReportCard
          title="Cash flow"
          description={`${yearToDate} (RM)`}
          href={`${orgPath(orgId, "cash-flow")}?${rangeQuery}`}
        >
          <BarList
            items={[
              {
                key: "operating",
                label: "Operating",
                value: cashFlow.operating,
              },
              {
                key: "investing",
                label: "Investing",
                value: cashFlow.investing,
              },
              {
                key: "financing",
                label: "Financing",
                value: cashFlow.financing,
              },
              {
                key: "netChange",
                label: "Net movement",
                value: cashFlow.netChange,
              },
            ]}
          />
        </ReportCard>
      </div>

      <RecentDocumentsCard documents={data.recentDocuments} />

      {data.notes.length > 0 && (
        <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
          {data.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </>
  )
}

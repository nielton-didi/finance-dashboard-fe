import { CompanyRankingCard } from "@/components/group/company-ranking-card"
import { OverviewFilters } from "@/components/group/group-filters"
import {
  GroupAlerts,
  GroupEmpty,
  GroupNotes,
} from "@/components/group/group-messages"
import { OverviewKpis } from "@/components/group/overview-kpis"
import { OverviewTable } from "@/components/group/overview-table"
import {
  isDisplayableError,
  ReportError,
} from "@/components/statement/report-error"
import {
  ReportContent,
  ReportNavigationProvider,
} from "@/components/statement/report-navigation"
import { getGroupOverview } from "@/lib/group"
import { formatDate, parseAsOfDate } from "@/lib/report-params"

async function loadReport(asOfDate: string) {
  try {
    return { data: await getGroupOverview(asOfDate), error: null }
  } catch (error) {
    if (isDisplayableError(error)) return { error }
    throw error
  }
}

export default async function GroupOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const asOfDate = parseAsOfDate(await searchParams)
  const report = await loadReport(asOfDate)
  const description = `Year to date, up to ${formatDate(asOfDate)} (RM)`

  return (
    <ReportNavigationProvider>
      <OverviewFilters asOfDate={asOfDate} />
      <ReportContent>
        {report.error ? (
          <ReportError error={report.error} />
        ) : (
          <>
            <GroupAlerts report={report.data} />
            {report.data.companies.length === 0 ? (
              <GroupEmpty />
            ) : (
              <>
                <OverviewKpis report={report.data} />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <CompanyRankingCard
                    title="Net sales by company"
                    description={description}
                    companies={report.data.companies}
                    value={(metrics) => metrics.ytd.netSales}
                  />
                  <CompanyRankingCard
                    title="Net profit by company"
                    description={description}
                    companies={report.data.companies}
                    value={(metrics) => metrics.ytd.netProfit}
                  />
                </div>
                <OverviewTable report={report.data} />
              </>
            )}
            <GroupNotes report={report.data} />
          </>
        )}
      </ReportContent>
    </ReportNavigationProvider>
  )
}

import { CompanyRankingCard } from "@/components/group/company-ranking-card"
import { ConsolidatedKpis } from "@/components/group/consolidated-kpis"
import { ConsolidatedTable } from "@/components/group/consolidated-table"
import { ConsolidatedFilters } from "@/components/group/group-filters"
import {
  GroupAlerts,
  GroupEmpty,
  GroupNotes,
} from "@/components/group/group-messages"
import {
  isDisplayableError,
  ReportError,
} from "@/components/statement/report-error"
import {
  ReportContent,
  ReportNavigationProvider,
} from "@/components/statement/report-navigation"
import { getGroupConsolidated } from "@/lib/group"
import { formatDate, formatRange, parseRange } from "@/lib/report-params"

async function loadReport(fromDate: string, toDate: string) {
  try {
    return { data: await getGroupConsolidated(fromDate, toDate), error: null }
  } catch (error) {
    if (isDisplayableError(error)) return { error }
    throw error
  }
}

export default async function ConsolidatedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { fromDate, toDate } = parseRange(await searchParams)
  const report = await loadReport(fromDate, toDate)

  return (
    <ReportNavigationProvider>
      <ConsolidatedFilters fromDate={fromDate} toDate={toDate} />
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
                <ConsolidatedKpis report={report.data} />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <CompanyRankingCard
                    title="Net profit by company"
                    description={`${formatRange(fromDate, toDate)} (RM)`}
                    companies={report.data.companies}
                    value={(metrics) => metrics.netProfit}
                  />
                  <CompanyRankingCard
                    title="Cash and bank by company"
                    description={`As of ${formatDate(toDate)} (RM)`}
                    companies={report.data.companies}
                    value={(metrics) => metrics.cash}
                  />
                </div>
                <ConsolidatedTable report={report.data} />
              </>
            )}
            <GroupNotes report={report.data} />
          </>
        )}
      </ReportContent>
    </ReportNavigationProvider>
  )
}

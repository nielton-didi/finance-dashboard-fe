import { ProfitLossCharts } from "@/components/profit-loss/profit-loss-charts"
import { ProfitLossFilters } from "@/components/profit-loss/profit-loss-filters"
import { ProfitLossKpis } from "@/components/profit-loss/profit-loss-kpis"
import { ProfitLossStatementCard } from "@/components/profit-loss/profit-loss-statement-card"
import {
  ReportContent,
  ReportNavigationProvider,
} from "@/components/statement/report-navigation"
import {
  isDisplayableError,
  ReportError,
} from "@/components/statement/report-error"
import {
  getProfitLoss,
  getProfitLossBreakdown,
  getProfitLossTrend,
} from "@/lib/profit-loss"
import {
  parseProfitLossParams,
  type ProfitLossParams,
} from "@/lib/profit-loss-params"
import { getStatementFilterOptions, NO_FILTER_OPTIONS } from "@/lib/statement"

async function loadReport(orgId: number, params: ProfitLossParams) {
  try {
    const [data, trend, breakdown] = await Promise.all([
      getProfitLoss(orgId, params),
      getProfitLossTrend(orgId, params),
      params.view === "period"
        ? null
        : getProfitLossBreakdown(orgId, params, params.view),
    ])
    return { data, trend, breakdown, error: null }
  } catch (error) {
    if (isDisplayableError(error)) return { error }
    throw error
  }
}

function fallBackToNoOptions(error: unknown) {
  if (isDisplayableError(error)) return NO_FILTER_OPTIONS
  throw error
}

function lastMonthWithData(year: number): number {
  const today = new Date()
  if (year < today.getFullYear()) return 12
  return year === today.getFullYear() ? today.getMonth() + 1 : 0
}

export default async function ProfitLossPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const orgId = Number((await params).orgId)
  const reportParams = parseProfitLossParams(await searchParams)

  const [report, options] = await Promise.all([
    loadReport(orgId, reportParams),
    getStatementFilterOptions(orgId).catch(fallBackToNoOptions),
  ])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <ReportNavigationProvider>
        <ProfitLossFilters params={reportParams} options={options} />
        <ReportContent>
          {report.error ? (
            <ReportError error={report.error} />
          ) : (
            <>
              <ProfitLossKpis data={report.data} />
              <ProfitLossCharts
                statement={report.data}
                trend={report.trend}
                lastTrendMonth={lastMonthWithData(report.trend.year)}
              />
              <ProfitLossStatementCard
                orgId={orgId}
                params={reportParams}
                data={report.data}
                breakdown={report.breakdown}
              />
            </>
          )}
        </ReportContent>
      </ReportNavigationProvider>
    </div>
  )
}

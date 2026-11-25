import { ProfitLossCharts } from "@/components/profit-loss/profit-loss-charts"
import { ProfitLossFilters } from "@/components/profit-loss/profit-loss-filters"
import { ProfitLossKpis } from "@/components/profit-loss/profit-loss-kpis"
import { ProfitLossStatementCard } from "@/components/profit-loss/profit-loss-statement-card"
import {
  ReportContent,
  ReportNavigationProvider,
} from "@/components/profit-loss/report-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { ApiError } from "@/lib/api"
import {
  getProfitLoss,
  getProfitLossBreakdown,
  getProfitLossFilterOptions,
  getProfitLossTrend,
  type ProfitLossFilterOptions,
} from "@/lib/profit-loss"
import {
  parseProfitLossParams,
  type ProfitLossParams,
} from "@/lib/profit-loss-params"

const NO_OPTIONS: ProfitLossFilterOptions = {
  projects: [],
  departments: [],
  budgets: [],
}

/**
 * Autocount connection problems and rejected filters (e.g. a deleted budget, or a
 * breakdown over too many months) are shown in place, so the filters stay usable.
 */
function isDisplayable(error: unknown): error is ApiError {
  return (
    error instanceof ApiError &&
    (Boolean(error.reason) ||
      error.statusCode === 400 ||
      error.statusCode === 404)
  )
}

function ReportError({ error }: { error: ApiError }) {
  const message = !error.reason
    ? "This report can't be shown with the current filters."
    : error.reason === "NOT_CONFIGURED"
      ? "This organization's Autocount database hasn't been set up yet. Add its connection details in Settings > AutoCount Database."
      : "This organization's Autocount database isn't reachable right now. Please try again later."

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="font-medium">{message}</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </CardContent>
    </Card>
  )
}

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
    if (isDisplayable(error)) return { error }
    throw error
  }
}

async function loadFilterOptions(orgId: number) {
  try {
    return await getProfitLossFilterOptions(orgId)
  } catch (error) {
    if (isDisplayable(error)) return NO_OPTIONS
    throw error
  }
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
    loadFilterOptions(orgId),
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

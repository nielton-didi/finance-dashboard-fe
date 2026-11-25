import { CashFlowCard } from "@/components/cash-flow/cash-flow-card"
import { CashFlowCharts } from "@/components/cash-flow/cash-flow-charts"
import { CashFlowFilters } from "@/components/cash-flow/cash-flow-filters"
import { CashFlowKpis } from "@/components/cash-flow/cash-flow-kpis"
import {
  isDisplayableError,
  ReportError,
} from "@/components/statement/report-error"
import {
  ReportContent,
  ReportNavigationProvider,
} from "@/components/statement/report-navigation"
import { getCashFlow } from "@/lib/cash-flow"
import {
  parseCashFlowParams,
  type CashFlowParams,
} from "@/lib/cash-flow-params"
import { getStatementFilterOptions, NO_FILTER_OPTIONS } from "@/lib/statement"

async function loadReport(orgId: number, params: CashFlowParams) {
  try {
    return { data: await getCashFlow(orgId, params), error: null }
  } catch (error) {
    if (isDisplayableError(error)) return { error }
    throw error
  }
}

function fallBackToNoOptions(error: unknown) {
  if (isDisplayableError(error)) return NO_FILTER_OPTIONS
  throw error
}

export default async function CashFlowPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const orgId = Number((await params).orgId)
  const reportParams = parseCashFlowParams(await searchParams)

  const [report, options] = await Promise.all([
    loadReport(orgId, reportParams),
    getStatementFilterOptions(orgId).catch(fallBackToNoOptions),
  ])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <ReportNavigationProvider>
        <CashFlowFilters params={reportParams} options={options} />
        <ReportContent>
          {report.error ? (
            <ReportError error={report.error} />
          ) : (
            <>
              <CashFlowKpis data={report.data} />
              <CashFlowCharts statement={report.data} />
              <CashFlowCard
                orgId={orgId}
                params={reportParams}
                data={report.data}
              />
            </>
          )}
        </ReportContent>
      </ReportNavigationProvider>
    </div>
  )
}

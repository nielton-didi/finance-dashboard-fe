import { BalanceSheetCard } from "@/components/balance-sheet/balance-sheet-card"
import { BalanceSheetCharts } from "@/components/balance-sheet/balance-sheet-charts"
import { BalanceSheetFilters } from "@/components/balance-sheet/balance-sheet-filters"
import { BalanceSheetKpis } from "@/components/balance-sheet/balance-sheet-kpis"
import {
  isDisplayableError,
  ReportError,
} from "@/components/statement/report-error"
import {
  ReportContent,
  ReportNavigationProvider,
} from "@/components/statement/report-navigation"
import { getBalanceSheet } from "@/lib/balance-sheet"
import {
  parseBalanceSheetParams,
  type BalanceSheetParams,
} from "@/lib/balance-sheet-params"
import { getStatementFilterOptions, NO_FILTER_OPTIONS } from "@/lib/statement"

async function loadReport(orgId: number, params: BalanceSheetParams) {
  try {
    return { data: await getBalanceSheet(orgId, params), error: null }
  } catch (error) {
    if (isDisplayableError(error)) return { error }
    throw error
  }
}

function fallBackToNoOptions(error: unknown) {
  if (isDisplayableError(error)) return NO_FILTER_OPTIONS
  throw error
}

export default async function BalanceSheetPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const orgId = Number((await params).orgId)
  const reportParams = parseBalanceSheetParams(await searchParams)

  const [report, options] = await Promise.all([
    loadReport(orgId, reportParams),
    getStatementFilterOptions(orgId).catch(fallBackToNoOptions),
  ])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <ReportNavigationProvider>
        <BalanceSheetFilters params={reportParams} options={options} />
        <ReportContent>
          {report.error ? (
            <ReportError error={report.error} />
          ) : (
            <>
              <BalanceSheetKpis data={report.data} />
              <BalanceSheetCharts statement={report.data} />
              <BalanceSheetCard
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

"use client"

import * as React from "react"

import { useReportNavigation } from "@/components/statement/report-navigation"
import { StatementCard } from "@/components/statement/statement-card"
import type { StatementColumn } from "@/components/statement/statement-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchProfitLossTransactions } from "@/lib/actions/profit-loss"
import type {
  ProfitLossAccType,
  ProfitLossBreakdown,
  ProfitLossReportData,
} from "@/lib/profit-loss"
import type { ProfitLossParams } from "@/lib/profit-loss-params"
import { buildStatementBlocks } from "@/lib/profit-loss-rows"
import { formatRange } from "@/lib/report-params"

const STOCK_NOTE =
  "Opening and closing stock values are not ledger lines, so these totals differ from the statement by those amounts."

export function ProfitLossStatementCard({
  orgId,
  params,
  data,
  breakdown,
}: {
  orgId: number
  params: ProfitLossParams
  data: ProfitLossReportData
  /** Set for the monthly and quarterly views. */
  breakdown: ProfitLossBreakdown | null
}) {
  const { setParams } = useReportNavigation()
  const { fromDate, toDate, projectNo, deptNo, view } = params
  const comparison = breakdown ? null : data.comparison

  const { blocks, columns } = React.useMemo(() => {
    if (breakdown) {
      const columns: StatementColumn[] = [
        ...breakdown.columns.map(({ key, label }) => ({ key, label })),
        { key: "total", label: "Total", isTotal: true },
      ]
      return {
        columns,
        blocks: buildStatementBlocks([
          ...breakdown.columns.map((column) => column.statement),
          breakdown.total,
        ]),
      }
    }
    const columns: StatementColumn[] = [
      { key: "current", label: "Current Period" },
    ]
    if (comparison) columns.push({ key: "comparison", label: comparison.label })
    return {
      columns,
      blocks: buildStatementBlocks(
        comparison ? [data, comparison.statement] : [data]
      ),
    }
  }, [breakdown, comparison, data])

  const against =
    comparison?.kind === "prior_year"
      ? ` against ${formatRange(comparison.fromDate, comparison.toDate)}`
      : ""

  return (
    <StatementCard
      title={data.companyName}
      description={`Profit & Loss statement, ${formatRange(fromDate, toDate)}${against}`}
      reportName="Profit & Loss"
      fileSuffix={`${fromDate}_${toDate}${breakdown ? `_${view}` : ""}`}
      blocks={blocks}
      columns={columns}
      comparing={comparison !== null}
      percentLabel="Percentage of gross sales"
      notes={(breakdown ?? data).notes}
      toolbarStart={
        <Tabs
          value={view}
          onValueChange={(next: string) =>
            setParams({ view: next === "period" ? null : next })
          }
        >
          <TabsList aria-label="Statement view">
            <TabsTrigger value="period">Period</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      getDrilldown={
        breakdown
          ? undefined
          : (item, block) => ({
              title: item ? `${item.accountCode} ${item.label}` : block.title,
              period: formatRange(fromDate, toDate),
              note:
                !item && block.items.some((row) => !row.canDrillDown)
                  ? STOCK_NOTE
                  : undefined,
              load: () =>
                fetchProfitLossTransactions(orgId, {
                  fromDate,
                  toDate,
                  projectNo,
                  deptNo,
                  ...(item?.accountCode
                    ? { accountNo: item.accountCode }
                    : { accType: block.accType as ProfitLossAccType }),
                }),
            })
      }
    />
  )
}

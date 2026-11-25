"use client"

import * as React from "react"

import { StatementCard } from "@/components/statement/statement-card"
import type { StatementColumn } from "@/components/statement/statement-table"
import { fetchBalanceSheetTransactions } from "@/lib/actions/balance-sheet"
import type { BalanceSheetReportData } from "@/lib/balance-sheet"
import type { BalanceSheetParams } from "@/lib/balance-sheet-params"
import { buildBalanceSheetBlocks } from "@/lib/balance-sheet-rows"
import { orgPath } from "@/lib/org-routes"
import { formatDate } from "@/lib/report-params"
import { formatAmount } from "@/lib/statement-format"

export function BalanceSheetCard({
  orgId,
  params,
  data,
}: {
  orgId: number
  params: BalanceSheetParams
  data: BalanceSheetReportData
}) {
  const { asOfDate, projectNo, deptNo } = params
  const { comparison, fiscalYearStart, outOfBalance } = data

  const profitLossParams = new URLSearchParams({
    fromDate: fiscalYearStart,
    toDate: asOfDate,
  })
  if (projectNo) profitLossParams.set("project", projectNo)
  if (deptNo) profitLossParams.set("dept", deptNo)
  const currentYearProfitHref = `${orgPath(String(orgId), "profit-loss")}?${profitLossParams}`

  const blocks = React.useMemo(
    () =>
      buildBalanceSheetBlocks(
        comparison ? [data, comparison.statement] : [data],
        { currentYearProfitHref }
      ),
    [comparison, currentYearProfitHref, data]
  )
  const columns: StatementColumn[] = [
    { key: "current", label: formatDate(asOfDate) },
  ]
  if (comparison) {
    columns.push({ key: "comparison", label: formatDate(comparison.asOfDate) })
  }

  const filtered = Boolean(projectNo || deptNo)

  return (
    <StatementCard
      title={data.companyName}
      description={`Balance sheet as of ${formatDate(asOfDate)}${
        comparison ? ` against ${formatDate(comparison.asOfDate)}` : ""
      }`}
      reportName="Balance Sheet"
      fileSuffix={asOfDate}
      blocks={blocks}
      columns={columns}
      comparing={comparison !== null}
      percentLabel="Percentage of total assets"
      notes={data.notes}
      banner={
        outOfBalance !== 0 && (
          <p
            role={filtered ? undefined : "alert"}
            className={
              filtered
                ? "text-sm text-muted-foreground"
                : "rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            }
          >
            Assets differ from equity and liabilities by RM{" "}
            {formatAmount(outOfBalance)}.
            {!filtered &&
              " Check the opening balances and stock values in AutoCount."}
          </p>
        )
      }
      getDrilldown={(item, block) => ({
        title: item ? `${item.accountCode} ${item.label}` : block.title,
        period: `up to ${formatDate(asOfDate)}`,
        load: () =>
          fetchBalanceSheetTransactions(orgId, {
            asOfDate,
            projectNo,
            deptNo,
            accountNo: item?.accountCode ?? "",
          }),
      })}
    />
  )
}

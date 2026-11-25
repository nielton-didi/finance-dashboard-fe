"use client"

import * as React from "react"

import { StatementCard } from "@/components/statement/statement-card"
import type { StatementColumn } from "@/components/statement/statement-table"
import { fetchCashFlowTransactions } from "@/lib/actions/cash-flow"
import type { CashFlowReportData } from "@/lib/cash-flow"
import type { CashFlowParams } from "@/lib/cash-flow-params"
import { buildCashFlowBlocks } from "@/lib/cash-flow-rows"
import { orgPath } from "@/lib/org-routes"
import { formatRange } from "@/lib/report-params"
import { formatAmount } from "@/lib/statement-format"

const DEPRECIATION_NOTE =
  "Credits are depreciation, added back under operating activities. Debits are released on disposal and shown with the account's own activity."

export function CashFlowCard({
  orgId,
  params,
  data,
}: {
  orgId: number
  params: CashFlowParams
  data: CashFlowReportData
}) {
  const { fromDate, toDate, projectNo, deptNo } = params
  const { comparison, unreconciled } = data

  const profitLossParams = new URLSearchParams({ fromDate, toDate })
  if (projectNo) profitLossParams.set("project", projectNo)
  if (deptNo) profitLossParams.set("dept", deptNo)
  const netProfitHref = `${orgPath(String(orgId), "profit-loss")}?${profitLossParams}`

  const blocks = React.useMemo(
    () =>
      buildCashFlowBlocks(comparison ? [data, comparison.statement] : [data], {
        netProfitHref,
      }),
    [comparison, data, netProfitHref]
  )
  const columns: StatementColumn[] = [
    { key: "current", label: "Current Period" },
  ]
  if (comparison) columns.push({ key: "comparison", label: comparison.label })

  const filtered = Boolean(projectNo || deptNo)
  const against = comparison
    ? ` against ${formatRange(comparison.fromDate, comparison.toDate)}`
    : ""

  return (
    <StatementCard
      title={data.companyName}
      description={`Cash flow statement (indirect method), ${formatRange(fromDate, toDate)}${against}`}
      reportName="Cash Flow"
      fileSuffix={`${fromDate}_${toDate}`}
      blocks={blocks}
      columns={columns}
      comparing={comparison !== null}
      notes={data.notes}
      banner={
        unreconciled !== 0 && (
          <p
            role={filtered ? undefined : "alert"}
            className={
              filtered
                ? "text-sm text-muted-foreground"
                : "rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            }
          >
            Closing cash differs from opening cash plus the net change by RM{" "}
            {formatAmount(unreconciled)}.
            {!filtered && " Check that the ledger balances in AutoCount."}
          </p>
        )
      }
      getDrilldown={(item, block) => ({
        title: item ? `${item.accountCode} ${item.label}` : block.title,
        period: formatRange(fromDate, toDate),
        note: /:(depreciation|disposals)$/.test(item?.id ?? "")
          ? DEPRECIATION_NOTE
          : undefined,
        load: () =>
          fetchCashFlowTransactions(orgId, {
            fromDate,
            toDate,
            projectNo,
            deptNo,
            accountNo: item?.accountCode ?? "",
          }),
      })}
    />
  )
}

"use client"

import {
  buildCompanySheet,
  CompanyTable,
  type CompanyColumn,
} from "@/components/group/company-table"
import { groupRemarks } from "@/components/group/group-messages"
import type { GroupConsolidated, GroupConsolidatedMetrics } from "@/lib/group"
import { orgPath } from "@/lib/org-routes"
import { formatDate, formatRange } from "@/lib/report-params"
import { downloadTablePdf } from "@/lib/report-pdf"

const COLUMNS: CompanyColumn<GroupConsolidatedMetrics>[] = [
  { label: "Net sales", unit: "amount", value: (m) => m.netSales },
  { label: "Gross profit", unit: "amount", value: (m) => m.grossProfit },
  { label: "Net profit", unit: "amount", value: (m) => m.netProfit },
  { label: "Total assets", unit: "amount", value: (m) => m.totalAssets },
  { label: "Equity", unit: "amount", value: (m) => m.equity },
  { label: "Cash and bank", unit: "amount", value: (m) => m.cash },
]

export function ConsolidatedTable({ report }: { report: GroupConsolidated }) {
  const { fromDate, toDate } = report
  const range = formatRange(fromDate, toDate)
  const getSheet = () =>
    buildCompanySheet(report, COLUMNS, {
      fileName: `Consolidated_${fromDate}_${toDate}`,
      sheetName: "Consolidated",
    })

  return (
    <CompanyTable
      report={report}
      columns={COLUMNS}
      description={`${range}; balances as of ${formatDate(toDate)} (RM)`}
      hrefFor={({ organizationId }) =>
        `${orgPath(String(organizationId), "profit-loss")}?${new URLSearchParams({ fromDate, toDate })}`
      }
      getSheet={getSheet}
      downloadPdf={() =>
        downloadTablePdf({
          title: "Consolidated",
          subtitle: `${range}; balances as of ${formatDate(toDate)} (RM)`,
          sheet: getSheet(),
          remarks: groupRemarks(report),
        })
      }
    />
  )
}

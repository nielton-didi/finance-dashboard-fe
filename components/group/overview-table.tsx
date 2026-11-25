"use client"

import {
  buildCompanySheet,
  CompanyTable,
  type CompanyColumn,
} from "@/components/group/company-table"
import { groupRemarks } from "@/components/group/group-messages"
import type { GroupOverview, GroupOverviewMetrics } from "@/lib/group"
import { orgPath } from "@/lib/org-routes"
import { formatDate } from "@/lib/report-params"
import { downloadTablePdf } from "@/lib/report-pdf"
import { ratioPercent } from "@/lib/statement-format"

const COLUMNS: CompanyColumn<GroupOverviewMetrics>[] = [
  { label: "MTD net sales", unit: "amount", value: (m) => m.mtd.netSales },
  { label: "MTD net profit", unit: "amount", value: (m) => m.mtd.netProfit },
  { label: "YTD net sales", unit: "amount", value: (m) => m.ytd.netSales },
  { label: "YTD net profit", unit: "amount", value: (m) => m.ytd.netProfit },
  {
    label: "YTD margin",
    unit: "percent",
    value: (m) => ratioPercent(m.ytd.netProfit, m.ytd.netSales),
  },
  { label: "12M net sales", unit: "amount", value: (m) => m.ttm.netSales },
  { label: "12M net profit", unit: "amount", value: (m) => m.ttm.netProfit },
]

export function OverviewTable({ report }: { report: GroupOverview }) {
  const { asOfDate } = report
  const getSheet = () =>
    buildCompanySheet(report, COLUMNS, {
      fileName: `Group-Overview_${asOfDate}`,
      sheetName: "Group Overview",
    })

  return (
    <CompanyTable
      report={report}
      columns={COLUMNS}
      description={`Month to date, year to date and last 12 months up to ${formatDate(asOfDate)} (RM)`}
      hrefFor={({ organizationId }) =>
        `${orgPath(String(organizationId), "dashboard")}?${new URLSearchParams({ asOf: asOfDate })}`
      }
      getSheet={getSheet}
      downloadPdf={() =>
        downloadTablePdf({
          title: "Group Overview",
          subtitle: `As of ${formatDate(asOfDate)} (RM)`,
          sheet: getSheet(),
          remarks: groupRemarks(report),
        })
      }
    />
  )
}

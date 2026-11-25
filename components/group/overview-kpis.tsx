import { StatementKpis, type Kpi } from "@/components/statement/statement-kpis"
import type { GroupOverview, GroupOverviewMetrics } from "@/lib/group"

const KPIS: Kpi<GroupOverviewMetrics>[] = [
  {
    label: "Group net sales, month to date",
    unit: "amount",
    value: (m) => m.mtd.netSales,
  },
  {
    label: "Group net profit, month to date",
    unit: "amount",
    value: (m) => m.mtd.netProfit,
  },
  {
    label: "Group net sales, year to date",
    unit: "amount",
    value: (m) => m.ytd.netSales,
  },
  {
    label: "Group net profit, year to date",
    unit: "amount",
    value: (m) => m.ytd.netProfit,
  },
  {
    label: "Group net sales, last 12 months",
    unit: "amount",
    value: (m) => m.ttm.netSales,
  },
  {
    label: "Group net profit, last 12 months",
    unit: "amount",
    value: (m) => m.ttm.netProfit,
  },
]

export function OverviewKpis({ report }: { report: GroupOverview }) {
  return (
    <StatementKpis
      columns={3}
      kpis={KPIS}
      current={report.total.current}
      comparison={{ label: "Prior Year", statement: report.total.prior }}
    />
  )
}

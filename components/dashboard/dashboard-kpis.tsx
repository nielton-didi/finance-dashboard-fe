import { StatementKpis, type Kpi } from "@/components/statement/statement-kpis"
import type { DashboardData, DashboardMetrics } from "@/lib/dashboard"

const KPIS: Kpi<DashboardMetrics>[] = [
  {
    label: "Net sales, month to date",
    unit: "amount",
    value: (m) => m.mtd.netSales,
  },
  {
    label: "Net profit, month to date",
    unit: "amount",
    value: (m) => m.mtd.netProfit,
  },
  {
    label: "Net sales, year to date",
    unit: "amount",
    value: (m) => m.ytd.netSales,
  },
  {
    label: "Net profit, year to date",
    unit: "amount",
    value: (m) => m.ytd.netProfit,
  },
  {
    label: "Net sales, last 12 months",
    unit: "amount",
    value: (m) => m.ttm.netSales,
  },
  {
    label: "Net profit, last 12 months",
    unit: "amount",
    value: (m) => m.ttm.netProfit,
  },
  { label: "Cash and bank", unit: "amount", value: (m) => m.position.cash },
  {
    label: "Working capital",
    unit: "amount",
    value: (m) => m.position.workingCapital,
  },
]

export function DashboardKpis({ data }: { data: DashboardData }) {
  return (
    <StatementKpis
      kpis={KPIS}
      current={data.current}
      comparison={{ label: "Prior Year", statement: data.prior }}
    />
  )
}

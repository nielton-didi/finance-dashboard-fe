import { StatementKpis, type Kpi } from "@/components/statement/statement-kpis"
import type { GroupConsolidated, GroupConsolidatedMetrics } from "@/lib/group"

const KPIS: Kpi<GroupConsolidatedMetrics>[] = [
  { label: "Group net sales", unit: "amount", value: (m) => m.netSales },
  { label: "Group gross profit", unit: "amount", value: (m) => m.grossProfit },
  { label: "Group net profit", unit: "amount", value: (m) => m.netProfit },
  { label: "Group total assets", unit: "amount", value: (m) => m.totalAssets },
]

export function ConsolidatedKpis({ report }: { report: GroupConsolidated }) {
  return (
    <StatementKpis
      kpis={KPIS}
      current={report.total.current}
      comparison={{ label: "Prior Year", statement: report.total.prior }}
    />
  )
}

import { StatementKpis, type Kpi } from "@/components/statement/statement-kpis"
import type { CashFlowReportData, CashFlowStatement } from "@/lib/cash-flow"

const KPIS: Kpi<CashFlowStatement>[] = [
  {
    label: "Operating cash flow",
    unit: "amount",
    value: (s) => s.operating.total,
  },
  {
    label: "Investing cash flow",
    unit: "amount",
    value: (s) => s.investing.total,
  },
  {
    label: "Financing cash flow",
    unit: "amount",
    value: (s) => s.financing.total,
  },
  { label: "Net cash movement", unit: "amount", value: (s) => s.netChange },
]

export function CashFlowKpis({ data }: { data: CashFlowReportData }) {
  return (
    <StatementKpis kpis={KPIS} current={data} comparison={data.comparison} />
  )
}

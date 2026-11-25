import { StatementKpis, type Kpi } from "@/components/statement/statement-kpis"
import type {
  ProfitLossReportData,
  ProfitLossStatement,
} from "@/lib/profit-loss"
import { ratioPercent } from "@/lib/statement-format"

const KPIS: Kpi<ProfitLossStatement>[] = [
  { label: "Net sales", unit: "amount", value: (s) => s.netSales.amount },
  {
    label: "Gross profit margin",
    unit: "percent",
    value: (s) => ratioPercent(s.grossProfit.amount, s.netSales.amount),
  },
  {
    label: "Net profit",
    unit: "amount",
    value: (s) => s.netProfitAfterTax.amount,
  },
  {
    label: "Net profit margin",
    unit: "percent",
    value: (s) => ratioPercent(s.netProfitAfterTax.amount, s.netSales.amount),
  },
]

export function ProfitLossKpis({ data }: { data: ProfitLossReportData }) {
  return (
    <StatementKpis kpis={KPIS} current={data} comparison={data.comparison} />
  )
}

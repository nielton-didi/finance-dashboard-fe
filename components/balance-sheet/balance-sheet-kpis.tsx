import { StatementKpis, type Kpi } from "@/components/statement/statement-kpis"
import type {
  BalanceSheetReportData,
  BalanceSheetStatement,
} from "@/lib/balance-sheet"

const KPIS: Kpi<BalanceSheetStatement>[] = [
  { label: "Total assets", unit: "amount", value: (s) => s.totalAssets.amount },
  {
    label: "Total liabilities",
    unit: "amount",
    higherIsBetter: false,
    value: (s) => s.totalLiabilities.amount,
  },
  { label: "Total equity", unit: "amount", value: (s) => s.equity.amount },
  {
    label: "Working capital",
    unit: "amount",
    value: (s) => s.currentAssets.amount - s.currentLiabilities.amount,
  },
]

export function BalanceSheetKpis({ data }: { data: BalanceSheetReportData }) {
  return (
    <StatementKpis kpis={KPIS} current={data} comparison={data.comparison} />
  )
}

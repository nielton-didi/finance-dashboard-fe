import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type {
  ProfitLossReportData,
  ProfitLossStatement,
} from "@/lib/profit-loss"
import {
  formatAmount,
  formatPercent,
  ratioPercent,
} from "@/lib/profit-loss-format"
import { cn } from "@/lib/utils"

interface Kpi {
  label: string
  unit: "amount" | "percent"
  value: (statement: ProfitLossStatement) => number | null
}

const KPIS: Kpi[] = [
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

function formatValue(value: number | null, unit: Kpi["unit"]): string {
  if (value === null) return "—"
  return unit === "amount"
    ? `RM ${formatAmount(value)}`
    : `${formatPercent(value)}%`
}

function Delta({
  current,
  comparison,
  unit,
}: {
  current: number | null
  comparison: number | null
  unit: Kpi["unit"]
}) {
  if (current === null || comparison === null) return null
  // Margins are already percentages, so their change is in percentage points.
  const change =
    unit === "percent"
      ? current - comparison
      : ratioPercent(current - comparison, comparison)
  if (change === null) return null

  const rounded = Math.round(change * 10) / 10
  const Icon =
    rounded === 0
      ? MinusIcon
      : rounded > 0
        ? ArrowUpRightIcon
        : ArrowDownRightIcon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-medium",
        rounded > 0 && "text-emerald-700 dark:text-emerald-400",
        rounded < 0 && "text-destructive",
        rounded === 0 && "text-muted-foreground"
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {rounded > 0 ? "+" : rounded < 0 ? "−" : ""}
      {Math.abs(rounded).toFixed(1)}
      {unit === "percent" ? " pts" : "%"}
    </span>
  )
}

export function ProfitLossKpis({ data }: { data: ProfitLossReportData }) {
  const { comparison } = data

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {KPIS.map(({ label, unit, value }) => {
        const current = value(data)
        const compared = comparison ? value(comparison.statement) : null
        return (
          <Card key={label} size="sm">
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-xl font-semibold">
                {formatValue(current, unit)}
              </CardTitle>
            </CardHeader>
            {comparison && (
              <CardContent className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <Delta current={current} comparison={compared} unit={unit} />
                <span>
                  {comparison.label}: {formatValue(compared, unit)}
                </span>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}

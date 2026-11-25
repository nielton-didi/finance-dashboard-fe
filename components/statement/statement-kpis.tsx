import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  formatAmount,
  formatPercent,
  ratioPercent,
} from "@/lib/statement-format"
import { cn } from "@/lib/utils"

export interface Kpi<T> {
  label: string
  unit: "amount" | "percent"
  higherIsBetter?: boolean
  value: (statement: T) => number | null
}

type Unit = Kpi<unknown>["unit"]

function formatValue(value: number | null, unit: Unit): string {
  if (value === null) return "—"
  return unit === "amount"
    ? `RM ${formatAmount(value)}`
    : `${formatPercent(value)}%`
}

function Delta({
  current,
  comparison,
  unit,
  higherIsBetter,
}: {
  current: number | null
  comparison: number | null
  unit: Unit
  higherIsBetter: boolean
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
        rounded !== 0 &&
          (rounded > 0 === higherIsBetter
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-destructive"),
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

export function StatementKpis<T>({
  kpis,
  current: statement,
  comparison,
}: {
  kpis: Kpi<T>[]
  current: T
  comparison: { label: string; statement: T } | null
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map(({ label, unit, higherIsBetter = true, value }) => {
        const current = value(statement)
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
                <Delta
                  current={current}
                  comparison={compared}
                  unit={unit}
                  higherIsBetter={higherIsBetter}
                />
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

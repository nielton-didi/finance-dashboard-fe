import { NetSalesTrendChart } from "@/components/profit-loss/net-sales-trend-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ProfitLossTrend } from "@/lib/profit-loss"

export function NetSalesTrendCard({
  trend,
  lastMonth,
  className,
}: {
  trend: ProfitLossTrend
  /** The last month of the current year to draw. */
  lastMonth: number
  className?: string
}) {
  const hasTrend = trend.months.some((m) => m.current !== 0 || m.prior !== 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Net sales trend</CardTitle>
        <CardDescription>
          By month (RM), {trend.year} against {trend.year - 1}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasTrend ? (
          <NetSalesTrendChart trend={trend} lastMonth={lastMonth} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No sales recorded in {trend.year - 1} or {trend.year}.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

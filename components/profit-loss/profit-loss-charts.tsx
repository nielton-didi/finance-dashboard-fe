import { BarList, type BarListItem } from "@/components/statement/bar-list"
import { NetSalesTrendChart } from "@/components/profit-loss/net-sales-trend-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ProfitLossStatement, ProfitLossTrend } from "@/lib/profit-loss"

const TOP_EXPENSES = 6

function topExpenses(statement: ProfitLossStatement): BarListItem[] {
  const ranked = statement.expenses.items
    .filter((item) => item.amount !== 0)
    .sort((a, b) => b.amount - a.amount)
  const top = ranked.slice(0, TOP_EXPENSES)
  const rest = ranked.slice(TOP_EXPENSES)

  const items = top.map((item) => ({
    key: item.accountCode,
    label: item.accountName,
    value: item.amount,
  }))
  if (rest.length > 0) {
    items.push({
      key: "other",
      label: `Other (${rest.length} accounts)`,
      value: rest.reduce((sum, item) => sum + item.amount, 0),
    })
  }
  return items
}

export function ProfitLossCharts({
  statement,
  trend,
  lastTrendMonth,
}: {
  statement: ProfitLossStatement
  trend: ProfitLossTrend
  lastTrendMonth: number
}) {
  const expenses = topExpenses(statement)
  const hasTrend = trend.months.some((m) => m.current !== 0 || m.prior !== 0)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Net sales trend</CardTitle>
          <CardDescription>
            By month (RM), {trend.year} against {trend.year - 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasTrend ? (
            <NetSalesTrendChart trend={trend} lastMonth={lastTrendMonth} />
          ) : (
            <p className="text-sm text-muted-foreground">
              No sales recorded in {trend.year - 1} or {trend.year}.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profitability</CardTitle>
          <CardDescription>Selected period (RM)</CardDescription>
        </CardHeader>
        <CardContent>
          <BarList
            items={[
              {
                key: "netSales",
                label: "Net sales",
                value: statement.netSales.amount,
              },
              {
                key: "grossProfit",
                label: "Gross profit",
                value: statement.grossProfit.amount,
              },
              {
                key: "netProfit",
                label: "Net profit",
                value: statement.netProfitAfterTax.amount,
              },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Largest expenses</CardTitle>
          <CardDescription>Selected period (RM)</CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <BarList items={expenses} />
          ) : (
            <p className="text-sm text-muted-foreground">
              No expenses in this period.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

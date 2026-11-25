import { BarList } from "@/components/statement/bar-list"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { CashFlowStatement } from "@/lib/cash-flow"

export function CashFlowCharts({
  statement,
}: {
  statement: CashFlowStatement
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Cash flow breakdown</CardTitle>
          <CardDescription>By activity, selected period (RM)</CardDescription>
        </CardHeader>
        <CardContent>
          <BarList
            items={[
              {
                key: "operating",
                label: "Operating",
                value: statement.operating.total,
              },
              {
                key: "investing",
                label: "Investing",
                value: statement.investing.total,
              },
              {
                key: "financing",
                label: "Financing",
                value: statement.financing.total,
              },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cash position</CardTitle>
          <CardDescription>Cash and bank balances (RM)</CardDescription>
        </CardHeader>
        <CardContent>
          <BarList
            items={[
              {
                key: "opening",
                label: "Opening",
                value: statement.openingCash,
              },
              {
                key: "change",
                label: "Net change",
                value: statement.netChange,
              },
              {
                key: "closing",
                label: "Closing",
                value: statement.closingCash,
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}

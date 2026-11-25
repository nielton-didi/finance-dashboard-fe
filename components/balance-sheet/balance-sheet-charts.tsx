import { BarList, type BarListItem } from "@/components/statement/bar-list"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { BalanceSheetStatement } from "@/lib/balance-sheet"
import { formatDate } from "@/lib/report-params"

function CompositionCard({
  title,
  asOfDate,
  items,
}: {
  title: string
  asOfDate: string
  items: BarListItem[]
}) {
  const shown = items.filter((item) => item.value !== 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>As of {formatDate(asOfDate)} (RM)</CardDescription>
      </CardHeader>
      <CardContent>
        {shown.length > 0 ? (
          <BarList items={shown} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No balances on this date.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function BalanceSheetCharts({
  statement,
}: {
  statement: BalanceSheetStatement
}) {
  const { asOfDate, assetComposition } = statement

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <CompositionCard
        title="Asset composition"
        asOfDate={asOfDate}
        items={assetComposition.map(({ key, label, amount }) => ({
          key,
          label,
          value: amount,
        }))}
      />
      <CompositionCard
        title="Funding"
        asOfDate={asOfDate}
        items={[
          { key: "equity", label: "Equity", value: statement.equity.amount },
          {
            key: "nonCurrent",
            label: "Non-current liabilities",
            value: statement.nonCurrentLiabilities.amount,
          },
          {
            key: "current",
            label: "Current liabilities",
            value: statement.currentLiabilities.amount,
          },
        ]}
      />
    </div>
  )
}

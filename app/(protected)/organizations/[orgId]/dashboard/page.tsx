import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const statCards = [
  "Net Sales",
  "Gross Profit",
  "Net Profit",
  "Cash Balance",
]

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((title) => (
          <Card key={title}>
            <CardHeader>
              <CardDescription>{title}</CardDescription>
              <Skeleton className="h-7 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Monthly revenue over the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end gap-2">
              {[40, 65, 50, 80, 55, 70, 45, 90, 60, 75, 50, 85].map(
                (height, i) => (
                  <Skeleton
                    key={i}
                    className="w-full"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>By category, this period.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Skeleton className="size-40 rounded-full" />
            <div className="flex w-full flex-col gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="size-2.5 shrink-0 rounded-full" />
                  <Skeleton className="h-3 flex-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest activity from this organization&apos;s Autocount ledger.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24 shrink-0" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20 shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

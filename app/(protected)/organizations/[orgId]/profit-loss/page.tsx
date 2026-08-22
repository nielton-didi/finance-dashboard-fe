import { format } from "date-fns"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DateRangePicker } from "@/components/profit-loss/date-range-picker"
import { ProfitLossTable } from "@/components/profit-loss/profit-loss-table"
import { getMockProfitLoss } from "@/lib/profit-loss-mock"

export default async function ProfitLossPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { orgId } = await params
  const { fromDate: rawFrom, toDate: rawTo } = await searchParams

  const today = new Date()
  const defaultFrom = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`
  const defaultTo = today.toISOString().slice(0, 10)

  const fromDate = typeof rawFrom === "string" ? rawFrom : defaultFrom
  const toDate = typeof rawTo === "string" ? rawTo : defaultTo

  const data = getMockProfitLoss(orgId, fromDate, toDate)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.companyName}</CardTitle>
        <CardDescription>
          Profit &amp; Loss statement, {format(new Date(fromDate + "T00:00:00"), "MMM d, yyyy")} –{" "}
          {format(new Date(toDate + "T00:00:00"), "MMM d, yyyy")}
        </CardDescription>
        <CardAction>
          <DateRangePicker fromDate={fromDate} toDate={toDate} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ProfitLossTable data={data} />
      </CardContent>
    </Card>
  )
}

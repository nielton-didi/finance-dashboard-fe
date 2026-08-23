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
import { ApiError } from "@/lib/api"
import { getProfitLoss } from "@/lib/profit-loss"

function AutocountErrorMessage({ error }: { error: ApiError }) {
  const message =
    error.reason === "NOT_CONFIGURED"
      ? "This organization's Autocount database hasn't been set up yet. Add its connection details in Settings > AutoCount Database."
      : "This organization's Autocount database isn't reachable right now. Please try again later."

  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <p className="font-medium">{message}</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  )
}

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

  let data
  let error: ApiError | null = null
  try {
    data = await getProfitLoss(Number(orgId), fromDate, toDate)
  } catch (err) {
    if (err instanceof ApiError && err.reason) {
      error = err
    } else {
      throw err
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data?.companyName ?? "Profit & Loss"}</CardTitle>
        <CardDescription>
          Profit &amp; Loss statement, {format(new Date(fromDate + "T00:00:00"), "MMM d, yyyy")} –{" "}
          {format(new Date(toDate + "T00:00:00"), "MMM d, yyyy")}
        </CardDescription>
        <CardAction>
          <DateRangePicker fromDate={fromDate} toDate={toDate} />
        </CardAction>
      </CardHeader>
      <CardContent>
        {error ? (
          <AutocountErrorMessage error={error} />
        ) : (
          data && <ProfitLossTable data={data} />
        )}
      </CardContent>
    </Card>
  )
}

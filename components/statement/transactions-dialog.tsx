"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ActionResult } from "@/lib/api"
import type { StatementTransactions } from "@/lib/statement"
import { formatAmount } from "@/lib/statement-format"

export interface Drilldown {
  title: string
  /** The dates covered, e.g. "Jan 1, 2026 – Jan 31, 2026". */
  period: string
  note?: string
  load: () => Promise<ActionResult<StatementTransactions>>
}

function amountOrDash(value: number): string {
  return value === 0 ? "–" : formatAmount(value)
}

function TransactionsTable({ data }: { data: StatementTransactions }) {
  const hasOpening = data.openingDebit !== 0 || data.openingCredit !== 0

  if (data.rows.length === 0 && !hasOpening) {
    return (
      <p className="py-10 text-center text-muted-foreground">
        No transactions in this period.
      </p>
    )
  }

  return (
    <>
      {data.truncated && (
        <p className="text-xs text-muted-foreground">
          Showing the latest {data.rows.length.toLocaleString()} of{" "}
          {data.totalCount.toLocaleString()} lines. Totals cover all of them.
        </p>
      )}
      <div className="max-h-[60vh] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row) => (
              <TableRow key={row.key}>
                <TableCell>
                  {format(parseISO(row.date), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {row.reference ?? "–"}
                </TableCell>
                <TableCell className="whitespace-normal">
                  <span className="font-mono text-xs text-muted-foreground">
                    {row.accountCode}
                  </span>{" "}
                  {row.accountName}
                </TableCell>
                <TableCell className="min-w-40 whitespace-normal text-muted-foreground">
                  {row.description ?? "–"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {amountOrDash(row.debit)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {amountOrDash(row.credit)}
                </TableCell>
              </TableRow>
            ))}
            {hasOpening && (
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell colSpan={2} className="font-medium">
                  Opening balance
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {amountOrDash(data.openingDebit)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {amountOrDash(data.openingCredit)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                Total ({data.totalCount.toLocaleString()} lines)
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatAmount(data.totalDebit)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatAmount(data.totalCredit)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  )
}

function TransactionsContent({ load }: Pick<Drilldown, "load">) {
  const [result, setResult] =
    React.useState<ActionResult<StatementTransactions> | null>(null)

  React.useEffect(() => {
    let ignore = false
    load()
      .catch(() => ({
        ok: false as const,
        message: "Transactions could not be loaded. Please try again.",
      }))
      .then((next) => {
        if (!ignore) setResult(next)
      })
    return () => {
      ignore = true
    }
  }, [load])

  if (!result) {
    return (
      <div className="flex flex-col gap-3 py-2" aria-label="Loading">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    )
  }
  if (!result.ok || !result.data) {
    return (
      <p role="alert" className="py-10 text-center text-destructive">
        {result.message}
      </p>
    )
  }
  return <TransactionsTable data={result.data} />
}

export function TransactionsDialog({
  drilldown,
  onClose,
}: {
  drilldown: Drilldown | null
  onClose: () => void
}) {
  return (
    <Dialog
      open={drilldown !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="grid-cols-[minmax(0,1fr)] sm:max-w-4xl">
        {drilldown && (
          <>
            <DialogHeader>
              <DialogTitle>{drilldown.title}</DialogTitle>
              <DialogDescription>
                Transactions, {drilldown.period}
              </DialogDescription>
              {drilldown.note && (
                <p className="text-xs text-muted-foreground">
                  {drilldown.note}
                </p>
              )}
            </DialogHeader>
            <TransactionsContent load={drilldown.load} />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

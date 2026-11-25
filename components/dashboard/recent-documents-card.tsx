import { format, parseISO } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DashboardDocument } from "@/lib/dashboard"
import { formatAmount } from "@/lib/statement-format"

export function RecentDocumentsCard({
  documents,
}: {
  documents: DashboardDocument[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <CardDescription>
          Latest activity from this organization&apos;s AutoCount ledger (RM)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No transactions up to this date.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Journal</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.key}>
                  <TableCell>
                    {format(parseISO(document.date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {document.reference ?? "–"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {document.journalType}
                  </TableCell>
                  <TableCell className="min-w-40 whitespace-normal">
                    {document.description || "–"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatAmount(document.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

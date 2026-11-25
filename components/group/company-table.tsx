import Link from "next/link"

import { ExportMenu } from "@/components/statement/export-menu"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { GroupCompany, GroupReport } from "@/lib/group"
import type { ExportSheet } from "@/lib/statement-export"
import { formatAmount, formatPercent } from "@/lib/statement-format"
import { cn } from "@/lib/utils"

export interface CompanyColumn<T> {
  label: string
  unit: "amount" | "percent"
  value: (metrics: T) => number | null
}

export function buildCompanySheet<T>(
  report: GroupReport<T>,
  columns: CompanyColumn<T>[],
  names: { fileName: string; sheetName: string }
): ExportSheet {
  const cells = (metrics: T) =>
    columns.map(({ value }) => {
      const amount = value(metrics)
      return amount === null ? null : Math.round(amount * 100) / 100
    })
  return {
    ...names,
    headers: [
      "Company",
      ...columns.map(({ label, unit }) =>
        unit === "percent" ? `${label} (%)` : label
      ),
    ],
    rows: [
      ...report.companies.map(({ name, current }) => [name, ...cells(current)]),
      ["Group total", ...cells(report.total.current)],
    ],
  }
}

function ValueCells<T>({
  metrics,
  columns,
}: {
  metrics: T
  columns: CompanyColumn<T>[]
}) {
  return columns.map(({ label, unit, value }) => {
    const amount = value(metrics)
    return (
      <TableCell
        key={label}
        className={cn(
          "text-right tabular-nums",
          amount !== null && amount < 0 && "text-destructive"
        )}
      >
        {amount === null
          ? "—"
          : unit === "amount"
            ? formatAmount(amount)
            : `${formatPercent(amount)}%`}
      </TableCell>
    )
  })
}

export function CompanyTable<T>({
  report,
  columns,
  description,
  hrefFor,
  getSheet,
  downloadPdf,
}: {
  report: GroupReport<T>
  columns: CompanyColumn<T>[]
  description: string
  hrefFor: (company: GroupCompany<T>) => string
  getSheet: () => ExportSheet
  downloadPdf: () => Promise<void>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company breakdown</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <ExportMenu getSheet={getSheet} downloadPdf={downloadPdf} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Company</TableHead>
              {columns.map(({ label }) => (
                <TableHead key={label} className="text-right">
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.companies.map((company) => (
              <TableRow key={company.organizationId}>
                <TableCell className="min-w-44 font-medium whitespace-normal">
                  <Link
                    href={hrefFor(company)}
                    className="rounded-sm underline decoration-muted-foreground/60 decoration-dotted underline-offset-4 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {company.name}
                  </Link>
                </TableCell>
                <ValueCells metrics={company.current} columns={columns} />
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="font-bold">
              <TableCell>Group total</TableCell>
              <ValueCells metrics={report.total.current} columns={columns} />
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}

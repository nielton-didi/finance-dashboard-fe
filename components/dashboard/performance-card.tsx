"use client"

import { Fragment } from "react"

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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  DashboardData,
  DashboardMetrics,
  DashboardPerformance,
} from "@/lib/dashboard"
import { formatDate, formatRange } from "@/lib/report-params"
import { exportSlug, type ExportSheet } from "@/lib/statement-export"
import {
  formatAmount,
  formatPercent,
  ratioPercent,
} from "@/lib/statement-format"

type PeriodKey = "mtd" | "ytd" | "ttm"

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "mtd", label: "Month to date" },
  { key: "ytd", label: "Year to date" },
  { key: "ttm", label: "Last 12 months" },
]

const ROWS: {
  label: string
  unit: "amount" | "percent"
  value: (performance: DashboardPerformance) => number | null
}[] = [
  { label: "Net sales", unit: "amount", value: (p) => p.netSales },
  { label: "Gross profit", unit: "amount", value: (p) => p.grossProfit },
  {
    label: "Gross profit margin",
    unit: "percent",
    value: (p) => ratioPercent(p.grossProfit, p.netSales),
  },
  { label: "Net profit after tax", unit: "amount", value: (p) => p.netProfit },
  {
    label: "Net profit margin",
    unit: "percent",
    value: (p) => ratioPercent(p.netProfit, p.netSales),
  },
]

function formatValue(value: number | null, unit: "amount" | "percent") {
  if (value === null) return "—"
  return unit === "amount" ? formatAmount(value) : `${formatPercent(value)}%`
}

const round = (value: number | null) =>
  value === null ? null : Math.round(value * 100) / 100

function buildSheet(data: DashboardData): ExportSheet {
  return {
    fileName: `${exportSlug(`Dashboard ${data.companyName}`)}_${data.asOfDate}`,
    sheetName: "Performance",
    headers: [
      "",
      ...PERIODS.flatMap(({ label }) => [label, `${label}, prior year`]),
    ],
    rows: ROWS.map(({ label, unit, value }) => [
      unit === "percent" ? `${label} (%)` : label,
      ...PERIODS.flatMap(({ key }) => [
        round(value(data.current[key])),
        round(value(data.prior[key])),
      ]),
    ]),
  }
}

/** Negative figures stand out, so a loss is visible at a glance. */
function ValueCell({
  metrics,
  period,
  row,
  muted,
}: {
  metrics: DashboardMetrics
  period: PeriodKey
  row: (typeof ROWS)[number]
  muted?: boolean
}) {
  const value = row.value(metrics[period])
  return (
    <TableCell
      className={`text-right tabular-nums ${
        muted
          ? "text-muted-foreground"
          : value !== null && value < 0
            ? "text-destructive"
            : ""
      }`}
    >
      {formatValue(value, row.unit)}
    </TableCell>
  )
}

export function PerformanceCard({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance</CardTitle>
        <CardDescription>
          Up to {formatDate(data.asOfDate)}, against the same periods a year
          earlier (RM)
        </CardDescription>
        <CardAction>
          <ExportMenu getSheet={() => buildSheet(data)} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead />
              {PERIODS.map(({ key, label }) => (
                <Fragment key={key}>
                  <TableHead
                    className="text-right"
                    title={formatRange(
                      data.current[key].fromDate,
                      data.current[key].toDate
                    )}
                  >
                    {label}
                  </TableHead>
                  <TableHead
                    className="text-right font-normal text-muted-foreground"
                    title={formatRange(
                      data.prior[key].fromDate,
                      data.prior[key].toDate
                    )}
                  >
                    Prior year
                  </TableHead>
                </Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-medium">{row.label}</TableCell>
                {PERIODS.map(({ key }) => (
                  <Fragment key={key}>
                    <ValueCell metrics={data.current} period={key} row={row} />
                    <ValueCell
                      metrics={data.prior}
                      period={key}
                      row={row}
                      muted
                    />
                  </Fragment>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

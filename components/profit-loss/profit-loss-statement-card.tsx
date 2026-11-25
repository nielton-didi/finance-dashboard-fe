"use client"

import * as React from "react"
import { ChevronDownIcon, DownloadIcon, SearchIcon } from "lucide-react"

import {
  ProfitLossTable,
  type ProfitLossColumn,
} from "@/components/profit-loss/profit-loss-table"
import { useReportNavigation } from "@/components/profit-loss/report-navigation"
import {
  TransactionsDialog,
  type Drilldown,
} from "@/components/profit-loss/transactions-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  ProfitLossBreakdown,
  ProfitLossReportData,
} from "@/lib/profit-loss"
import {
  buildExportSheet,
  downloadCsv,
  downloadExcel,
} from "@/lib/profit-loss-export"
import { formatRange, type ProfitLossParams } from "@/lib/profit-loss-params"
import { buildStatementBlocks } from "@/lib/profit-loss-rows"

function slug(name: string): string {
  return name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "")
}

export function ProfitLossStatementCard({
  orgId,
  params,
  data,
  breakdown,
}: {
  orgId: number
  params: ProfitLossParams
  data: ProfitLossReportData
  /** Set for the monthly and quarterly views. */
  breakdown: ProfitLossBreakdown | null
}) {
  const { setParams } = useReportNavigation()
  const [search, setSearch] = React.useState("")
  const [hideZeroRows, setHideZeroRows] = React.useState(true)
  const [collapsed, setCollapsed] = React.useState<ReadonlySet<string>>(
    new Set()
  )
  const [drilldown, setDrilldown] = React.useState<Drilldown | null>(null)
  const [exportError, setExportError] = React.useState(false)

  const { fromDate, toDate, projectNo, deptNo, view } = params
  const comparison = breakdown ? null : data.comparison

  const { blocks, columns } = React.useMemo(() => {
    if (breakdown) {
      const columns: ProfitLossColumn[] = [
        ...breakdown.columns.map(({ key, label }) => ({ key, label })),
        { key: "total", label: "Total", isTotal: true },
      ]
      return {
        columns,
        blocks: buildStatementBlocks([
          ...breakdown.columns.map((column) => column.statement),
          breakdown.total,
        ]),
      }
    }
    const columns: ProfitLossColumn[] = [
      { key: "current", label: "Current Period" },
    ]
    if (comparison) columns.push({ key: "comparison", label: comparison.label })
    return {
      columns,
      blocks: buildStatementBlocks(
        comparison ? [data, comparison.statement] : [data]
      ),
    }
  }, [breakdown, comparison, data])

  const sectionIds = blocks
    .filter((block) => block.kind === "section")
    .map((block) => block.id)
  const allCollapsed = sectionIds.every((id) => collapsed.has(id))

  function toggleSection(id: string) {
    setCollapsed((previous) => {
      const next = new Set(previous)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }

  async function handleExport(format: "csv" | "xlsx") {
    const sheet = buildExportSheet({
      blocks,
      columnLabels: columns.map((column) => column.label),
      comparing: comparison !== null,
      hideZeroRows,
      fileName: `${slug(`Profit Loss ${data.companyName}`)}_${fromDate}_${toDate}${breakdown ? `_${view}` : ""}`,
    })
    setExportError(false)
    try {
      if (format === "csv") downloadCsv(sheet)
      else await downloadExcel(sheet)
    } catch {
      setExportError(true)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.companyName}</CardTitle>
        <CardDescription>
          Profit &amp; Loss statement, {formatRange(fromDate, toDate)}
          {comparison?.kind === "prior_year" &&
            ` against ${formatRange(comparison.fromDate, comparison.toDate)}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={view}
            onValueChange={(next: string) =>
              setParams({ view: next === "period" ? null : next })
            }
          >
            <TabsList aria-label="Statement view">
              <TabsTrigger value="period">Period</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <SearchIcon
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search accounts…"
              aria-label="Search accounts"
              className="w-52 pl-8"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 px-1 text-sm">
            <input
              type="checkbox"
              checked={hideZeroRows}
              onChange={(event) => setHideZeroRows(event.target.checked)}
              className="accent-primary"
            />
            Hide zero rows
          </label>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setCollapsed(allCollapsed ? new Set() : new Set(sectionIds))
              }
            >
              {allCollapsed ? "Expand all" : "Collapse all"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                <DownloadIcon />
                Export
                <ChevronDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto">
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  CSV (.csv)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("xlsx")}>
                  Excel (.xlsx)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {exportError && (
          <p role="alert" className="text-sm text-destructive">
            The export could not be created. Please try again.
          </p>
        )}

        <ProfitLossTable
          blocks={blocks}
          columns={columns}
          comparing={comparison !== null}
          collapsed={collapsed}
          search={search}
          hideZeroRows={hideZeroRows}
          onToggleSection={toggleSection}
          onDrilldown={
            breakdown
              ? undefined
              : (row, block) =>
                  setDrilldown({
                    title:
                      "accountCode" in row
                        ? `${row.accountCode} ${row.label}`
                        : block.title,
                    note:
                      !("accountCode" in row) &&
                      block.items.some((item) => !item.canDrillDown)
                        ? "Opening and closing stock values are not ledger lines, so these totals differ from the statement by those amounts."
                        : undefined,
                    query: {
                      fromDate,
                      toDate,
                      projectNo,
                      deptNo,
                      ...("accountCode" in row
                        ? { accountNo: row.accountCode }
                        : { accType: block.accType }),
                    },
                  })
          }
        />

        {(breakdown ?? data).notes.length > 0 && (
          <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
            {(breakdown ?? data).notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </CardContent>

      <TransactionsDialog
        orgId={orgId}
        drilldown={drilldown}
        onClose={() => setDrilldown(null)}
      />
    </Card>
  )
}

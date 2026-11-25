"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { ExportMenu } from "@/components/statement/export-menu"
import {
  StatementTable,
  type StatementColumn,
} from "@/components/statement/statement-table"
import {
  TransactionsDialog,
  type Drilldown,
} from "@/components/statement/transactions-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { buildExportSheet, exportSlug } from "@/lib/statement-export"
import type {
  ItemRow,
  SectionBlock,
  StatementBlock,
} from "@/lib/statement-rows"

/** A statement with its toolbar: search, zero rows, collapsing, export and drilldown. */
export function StatementCard({
  title,
  description,
  reportName,
  fileSuffix,
  blocks,
  columns,
  comparing,
  percentLabel,
  notes,
  toolbarStart,
  banner,
  getDrilldown,
}: {
  title: string
  description: string
  /** Names the export file and its sheet. */
  reportName: string
  fileSuffix: string
  blocks: StatementBlock[]
  columns: StatementColumn[]
  comparing: boolean
  percentLabel?: string
  notes: string[]
  toolbarStart?: React.ReactNode
  banner?: React.ReactNode
  /** Omit to make amounts plain text. `item` is null for a whole section. */
  getDrilldown?: (item: ItemRow | null, block: SectionBlock) => Drilldown
}) {
  const [search, setSearch] = React.useState("")
  const [hideZeroRows, setHideZeroRows] = React.useState(true)
  const [collapsed, setCollapsed] = React.useState<ReadonlySet<string>>(
    new Set()
  )
  const [drilldown, setDrilldown] = React.useState<Drilldown | null>(null)

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

  const getSheet = () =>
    buildExportSheet({
      blocks,
      columnLabels: columns.map((column) => column.label),
      comparing,
      withPercent: percentLabel !== undefined,
      hideZeroRows,
      fileName: `${exportSlug(`${reportName} ${title}`)}_${fileSuffix}`,
      sheetName: reportName,
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {toolbarStart}

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
            <ExportMenu getSheet={getSheet} />
          </div>
        </div>

        {banner}
        <StatementTable
          blocks={blocks}
          columns={columns}
          comparing={comparing}
          percentLabel={percentLabel}
          collapsed={collapsed}
          search={search}
          hideZeroRows={hideZeroRows}
          onToggleSection={toggleSection}
          onDrilldown={
            getDrilldown &&
            ((item, block) => setDrilldown(getDrilldown(item, block)))
          }
        />

        {notes.length > 0 && (
          <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </CardContent>

      <TransactionsDialog
        drilldown={drilldown}
        onClose={() => setDrilldown(null)}
      />
    </Card>
  )
}

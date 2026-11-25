import { Fragment } from "react"
import Link from "next/link"
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatAmount, formatPercent } from "@/lib/statement-format"
import {
  filterBlocks,
  getVariance,
  type ItemRow,
  type SectionBlock,
  type StatementBlock,
  type StatementRow,
} from "@/lib/statement-rows"
import { cn } from "@/lib/utils"

export interface StatementColumn {
  key: string
  label: string
  /** The breakdown's total column is set apart from the periods. */
  isTotal?: boolean
}

type DrilldownHandler = (item: ItemRow | null, block: SectionBlock) => void

interface ValueCellOptions {
  columns: StatementColumn[]
  withPercent: boolean
  comparing: boolean
}

/** The numeric cells of one row: amounts, optional %, and variance when comparing. */
function ValueCells({
  row,
  columns,
  withPercent,
  comparing,
  className,
  percentClassName,
  onAmountClick,
}: ValueCellOptions & {
  row: StatementRow
  className?: string
  percentClassName?: string
  /** Makes the first (current period) amount open its transactions. */
  onAmountClick?: () => void
}) {
  const cell = cn("text-right tabular-nums", className)
  const variance = comparing ? getVariance(row) : null
  const tone =
    variance?.tone === "good"
      ? "text-emerald-700 dark:text-emerald-400"
      : variance?.tone === "bad"
        ? "text-destructive"
        : "text-muted-foreground"

  return (
    <>
      {row.cells.map(({ amount, percent }, index) => {
        const column = columns[index]
        return (
          <Fragment key={column.key}>
            <TableCell className={cn(cell, column.isTotal && "bg-muted/50")}>
              {index === 0 && onAmountClick ? (
                <button
                  type="button"
                  onClick={onAmountClick}
                  aria-label={`${row.label}: ${formatAmount(amount)}. View transactions`}
                  className="rounded-sm underline decoration-muted-foreground/60 decoration-dotted underline-offset-4 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {formatAmount(amount)}
                </button>
              ) : (
                formatAmount(amount)
              )}
            </TableCell>
            {withPercent && (
              <TableCell
                className={cn(cell, "text-muted-foreground", percentClassName)}
              >
                {formatPercent(percent)}
              </TableCell>
            )}
          </Fragment>
        )
      })}
      {variance && (
        <>
          <TableCell className={cn(cell, tone)}>
            {formatAmount(variance.amount)}
          </TableCell>
          <TableCell className={cn(cell, tone)}>
            {variance.percent === null ? "–" : formatPercent(variance.percent)}
          </TableCell>
        </>
      )}
    </>
  )
}

function Section({
  block,
  items,
  collapsed,
  searching,
  columnCount,
  onToggle,
  onDrilldown,
  ...values
}: ValueCellOptions & {
  block: SectionBlock
  items: ItemRow[]
  collapsed: boolean
  searching: boolean
  columnCount: number
  onToggle: () => void
  /** Called with the clicked account, or null for a whole section. */
  onDrilldown?: DrilldownHandler
}) {
  const Chevron = collapsed ? ChevronRightIcon : ChevronDownIcon

  return (
    <>
      <TableRow className="border-0 hover:bg-transparent has-aria-expanded:bg-transparent">
        <TableCell
          colSpan={columnCount}
          className="border-b border-border pt-4 pb-1.5"
        >
          <button
            type="button"
            onClick={onToggle}
            disabled={searching}
            aria-expanded={!collapsed}
            className="flex items-center gap-1 rounded-sm text-xs font-semibold tracking-wide text-foreground/80 uppercase outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Chevron
              aria-hidden
              className={cn("size-3.5", searching && "invisible")}
            />
            {block.title}
          </button>
        </TableCell>
      </TableRow>

      {!collapsed &&
        items.map((item) => (
          <TableRow key={item.id} className="border-0 hover:bg-muted/40">
            <TableCell className="w-20 py-1.5 font-mono text-xs text-muted-foreground">
              {item.accountCode}
            </TableCell>
            <TableCell className="min-w-44 py-1.5 whitespace-normal">
              {item.href ? (
                <Link
                  href={item.href}
                  className="rounded-sm underline decoration-muted-foreground/60 decoration-dotted underline-offset-4 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </TableCell>
            <ValueCells
              {...values}
              row={item}
              className="py-1.5"
              onAmountClick={
                onDrilldown && item.canDrillDown && item.cells[0].amount !== 0
                  ? () => onDrilldown(item, block)
                  : undefined
              }
            />
          </TableRow>
        ))}

      {!searching && (
        <TableRow className="border-0 hover:bg-transparent">
          <TableCell className="p-0" />
          <TableCell className="border-t border-border pt-1.5 pb-2 font-semibold">
            {block.total.label}
          </TableCell>
          <ValueCells
            {...values}
            row={block.total}
            className="border-t border-border pt-1.5 pb-2 font-semibold"
            onAmountClick={
              onDrilldown &&
              block.canDrillDown &&
              block.total.cells[0].amount !== 0
                ? () => onDrilldown(null, block)
                : undefined
            }
          />
        </TableRow>
      )}
    </>
  )
}

export function StatementTable({
  blocks,
  columns,
  comparing,
  percentLabel,
  collapsed,
  search,
  hideZeroRows,
  onToggleSection,
  onDrilldown,
}: {
  blocks: StatementBlock[]
  columns: StatementColumn[]
  /** Adds variance columns between the first two columns. */
  comparing: boolean
  /** What the % columns are a percentage of; omit for no % columns. */
  percentLabel?: string
  collapsed: ReadonlySet<string>
  search: string
  hideZeroRows: boolean
  onToggleSection: (id: string) => void
  /** Called with the clicked account, or null for a whole section. */
  onDrilldown?: DrilldownHandler
}) {
  // Beyond two amounts (the period breakdown), % columns would crowd out the figures.
  const withPercent = percentLabel !== undefined && columns.length <= 2
  const columnCount =
    2 + columns.length * (withPercent ? 2 : 1) + (comparing ? 2 : 0)
  const searching = search.trim() !== ""
  const visible = filterBlocks(blocks, { search, hideZeroRows })
  const values = { columns, withPercent, comparing }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-20">Code</TableHead>
          <TableHead>Account Name</TableHead>
          {columns.map((column) => (
            <Fragment key={column.key}>
              <TableHead
                className={cn("text-right", column.isTotal && "bg-muted/50")}
              >
                {column.label}
              </TableHead>
              {withPercent && (
                <TableHead
                  className="text-right text-muted-foreground"
                  title={percentLabel}
                >
                  %
                </TableHead>
              )}
            </Fragment>
          ))}
          {comparing && (
            <>
              <TableHead className="text-right">Variance</TableHead>
              <TableHead className="text-right">Var %</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {visible.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={columnCount}
              className="py-10 text-center text-muted-foreground"
            >
              No accounts match “{search.trim()}”.
            </TableCell>
          </TableRow>
        )}
        {visible.map(({ block, items }) =>
          block.kind === "section" ? (
            <Section
              key={block.id}
              {...values}
              block={block}
              items={items}
              collapsed={!searching && collapsed.has(block.id)}
              searching={searching}
              columnCount={columnCount}
              onToggle={() => onToggleSection(block.id)}
              onDrilldown={onDrilldown}
            />
          ) : block.kind === "heading" ? (
            <TableRow key={block.id} className="border-0 hover:bg-transparent">
              <TableCell
                colSpan={columnCount}
                className="pt-6 text-sm font-bold tracking-wide uppercase"
              >
                {block.title}
              </TableCell>
            </TableRow>
          ) : (
            <TableRow
              key={block.id}
              className={cn(
                "border-0 hover:bg-transparent",
                block.emphasis && "bg-primary/4"
              )}
            >
              <TableCell className="p-0" />
              <TableCell
                className={cn(
                  "border-t-2 border-foreground/25 py-2.5 text-xs font-bold tracking-wide uppercase",
                  block.emphasis && "text-sm"
                )}
              >
                {block.row.label}
              </TableCell>
              <ValueCells
                {...values}
                row={block.row}
                className="border-t-2 border-foreground/25 py-2.5 font-bold"
              />
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  )
}

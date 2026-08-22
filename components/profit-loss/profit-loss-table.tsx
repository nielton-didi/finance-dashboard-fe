import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { ProfitLossItem, ProfitLossResponse, ProfitLossSection } from "@/lib/profit-loss-mock"

const COL_COUNT = 4

function fmt(n: number): string {
  return new Intl.NumberFormat("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function fmtPct(value: number, base: number): string {
  if (base === 0) return "-"
  return new Intl.NumberFormat("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format((value / base) * 100)
}

function SectionHeaderRow({ title }: { title: string }) {
  return (
    <TableRow className="border-0 hover:bg-transparent">
      <TableCell
        colSpan={COL_COUNT}
        className="border-b border-border pt-1 pb-1.5 text-xs font-semibold tracking-wide text-foreground/80 uppercase"
      >
        {title}
      </TableCell>
    </TableRow>
  )
}

function ItemRow({ item, baseTotal }: { item: ProfitLossItem; baseTotal: number }) {
  return (
    <TableRow className="border-0 hover:bg-muted/40">
      <TableCell className="w-20 py-1.5 font-mono text-xs text-muted-foreground/70">
        {item.accountCode}
      </TableCell>
      <TableCell className="py-1.5 whitespace-normal">{item.accountName}</TableCell>
      <TableCell className="w-32 py-1.5 text-right tabular-nums">{fmt(item.amount)}</TableCell>
      <TableCell className="w-16 py-1.5 text-right tabular-nums text-muted-foreground">
        {fmtPct(item.amount, baseTotal)}
      </TableCell>
    </TableRow>
  )
}

function SectionTotalRow({
  label,
  section,
  baseTotal,
}: {
  label: string
  section: ProfitLossSection
  baseTotal: number
}) {
  return (
    <TableRow className="border-0 hover:bg-transparent">
      <TableCell className="p-0" />
      <TableCell className="border-t border-border pt-1.5 pb-2 font-semibold">{label}</TableCell>
      <TableCell className="border-t border-border pt-1.5 pb-2 text-right font-semibold tabular-nums">
        {fmt(section.total)}
      </TableCell>
      <TableCell className="border-t border-border pt-1.5 pb-2 text-right font-semibold tabular-nums text-muted-foreground">
        {fmtPct(section.total, baseTotal)}
      </TableCell>
    </TableRow>
  )
}

function SummaryRow({
  label,
  value,
  baseTotal,
  emphasis,
}: {
  label: string
  value: number
  baseTotal: number
  emphasis: "subtle" | "strong"
}) {
  return (
    <TableRow
      className={cn(
        "border-0 hover:bg-transparent",
        emphasis === "strong" && "bg-primary/4"
      )}
    >
      <TableCell className="p-0" />
      <TableCell
        className={cn(
          "border-t-2 border-foreground/25 py-2.5 text-xs font-bold tracking-wide uppercase",
          emphasis === "strong" && "text-sm"
        )}
      >
        {label}
      </TableCell>
      <TableCell
        className={cn(
          "border-t-2 border-b-2 border-double border-t-foreground/25 border-b-foreground/40 py-2.5 text-right font-bold tabular-nums",
          emphasis === "strong" && "text-base"
        )}
      >
        {fmt(value)}
      </TableCell>
      <TableCell className="border-t-2 border-foreground/25 py-2.5 text-right font-bold tabular-nums text-muted-foreground">
        {fmtPct(value, baseTotal)}
      </TableCell>
    </TableRow>
  )
}

function SpacerRow() {
  return (
    <TableRow className="border-0 hover:bg-transparent">
      <TableCell colSpan={COL_COUNT} className="h-6 p-0" />
    </TableRow>
  )
}

export function ProfitLossTable({ data }: { data: ProfitLossResponse }) {
  const {
    sales,
    salesAdjustments,
    netSales,
    costOfGoodsSold,
    grossProfit,
    otherIncomes,
    expenses,
    netProfit,
  } = data
  const baseTotal = sales.total

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-20">Code</TableHead>
          <TableHead>Account Name</TableHead>
          <TableHead className="w-32 text-right">This Year</TableHead>
          <TableHead className="w-16 text-right">%</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <SectionHeaderRow title={sales.title} />
        {sales.items.map((item) => (
          <ItemRow key={item.accountCode} item={item} baseTotal={baseTotal} />
        ))}
        <SectionTotalRow label={`Total ${sales.title}`} section={sales} baseTotal={baseTotal} />

        <SpacerRow />

        <SectionHeaderRow title={salesAdjustments.title} />
        {salesAdjustments.items.map((item) => (
          <ItemRow key={item.accountCode} item={item} baseTotal={baseTotal} />
        ))}
        <SectionTotalRow
          label={`Total ${salesAdjustments.title}`}
          section={salesAdjustments}
          baseTotal={baseTotal}
        />

        <SpacerRow />

        <SummaryRow label="Net Sales" value={netSales} baseTotal={baseTotal} emphasis="subtle" />

        <SpacerRow />

        <SectionHeaderRow title={costOfGoodsSold.title} />
        {costOfGoodsSold.items.map((item) => (
          <ItemRow key={item.accountCode} item={item} baseTotal={baseTotal} />
        ))}
        <SectionTotalRow
          label={`Total ${costOfGoodsSold.title}`}
          section={costOfGoodsSold}
          baseTotal={baseTotal}
        />

        <SpacerRow />

        <SummaryRow
          label="Gross Profit / (Loss)"
          value={grossProfit}
          baseTotal={baseTotal}
          emphasis="subtle"
        />

        <SpacerRow />

        <SectionHeaderRow title={otherIncomes.title} />
        {otherIncomes.items.map((item) => (
          <ItemRow key={item.accountCode} item={item} baseTotal={baseTotal} />
        ))}
        <SectionTotalRow
          label={`Total ${otherIncomes.title}`}
          section={otherIncomes}
          baseTotal={baseTotal}
        />

        <SpacerRow />

        <SectionHeaderRow title={expenses.title} />
        {expenses.items.map((item) => (
          <ItemRow key={item.accountCode} item={item} baseTotal={baseTotal} />
        ))}
        <SectionTotalRow
          label={`Total ${expenses.title}`}
          section={expenses}
          baseTotal={baseTotal}
        />

        <SpacerRow />

        <SummaryRow
          label="Net Profit / (Loss)"
          value={netProfit}
          baseTotal={baseTotal}
          emphasis="strong"
        />
      </TableBody>
    </Table>
  )
}

import {
  getVariance,
  isZeroRow,
  type Cell,
  type StatementBlock,
} from "@/lib/statement-rows"

export type ExportCell = string | number | null

export interface ExportSheet {
  fileName: string
  sheetName: string
  headers: string[]
  rows: ExportCell[][]
}

const round = (n: number) => Math.round(n * 100) / 100

/** Mirrors the on-screen columns; collapsed sections are always exported in full. */
export function buildExportSheet({
  blocks,
  columnLabels,
  comparing,
  withPercent: percentWanted,
  hideZeroRows,
  fileName,
  sheetName,
}: {
  blocks: StatementBlock[]
  columnLabels: string[]
  comparing: boolean
  withPercent: boolean
  hideZeroRows: boolean
  fileName: string
  sheetName: string
}): ExportSheet {
  // The period view has a % column beside each amount; the breakdown does not.
  const withPercent = percentWanted && columnLabels.length <= 2
  const headers = ["Code", "Account Name"]
  for (const label of columnLabels) {
    headers.push(label)
    if (withPercent) headers.push("%")
  }
  if (comparing) headers.push("Variance", "Variance %")

  const values = (
    row: Parameters<typeof getVariance>[0] & { cells: Cell[] }
  ): ExportCell[] => {
    const result: ExportCell[] = row.cells.flatMap((cell) =>
      withPercent ? [cell.amount, cell.percent] : [cell.amount]
    )
    if (comparing) {
      const { amount, percent } = getVariance(row)
      result.push(amount, percent === null ? null : round(percent))
    }
    return result
  }

  const rows: ExportCell[][] = []
  for (const block of blocks) {
    if (block.kind === "heading") {
      rows.push([null, block.title])
      continue
    }
    if (block.kind === "summary") {
      rows.push([null, block.row.label, ...values(block.row)])
      continue
    }
    const items = block.items.filter(
      (item) => !(hideZeroRows && isZeroRow(item))
    )
    if (hideZeroRows && block.hideWhenEmpty && items.length === 0) continue
    rows.push([null, block.title])
    for (const item of items) {
      rows.push([item.accountCode, item.label, ...values(item)])
    }
    rows.push([null, block.total.label, ...values(block.total)])
  }

  return { fileName, sheetName, headers, rows }
}

/** Turns a title into a file name, keeping letters of any script. */
export function exportSlug(name: string): string {
  return name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "")
}

function escapeCsv(value: ExportCell): string {
  if (value === null) return ""
  if (typeof value === "number") return String(value)
  // A leading = + - @ would be run as a formula when the file opens in Excel.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return /[",\n\r]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe
}

export function downloadCsv({ fileName, headers, rows }: ExportSheet): void {
  const lines = [headers, ...rows].map((row) => row.map(escapeCsv).join(","))
  // The BOM makes Excel read the file as UTF-8 (e.g. Chinese account names).
  const blob = new Blob(["﻿" + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${fileName}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export async function downloadExcel({
  fileName,
  sheetName,
  headers,
  rows,
}: ExportSheet): Promise<void> {
  const XLSX = await import("xlsx")
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  sheet["!cols"] = headers.map((_, i) => ({ wch: i === 1 ? 40 : 14 }))
  for (const [address, cell] of Object.entries(sheet)) {
    if (!address.startsWith("!") && cell.t === "n")
      cell.z = "#,##0.00;(#,##0.00)"
  }
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName)
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

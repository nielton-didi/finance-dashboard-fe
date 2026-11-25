import type { ExportSheet } from "@/lib/statement-export"
import { formatAmount } from "@/lib/statement-format"

/** The PDF's built-in fonts only cover Latin-1; anything else would print as junk. */
function latin(text: string): string {
  return text
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7e\xa0-\xff]/g, "?")
}

/** A one-table landscape A4 report. The last row is set apart as the total. */
export async function downloadTablePdf({
  title,
  subtitle,
  sheet,
  remarks,
}: {
  title: string
  subtitle: string
  sheet: ExportSheet
  remarks: string[]
}): Promise<void> {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ])
  const doc = new jsPDF({ orientation: "landscape", format: "a4" })
  const margin = 14

  doc.setFontSize(16)
  doc.text(latin(title), margin, 18)
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(latin(subtitle), margin, 25)

  let end = 30
  autoTable(doc, {
    startY: end,
    margin: { left: margin, right: margin },
    head: [sheet.headers.map(latin)],
    body: sheet.rows.map((row) =>
      row.map((value) => {
        if (value === null) return "-"
        return typeof value === "number" ? formatAmount(value) : latin(value)
      })
    ),
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 1.8 },
    headStyles: { fillColor: [40, 40, 40], halign: "right" },
    columnStyles: Object.fromEntries(
      sheet.headers.map((_, i) => [i, { halign: i === 0 ? "left" : "right" }])
    ),
    didParseCell: ({ section, column, row, cell }) => {
      if (section === "head" && column.index === 0) cell.styles.halign = "left"
      if (section === "body" && row.index === sheet.rows.length - 1) {
        cell.styles.fontStyle = "bold"
        cell.styles.fillColor = [240, 240, 240]
      }
    },
    didDrawPage: ({ cursor }) => {
      if (cursor) end = cursor.y
    },
  })

  doc.setFontSize(8)
  const pageHeight = doc.internal.pageSize.getHeight()
  const width = doc.internal.pageSize.getWidth() - margin * 2
  for (const remark of remarks) {
    const lines: string[] = doc.splitTextToSize(latin(remark), width)
    for (const line of lines) {
      end += 5
      if (end > pageHeight - margin) {
        doc.addPage()
        end = margin
      }
      doc.text(line, margin, end)
    }
  }

  doc.save(`${sheet.fileName}.pdf`)
}

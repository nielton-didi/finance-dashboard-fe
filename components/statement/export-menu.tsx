"use client"

import * as React from "react"
import { ChevronDownIcon, DownloadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  downloadCsv,
  downloadExcel,
  type ExportSheet,
} from "@/lib/statement-export"

export function ExportMenu({
  getSheet,
  downloadPdf,
}: {
  getSheet: () => ExportSheet
  /** Adds a PDF option. */
  downloadPdf?: () => Promise<void>
}) {
  const [failed, setFailed] = React.useState(false)

  async function handleExport(format: "csv" | "xlsx" | "pdf") {
    setFailed(false)
    try {
      if (format === "csv") downloadCsv(getSheet())
      else if (format === "xlsx") await downloadExcel(getSheet())
      else await downloadPdf?.()
    } catch {
      setFailed(true)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {failed && (
        <p role="alert" className="text-sm text-destructive">
          The export could not be created.
        </p>
      )}
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
          {downloadPdf && (
            <DropdownMenuItem onClick={() => handleExport("pdf")}>
              PDF (.pdf)
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

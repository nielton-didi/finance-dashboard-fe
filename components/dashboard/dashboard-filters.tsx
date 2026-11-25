"use client"

import {
  AsOfFilters,
  RefreshButton,
} from "@/components/statement/filter-controls"

export function DashboardFilters({ asOfDate }: { asOfDate: string }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <AsOfFilters asOfDate={asOfDate} />
      <RefreshButton />
    </div>
  )
}

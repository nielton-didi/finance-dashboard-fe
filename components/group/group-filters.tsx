"use client"

import {
  AsOfFilters,
  RangeFilters,
  RefreshButton,
} from "@/components/statement/filter-controls"

export function OverviewFilters({ asOfDate }: { asOfDate: string }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <AsOfFilters asOfDate={asOfDate} />
      <RefreshButton />
    </div>
  )
}

export function ConsolidatedFilters({
  fromDate,
  toDate,
}: {
  fromDate: string
  toDate: string
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <RangeFilters fromDate={fromDate} toDate={toDate} />
      <RefreshButton />
    </div>
  )
}

"use client"

import {
  AsOfFilters,
  DimensionFilters,
  FilterSelect,
  RefreshButton,
} from "@/components/statement/filter-controls"
import { useReportNavigation } from "@/components/statement/report-navigation"
import type { BalanceSheetParams } from "@/lib/balance-sheet-params"
import type { StatementFilterOptions } from "@/lib/statement"

export function BalanceSheetFilters({
  params,
  options,
}: {
  params: BalanceSheetParams
  options: StatementFilterOptions
}) {
  const { setParams } = useReportNavigation()
  const { asOfDate, compareTo, projectNo, deptNo } = params

  return (
    <div className="flex flex-wrap items-end gap-3">
      <AsOfFilters asOfDate={asOfDate} />

      <FilterSelect
        label="Compare to"
        value={compareTo}
        onChange={(event) => setParams({ compare: event.target.value })}
      >
        <option value="prior_year">Prior year</option>
        <option value="none">No comparison</option>
      </FilterSelect>

      <DimensionFilters
        options={options}
        projectNo={projectNo}
        deptNo={deptNo}
      />
      <RefreshButton />
    </div>
  )
}

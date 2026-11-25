"use client"

import {
  DimensionFilters,
  FilterSelect,
  RangeFilters,
  RefreshButton,
} from "@/components/statement/filter-controls"
import { useReportNavigation } from "@/components/statement/report-navigation"
import type { CashFlowParams } from "@/lib/cash-flow-params"
import type { StatementFilterOptions } from "@/lib/statement"

export function CashFlowFilters({
  params,
  options,
}: {
  params: CashFlowParams
  options: StatementFilterOptions
}) {
  const { setParams } = useReportNavigation()
  const { fromDate, toDate, compareTo, projectNo, deptNo } = params

  return (
    <div className="flex flex-wrap items-end gap-3">
      <RangeFilters fromDate={fromDate} toDate={toDate} />
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

"use client"

import {
  DimensionFilters,
  FilterSelect,
  RangeFilters,
  RefreshButton,
} from "@/components/statement/filter-controls"
import { useReportNavigation } from "@/components/statement/report-navigation"
import { compareValue, type ProfitLossParams } from "@/lib/profit-loss-params"
import type { StatementFilterOptions } from "@/lib/statement"

export function ProfitLossFilters({
  params,
  options,
}: {
  params: ProfitLossParams
  options: StatementFilterOptions
}) {
  const { setParams } = useReportNavigation()
  const { fromDate, toDate, compareTo, budgetKey, projectNo, deptNo } = params
  const unknownBudget =
    compareTo === "budget" &&
    !options.budgets.some((budget) => budget.key === budgetKey)

  return (
    <div className="flex flex-wrap items-end gap-3">
      <RangeFilters fromDate={fromDate} toDate={toDate} />

      <FilterSelect
        label="Compare to"
        value={compareValue(params)}
        onChange={(event) => setParams({ compare: event.target.value })}
      >
        <option value="prior_year">Prior year</option>
        {options.budgets.map((budget) => (
          <option key={budget.key} value={`budget:${budget.key}`}>
            Budget: {budget.name}
          </option>
        ))}
        {unknownBudget && (
          <option value={`budget:${budgetKey}`}>Unknown budget</option>
        )}
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

"use client"

import { DateRangePicker } from "@/components/statement/date-range-picker"
import {
  DimensionFilters,
  FilterSelect,
  RefreshButton,
} from "@/components/statement/filter-controls"
import { useReportNavigation } from "@/components/statement/report-navigation"
import {
  compareValue,
  matchPreset,
  PERIOD_PRESETS,
  presetRange,
  type PeriodPreset,
  type ProfitLossParams,
} from "@/lib/profit-loss-params"
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
      <FilterSelect
        label="Quick range"
        value={matchPreset(fromDate, toDate)}
        onChange={(event) => {
          if (event.target.value === "custom") return
          setParams(presetRange(event.target.value as PeriodPreset))
        }}
      >
        {Object.entries(PERIOD_PRESETS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
        {/* Reached by picking dates, never by choosing it here. */}
        <option value="custom" disabled>
          Custom
        </option>
      </FilterSelect>

      <div className="flex flex-col gap-1 text-xs">
        <span className="text-muted-foreground">Date range</span>
        <DateRangePicker
          // Presets change the range from outside, so start from fresh state.
          key={`${fromDate}_${toDate}`}
          fromDate={fromDate}
          toDate={toDate}
          onChange={(from, to) => setParams({ fromDate: from, toDate: to })}
        />
      </div>

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

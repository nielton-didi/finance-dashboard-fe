"use client"

import { DatePicker } from "@/components/statement/date-picker"
import {
  DimensionFilters,
  FilterSelect,
  RefreshButton,
} from "@/components/statement/filter-controls"
import { useReportNavigation } from "@/components/statement/report-navigation"
import {
  AS_OF_PRESETS,
  matchAsOfPreset,
  presetDate,
  type AsOfPreset,
  type BalanceSheetParams,
} from "@/lib/balance-sheet-params"
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
      <FilterSelect
        label="Quick date"
        value={matchAsOfPreset(asOfDate)}
        onChange={(event) => {
          if (event.target.value === "custom") return
          setParams({ asOf: presetDate(event.target.value as AsOfPreset) })
        }}
      >
        {Object.entries(AS_OF_PRESETS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
        {/* Reached by picking a date, never by choosing it here. */}
        <option value="custom" disabled>
          Custom
        </option>
      </FilterSelect>

      <div className="flex flex-col gap-1 text-xs">
        <span className="text-muted-foreground">As of</span>
        <DatePicker
          date={asOfDate}
          onChange={(date) => setParams({ asOf: date })}
        />
      </div>

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

"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { DateRangePicker } from "@/components/profit-loss/date-range-picker"
import { useReportNavigation } from "@/components/profit-loss/report-navigation"
import { Button } from "@/components/ui/button"
import type { ProfitLossFilterOptions } from "@/lib/profit-loss"
import {
  compareValue,
  matchPreset,
  PERIOD_PRESETS,
  presetRange,
  type PeriodPreset,
  type ProfitLossParams,
} from "@/lib/profit-loss-params"
import { cn } from "@/lib/utils"

function FilterSelect({
  label,
  className,
  ...props
}: React.ComponentProps<"select"> & { label: string }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      {label}
      <select
        className={cn(
          "h-8 max-w-48 rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
          className
        )}
        {...props}
      />
    </label>
  )
}

function optionLabel({ code, name }: { code: string; name: string }) {
  return name ? `${code} – ${name}` : code
}

/** A selected value that AutoCount no longer lists still needs an option to show. */
function withSelected(
  options: { code: string; name: string }[],
  selected: string | undefined
) {
  return selected && !options.some((option) => option.code === selected)
    ? [...options, { code: selected, name: "" }]
    : options
}

export function ProfitLossFilters({
  params,
  options,
}: {
  params: ProfitLossParams
  options: ProfitLossFilterOptions
}) {
  const { setParams, refresh, isPending } = useReportNavigation()
  const { fromDate, toDate, compareTo, budgetKey, projectNo, deptNo } = params
  const preset = matchPreset(fromDate, toDate)
  const projects = withSelected(options.projects, projectNo)
  const departments = withSelected(options.departments, deptNo)
  const unknownBudget =
    compareTo === "budget" &&
    !options.budgets.some((budget) => budget.key === budgetKey)

  return (
    <div className="flex flex-wrap items-end gap-3">
      <FilterSelect
        label="Quick range"
        value={preset}
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

      {projects.length > 0 && (
        <FilterSelect
          label="Project"
          value={projectNo ?? ""}
          onChange={(event) => setParams({ project: event.target.value })}
        >
          <option value="">All projects</option>
          {projects.map((project) => (
            <option key={project.code} value={project.code}>
              {optionLabel(project)}
            </option>
          ))}
        </FilterSelect>
      )}

      {departments.length > 0 && (
        <FilterSelect
          label="Department"
          value={deptNo ?? ""}
          onChange={(event) => setParams({ dept: event.target.value })}
        >
          <option value="">All departments</option>
          {departments.map((department) => (
            <option key={department.code} value={department.code}>
              {optionLabel(department)}
            </option>
          ))}
        </FilterSelect>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={refresh}
        disabled={isPending}
        aria-label="Refresh from AutoCount"
        title="Refresh from AutoCount"
      >
        <RefreshCwIcon className={cn(isPending && "animate-spin")} />
      </Button>
    </div>
  )
}

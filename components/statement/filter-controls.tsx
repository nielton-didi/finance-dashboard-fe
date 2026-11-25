"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { useReportNavigation } from "@/components/statement/report-navigation"
import { Button } from "@/components/ui/button"
import type { StatementFilterOptions } from "@/lib/statement"
import { cn } from "@/lib/utils"

export function FilterSelect({
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

function DimensionSelect({
  label,
  allLabel,
  param,
  options,
  selected,
}: {
  label: string
  allLabel: string
  param: string
  options: { code: string; name: string }[]
  selected: string | undefined
}) {
  const { setParams } = useReportNavigation()
  // A selected value that AutoCount no longer lists still needs an option to show.
  const choices =
    selected && !options.some((option) => option.code === selected)
      ? [...options, { code: selected, name: "" }]
      : options
  if (choices.length === 0) return null

  return (
    <FilterSelect
      label={label}
      value={selected ?? ""}
      onChange={(event) => setParams({ [param]: event.target.value })}
    >
      <option value="">{allLabel}</option>
      {choices.map(({ code, name }) => (
        <option key={code} value={code}>
          {name ? `${code} – ${name}` : code}
        </option>
      ))}
    </FilterSelect>
  )
}

export function DimensionFilters({
  options,
  projectNo,
  deptNo,
}: {
  options: StatementFilterOptions
  projectNo: string | undefined
  deptNo: string | undefined
}) {
  return (
    <>
      <DimensionSelect
        label="Project"
        allLabel="All projects"
        param="project"
        options={options.projects}
        selected={projectNo}
      />
      <DimensionSelect
        label="Department"
        allLabel="All departments"
        param="dept"
        options={options.departments}
        selected={deptNo}
      />
    </>
  )
}

export function RefreshButton() {
  const { refresh, isPending } = useReportNavigation()
  return (
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
  )
}

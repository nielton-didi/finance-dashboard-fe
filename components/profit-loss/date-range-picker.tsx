"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function DateRangePicker({
  fromDate,
  toDate,
}: {
  fromDate: string
  toDate: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const [range, setRange] = React.useState<DateRange | undefined>({
    from: fromDate ? new Date(fromDate + "T00:00:00") : undefined,
    to: toDate ? new Date(toDate + "T00:00:00") : undefined,
  })

  function handleSelect(newRange: DateRange | undefined, triggerDate: Date) {
    // If the previous selection was already a complete range, react-day-picker
    // pairs this click with the stale endpoint and completes a new range
    // immediately. Treat it as the start of a fresh selection instead, so the
    // user gets to pick an end date rather than having one assumed for them.
    if (range?.from && range?.to) {
      setRange({ from: triggerDate, to: undefined })
      return
    }

    setRange(newRange)
    if (newRange?.from && newRange?.to) {
      const params = new URLSearchParams({
        fromDate: format(newRange.from, "yyyy-MM-dd"),
        toDate: format(newRange.to, "yyyy-MM-dd"),
      })
      router.replace(`${pathname}?${params}`)
      setOpen(false)
    }
  }

  const label =
    range?.from && range?.to
      ? `${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`
      : range?.from
        ? format(range.from, "MMM d, yyyy")
        : "Pick a date range"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className={cn(!range && "text-muted-foreground")} />
        }
      >
        <CalendarIcon />
        {label}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
          captionLayout="dropdown"
          defaultMonth={range?.from}
        />
      </PopoverContent>
    </Popover>
  )
}

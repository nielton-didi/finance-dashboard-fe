"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatDate, isoDate } from "@/lib/report-params"

export function DatePicker({
  date,
  onChange,
}: {
  date: string
  onChange: (date: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const selected = parseISO(date)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            aria-label={`Date: ${format(selected, "PPP")}`}
          />
        }
      >
        <CalendarIcon />
        {formatDate(date)}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          required
          selected={selected}
          defaultMonth={selected}
          captionLayout="dropdown"
          onSelect={(next: Date) => {
            setOpen(false)
            onChange(isoDate(next))
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

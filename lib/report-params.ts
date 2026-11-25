import { format, isValid, parseISO } from "date-fns"

export type RawSearchParams = Record<string, string | string[] | undefined>

export function isoDate(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

/** A search param's value, ignoring empty and repeated ones. */
export function single(
  value: string | string[] | undefined
): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined
}

export function parseDateParam(
  value: string | string[] | undefined
): string | undefined {
  const date = single(value)
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined
  return isValid(parseISO(date)) ? date : undefined
}

export function formatDate(date: string): string {
  return format(parseISO(date), "MMM d, yyyy")
}

export function formatRange(fromDate: string, toDate: string): string {
  return `${formatDate(fromDate)} – ${formatDate(toDate)}`
}

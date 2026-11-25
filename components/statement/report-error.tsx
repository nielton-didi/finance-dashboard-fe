import { Card, CardContent } from "@/components/ui/card"
import { ApiError } from "@/lib/api"

/**
 * Autocount connection problems and rejected filters (e.g. a deleted budget, or a
 * breakdown over too many months) are shown in place, so the filters stay usable.
 */
export function isDisplayableError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError &&
    (Boolean(error.reason) ||
      error.statusCode === 400 ||
      error.statusCode === 404)
  )
}

export function ReportError({ error }: { error: ApiError }) {
  const message = !error.reason
    ? "This report can't be shown with the current filters."
    : error.reason === "NOT_CONFIGURED"
      ? "This organization's Autocount database hasn't been set up yet. Add its connection details in Settings > AutoCount Database."
      : "This organization's Autocount database isn't reachable right now. Please try again later."

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="font-medium">{message}</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </CardContent>
    </Card>
  )
}

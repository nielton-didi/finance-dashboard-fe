import type { GroupExclusion, GroupReport } from "@/lib/group"

const listNames = (exclusions: GroupExclusion[]) =>
  exclusions.map(({ name }) => name).join(", ")

/** One sentence per reason that organizations are missing from the totals. */
export function exclusionMessages(excluded: GroupExclusion[]): {
  failed: string | null
  notConfigured: string | null
} {
  const failed = excluded.filter(({ reason }) => reason !== "NOT_CONFIGURED")
  const notConfigured = excluded.filter(
    ({ reason }) => reason === "NOT_CONFIGURED"
  )
  return {
    failed:
      failed.length > 0
        ? `Not included because their AutoCount database could not be read: ${listNames(failed)}. The totals are incomplete.`
        : null,
    notConfigured:
      notConfigured.length > 0
        ? `Not included because AutoCount is not set up: ${listNames(notConfigured)}.`
        : null,
  }
}

/** Everything a reader of the totals needs to know, for exports. */
export function groupRemarks<T>(report: GroupReport<T>): string[] {
  const { failed, notConfigured } = exclusionMessages(report.excluded)
  return [failed, ...report.warnings, ...report.notes, notConfigured].filter(
    (remark) => remark !== null
  )
}

export function GroupAlerts<T>({ report }: { report: GroupReport<T> }) {
  const { failed } = exclusionMessages(report.excluded)
  const alerts = [failed, ...report.warnings].filter((alert) => alert !== null)
  if (alerts.length === 0) return null

  return (
    <div
      role="alert"
      className="flex flex-col gap-1 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {alerts.map((alert) => (
        <p key={alert}>{alert}</p>
      ))}
    </div>
  )
}

export function GroupNotes<T>({ report }: { report: GroupReport<T> }) {
  const { notConfigured } = exclusionMessages(report.excluded)
  const notes = [...report.notes, notConfigured].filter((note) => note !== null)

  return (
    <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
      {notes.map((note) => (
        <li key={note}>{note}</li>
      ))}
    </ul>
  )
}

export function GroupEmpty() {
  return (
    <p className="py-16 text-center text-muted-foreground">
      None of your organizations has AutoCount figures to show.
    </p>
  )
}

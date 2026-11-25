import { formatAmount } from "@/lib/profit-loss-format"

export interface BarListItem {
  key: string
  label: string
  value: number
}

/** Ranked horizontal bars. Every bar is labelled with its value, so no axis. */
export function BarList({ items }: { items: BarListItem[] }) {
  const min = Math.min(0, ...items.map((item) => item.value))
  const max = Math.max(0, ...items.map((item) => item.value))
  const span = max - min || 1
  const zero = (-min / span) * 100

  return (
    <ul className="flex flex-col gap-3">
      {items.map(({ key, label, value }) => {
        const size = (Math.abs(value) / span) * 100
        return (
          <li key={key} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate text-muted-foreground" title={label}>
                {label}
              </span>
              <span className="font-medium tabular-nums">
                {formatAmount(value)}
              </span>
            </div>
            <div className="relative h-2">
              <div
                className={
                  value < 0
                    ? "absolute inset-y-0 rounded-l-[4px] bg-chart-1"
                    : "absolute inset-y-0 rounded-r-[4px] bg-chart-1"
                }
                style={{
                  left: `${value < 0 ? zero - size : zero}%`,
                  width: `${size}%`,
                }}
              />
              {min < 0 && (
                <div
                  className="absolute -inset-y-0.5 w-px bg-muted-foreground/60"
                  style={{ left: `${zero}%` }}
                />
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

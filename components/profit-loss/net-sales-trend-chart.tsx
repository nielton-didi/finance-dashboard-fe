"use client"

import * as React from "react"

import type { ProfitLossTrend } from "@/lib/profit-loss"
import { formatAmount, formatCompact } from "@/lib/profit-loss-format"
import { cn } from "@/lib/utils"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const HEIGHT = 240
const MARGIN = { top: 12, right: 16, bottom: 24, left: 52 }

function niceTicks(min: number, max: number): number[] {
  const span = max - min || 1
  const rough = span / 4
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const step =
    [1, 2, 2.5, 5, 10].find((m) => m * magnitude >= rough)! * magnitude
  const start = Math.floor(min / step)
  const end = Math.max(Math.ceil(max / step), start + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => (start + i) * step)
}

function useWidth() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}

function LineKey({ className }: { className: string }) {
  return (
    <span aria-hidden className={cn("h-0.5 w-3 rounded-full", className)} />
  )
}

export function NetSalesTrendChart({
  trend,
  lastMonth,
}: {
  trend: ProfitLossTrend
  /** Months of the current year after this one haven't happened yet. */
  lastMonth: number
}) {
  const [ref, width] = useWidth()
  const [active, setActive] = React.useState<number | null>(null)

  const current = trend.months.slice(0, lastMonth).map((m) => m.current)
  const prior = trend.months.map((m) => m.prior)
  const ticks = niceTicks(
    Math.min(0, ...current, ...prior),
    Math.max(0, ...current, ...prior)
  )
  const [low, high] = [ticks[0], ticks[ticks.length - 1]]

  const innerWidth = Math.max(width - MARGIN.left - MARGIN.right, 0)
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom
  const x = (index: number) => MARGIN.left + (index / 11) * innerWidth
  const y = (value: number) =>
    MARGIN.top + (1 - (value - low) / (high - low)) * innerHeight
  const path = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join("")

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const { left } = event.currentTarget.getBoundingClientRect()
    const index = Math.round(
      ((event.clientX - left - MARGIN.left) / innerWidth) * 11
    )
    setActive(Math.min(11, Math.max(0, index)))
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key]
    if (!step) return
    event.preventDefault()
    setActive((index) =>
      index === null ? 0 : Math.min(11, Math.max(0, index + step))
    )
  }

  const showEveryMonth = innerWidth > 420

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <LineKey className="bg-chart-1" />
          {trend.year}
        </span>
        <span className="flex items-center gap-1.5">
          <LineKey className="bg-muted-foreground" />
          {trend.year - 1}
        </span>
      </figcaption>

      <div ref={ref} className="relative" style={{ height: HEIGHT }}>
        {width > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label={`Monthly net sales, ${trend.year} and ${trend.year - 1}. Use the arrow keys to read each month.`}
            tabIndex={0}
            className="touch-pan-y rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setActive(null)}
            onBlur={() => setActive(null)}
            onKeyDown={handleKeyDown}
          >
            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={MARGIN.left}
                  x2={width - MARGIN.right}
                  y1={y(tick)}
                  y2={y(tick)}
                  className="stroke-border"
                />
                <text
                  x={MARGIN.left - 8}
                  y={y(tick)}
                  dy="0.32em"
                  textAnchor="end"
                  className="fill-muted-foreground text-[11px]"
                >
                  {formatCompact(tick)}
                </text>
              </g>
            ))}
            {MONTHS.map(
              (month, i) =>
                (showEveryMonth || i % 2 === 0) && (
                  <text
                    key={month}
                    x={x(i)}
                    y={HEIGHT - 6}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[11px]"
                  >
                    {month}
                  </text>
                )
            )}

            {active !== null && (
              <line
                x1={x(active)}
                x2={x(active)}
                y1={MARGIN.top}
                y2={MARGIN.top + innerHeight}
                className="stroke-muted-foreground/50"
              />
            )}

            {[
              {
                values: prior,
                stroke: "stroke-muted-foreground",
                fill: "fill-muted-foreground",
              },
              {
                values: current,
                stroke: "stroke-chart-1",
                fill: "fill-chart-1",
              },
            ].map(({ values, stroke, fill }) => {
              const dot = active ?? values.length - 1
              return (
                <g key={stroke}>
                  <path
                    d={path(values)}
                    fill="none"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className={stroke}
                  />
                  {dot >= 0 && dot < values.length && (
                    <circle
                      cx={x(dot)}
                      cy={y(values[dot])}
                      r={4}
                      strokeWidth={2}
                      className={cn("stroke-card", fill)}
                    />
                  )}
                </g>
              )
            })}
          </svg>
        )}

        {active !== null && width > 0 && (
          <div
            role="status"
            className="pointer-events-none absolute top-2 z-10 flex flex-col gap-1 rounded-lg bg-popover px-2.5 py-2 text-xs whitespace-nowrap text-popover-foreground shadow-md ring-1 ring-foreground/10"
            style={
              active < 6
                ? { left: x(active) + 10 }
                : { right: width - x(active) + 10 }
            }
          >
            <span className="text-muted-foreground">{MONTHS[active]}</span>
            {active < current.length && (
              <span className="flex items-center gap-1.5">
                <LineKey className="bg-chart-1" />
                <strong className="tabular-nums">
                  RM {formatAmount(current[active])}
                </strong>
                <span className="text-muted-foreground">{trend.year}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <LineKey className="bg-muted-foreground" />
              <strong className="tabular-nums">
                RM {formatAmount(prior[active])}
              </strong>
              <span className="text-muted-foreground">{trend.year - 1}</span>
            </span>
          </div>
        )}
      </div>

      <table className="sr-only">
        <caption>Monthly net sales</caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>{trend.year}</th>
            <th>{trend.year - 1}</th>
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((month, i) => (
            <tr key={month}>
              <th>{month}</th>
              <td>{i < current.length ? formatAmount(current[i]) : "—"}</td>
              <td>{formatAmount(prior[i])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

const amountFormat = new Intl.NumberFormat("en-MY", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactFormat = new Intl.NumberFormat("en-MY", {
  notation: "compact",
  maximumFractionDigits: 1,
})

/** Accounting style: negatives in parentheses. */
export function formatAmount(value: number): string {
  const formatted = amountFormat.format(Math.abs(value))
  return value < 0 ? `(${formatted})` : formatted
}

export function formatPercent(value: number): string {
  const formatted = amountFormat.format(Math.abs(value))
  return value < 0 ? `(${formatted})` : formatted
}

export function formatCompact(value: number): string {
  return compactFormat.format(value)
}

export function ratioPercent(value: number, base: number): number | null {
  return base === 0 ? null : (value / Math.abs(base)) * 100
}

import { apiFetch, type ApiErrorReason } from "@/lib/api"

export interface GroupPeriod {
  netSales: number
  grossProfit: number
  netProfit: number
}

export interface GroupOverviewMetrics {
  mtd: GroupPeriod
  /** Since the start of each company's own fiscal year. */
  ytd: GroupPeriod
  ttm: GroupPeriod
}

export interface GroupConsolidatedMetrics extends GroupPeriod {
  totalAssets: number
  equity: number
  cash: number
}

export interface GroupCompany<T> {
  organizationId: number
  name: string
  current: T
  prior: T
}

/** An organization whose figures could not be read; left out of every total. */
export interface GroupExclusion {
  organizationId: number
  name: string
  reason: ApiErrorReason
}

export interface GroupReport<T> {
  companies: GroupCompany<T>[]
  total: { current: T; prior: T }
  excluded: GroupExclusion[]
  warnings: string[]
  notes: string[]
}

export interface GroupOverview extends GroupReport<GroupOverviewMetrics> {
  asOfDate: string
}

export interface GroupConsolidated extends GroupReport<GroupConsolidatedMetrics> {
  fromDate: string
  toDate: string
}

export async function getGroupOverview(
  asOfDate: string
): Promise<GroupOverview> {
  return apiFetch(`/group/overview?${new URLSearchParams({ asOfDate })}`)
}

export async function getGroupConsolidated(
  fromDate: string,
  toDate: string
): Promise<GroupConsolidated> {
  return apiFetch(
    `/group/consolidated?${new URLSearchParams({ fromDate, toDate })}`
  )
}

"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

interface ReportNavigation {
  /** Merges the given values into the URL; null or "" removes a key. */
  setParams: (changes: Record<string, string | null>) => void
  refresh: () => void
  isPending: boolean
}

const ReportNavigationContext = React.createContext<ReportNavigation | null>(
  null
)

/** All report state lives in the URL, so every view is shareable and reloadable. */
export function ReportNavigationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()

  const value = React.useMemo<ReportNavigation>(
    () => ({
      isPending,
      setParams(changes) {
        const params = new URLSearchParams(searchParams)
        for (const [key, next] of Object.entries(changes)) {
          if (next) params.set(key, next)
          else params.delete(key)
        }
        startTransition(() => {
          router.replace(`${pathname}?${params}`, { scroll: false })
        })
      },
      refresh() {
        startTransition(() => router.refresh())
      },
    }),
    [isPending, pathname, router, searchParams]
  )

  return (
    <ReportNavigationContext value={value}>{children}</ReportNavigationContext>
  )
}

export function useReportNavigation(): ReportNavigation {
  const value = React.useContext(ReportNavigationContext)
  if (!value) {
    throw new Error(
      "useReportNavigation must be used within ReportNavigationProvider"
    )
  }
  return value
}

/** Keeps the previous figures on screen, dimmed, while new ones load. */
export function ReportContent({ children }: { children: React.ReactNode }) {
  const { isPending } = useReportNavigation()
  return (
    <div
      aria-busy={isPending}
      className={cn(
        "flex flex-col gap-4 transition-opacity",
        isPending && "pointer-events-none opacity-50"
      )}
    >
      {children}
    </div>
  )
}

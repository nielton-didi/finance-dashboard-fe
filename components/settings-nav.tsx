"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { orgPath } from "@/lib/org-routes"
import { settingsNav } from "@/config/settings-nav"

export function SettingsNav() {
  const pathname = usePathname()
  const { orgId } = useParams<{ orgId: string }>()

  return (
    <nav className="flex flex-col gap-1">
      {settingsNav.map((item) => {
        const href = orgPath(orgId, item.url)
        const active = pathname === href || pathname.startsWith(`${href}/`)

        return (
          <Link
            key={item.url}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-muted text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

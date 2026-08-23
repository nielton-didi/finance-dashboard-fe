"use client"

import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2Icon, ChevronsUpDownIcon } from "lucide-react"
import type { Organization } from "@/lib/organizations"
import { cn } from "@/lib/utils"

function DbStatusDot({ configured }: { configured: boolean }) {
  return (
    <span
      className={cn(
        "size-2 shrink-0 rounded-full",
        configured ? "bg-emerald-500" : "bg-muted-foreground/30"
      )}
      title={
        configured
          ? "Autocount database connected"
          : "Autocount database not configured"
      }
    />
  )
}

export function OrgSwitcher({
  organizations,
  dbConfigured,
}: {
  organizations: Organization[]
  dbConfigured?: Record<number, boolean>
}) {
  const { orgId } = useParams<{ orgId: string }>()
  const pathname = usePathname()
  const router = useRouter()

  const activeOrg =
    organizations.find((org) => String(org.id) === orgId) ?? organizations[0]

  if (!activeOrg) {
    return null
  }

  function handleSelect(nextOrgId: number) {
    const subPath = pathname.replace(`/organizations/${orgId}`, "")
    router.push(`/organizations/${nextOrgId}${subPath}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="gap-1.5 px-2 font-medium" />}
      >
        <div className="flex size-6 items-center justify-center rounded bg-primary/10 text-primary">
          <Building2Icon className="size-4" />
        </div>
        <span className="max-w-40 truncate">{activeOrg.name}</span>
        {dbConfigured && (
          <DbStatusDot configured={dbConfigured[activeOrg.id] ?? false} />
        )}
        <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Organizations
          </DropdownMenuLabel>
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleSelect(org.id)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border">
                <Building2Icon className="size-3.5" />
              </div>
              <span className="flex-1 truncate">{org.name}</span>
              {dbConfigured && (
                <DbStatusDot configured={dbConfigured[org.id] ?? false} />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/" />} className="gap-2 p-2">
          <div className="font-medium text-muted-foreground">
            All Organizations
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

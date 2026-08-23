"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Building2Icon,
  DatabaseCheckIcon,
  DatabaseXIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Organization } from "@/lib/organizations"

import { AddOrganizationSheet } from "./add-organization-sheet"

export function OrganizationsList({
  organizations,
  isAdmin,
  dbConfigured,
}: {
  organizations: Organization[]
  isAdmin: boolean
  dbConfigured?: Record<number, boolean>
}) {
  const [query, setQuery] = useState("")

  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-xl font-semibold">Your Organizations</h1>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for an organization"
            className="pl-8"
          />
        </div>
        <AddOrganizationSheet />
      </div>
      <div className="flex flex-wrap gap-4">
        {filteredOrgs.map((org) => {
          const configured = dbConfigured?.[org.id] ?? false
          const showMetaRow = Boolean(org.plan) || isAdmin

          return (
            <Card
              key={org.id}
              className="relative w-full gap-3 py-4 ring-1 ring-foreground/10 transition-colors hover:ring-foreground/30 sm:w-72"
            >
              <Link
                href={`/organizations/${org.id}/dashboard`}
                className="absolute inset-0 z-0"
                aria-label={`Open ${org.name}`}
              />

              <div className="pointer-events-none relative z-10 flex flex-col gap-3 px-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Building2Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {org.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {org.registrationNumber ?? `Organization #${org.id}`}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <span
                            className={`pointer-events-auto flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-transparent ${
                              configured
                                ? "border-emerald-500/40 text-emerald-500"
                                : "border-muted-foreground/30 text-muted-foreground"
                            }`}
                          >
                            {configured ? (
                              <DatabaseCheckIcon className="size-5" />
                            ) : (
                              <DatabaseXIcon className="size-5" />
                            )}
                          </span>
                        }
                      />
                      <TooltipContent>
                        {configured
                          ? "Autocount database connected"
                          : "Autocount database not configured"}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {showMetaRow && (
                  <div className="flex items-center justify-between gap-2">
                    {org.plan ? (
                      <span className="rounded-md border px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {org.plan}
                      </span>
                    ) : (
                      <span />
                    )}

                    {isAdmin && (
                      <Link
                        href={`/organizations/${org.id}/settings/organization`}
                        className="pointer-events-auto flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`${org.name} settings`}
                      >
                        <SettingsIcon className="size-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

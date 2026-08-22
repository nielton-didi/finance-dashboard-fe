"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2Icon, PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { organizations } from "@/config/organizations"

export default function OrganizationsPage() {
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
        <Button>
          <PlusIcon />
          New Organization
        </Button>
      </div>
      <div className="flex flex-wrap gap-4">
        {filteredOrgs.map((org) => (
          <Link
            key={org.id}
            href={`/organizations/${org.id}/dashboard`}
            className="w-full sm:w-72"
          >
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Building2Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{org.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {org.plan} Plan
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

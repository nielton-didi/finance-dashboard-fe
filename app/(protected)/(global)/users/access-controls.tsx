"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { grantOrganizationAccess, revokeOrganizationAccess } from "@/lib/actions/users"
import type { Organization } from "@/lib/organizations"

export function AccessControls({
  userId,
  organizations,
}: {
  userId: number
  organizations: Organization[]
}) {
  const router = useRouter()
  const [orgId, setOrgId] = useState("")
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleGrant() {
    if (!orgId) return
    setPending(true)
    setMessage(null)
    const result = await grantOrganizationAccess(userId, Number(orgId))
    setMessage(
      result.ok ? "Access granted" : (result.message ?? "Failed to grant access")
    )
    setPending(false)
    if (result.ok) router.refresh()
  }

  async function handleRevoke() {
    if (!orgId) return
    setPending(true)
    setMessage(null)
    const result = await revokeOrganizationAccess(userId, Number(orgId))
    setMessage(
      result.ok
        ? "Access revoked"
        : (result.message ?? "Failed to revoke access")
    )
    setPending(false)
    if (result.ok) router.refresh()
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <select
          value={orgId}
          onChange={(event) => setOrgId(event.target.value)}
          className="h-7 rounded-md border border-input bg-transparent px-1.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <option value="">Select org…</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending || !orgId}
          onClick={handleGrant}
        >
          Grant
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={pending || !orgId}
          onClick={handleRevoke}
        >
          Revoke
        </Button>
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  )
}

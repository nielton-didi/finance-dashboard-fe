"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  grantOrganizationAccess,
  revokeOrganizationAccess,
} from "@/lib/actions/users"
import type { Organization } from "@/lib/organizations"
import type { UserRole } from "@/lib/users"

export function OrganizationAssignmentCard({
  userId,
  userRole,
  organizations,
  grantedOrganizations,
}: {
  userId: number
  userRole: UserRole
  organizations: Organization[]
  grantedOrganizations: Organization[]
}) {
  const router = useRouter()
  const [orgId, setOrgId] = useState("")
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const grantedIds = new Set(grantedOrganizations.map((org) => org.id))
  const availableOrganizations = organizations.filter(
    (org) => !grantedIds.has(org.id)
  )

  async function handleGrant() {
    if (!orgId) return
    setPending(true)
    setMessage(null)
    const result = await grantOrganizationAccess(userId, Number(orgId))
    if (result.ok) {
      setOrgId("")
      router.refresh()
    } else {
      setMessage(result.message ?? "Failed to grant access")
    }
    setPending(false)
  }

  async function handleRevoke(organizationId: number) {
    setPending(true)
    setMessage(null)
    const result = await revokeOrganizationAccess(userId, organizationId)
    if (result.ok) {
      router.refresh()
    } else {
      setMessage(result.message ?? "Failed to revoke access")
    }
    setPending(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Assignment</CardTitle>
        <CardDescription>
          Which organizations this user can access.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {userRole === "admin" ? (
          <p className="text-sm text-muted-foreground">
            Admins have access to every organization automatically —
            individual assignment isn&apos;t needed.
          </p>
        ) : (
          <>
            {message && (
              <p className="text-sm text-destructive" role="alert">
                {message}
              </p>
            )}
            {grantedOrganizations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This user doesn&apos;t have access to any organization yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {grantedOrganizations.map((org) => (
                  <li
                    key={org.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    {org.name}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={pending}
                      onClick={() => handleRevoke(org.id)}
                    >
                      Revoke
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {availableOrganizations.length > 0 && (
              <div className="flex items-center gap-1.5 border-t border-border pt-4">
                <select
                  value={orgId}
                  onChange={(event) => setOrgId(event.target.value)}
                  className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  <option value="">Select organization…</option>
                  {availableOrganizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending || !orgId}
                  onClick={handleGrant}
                >
                  Grant Access
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

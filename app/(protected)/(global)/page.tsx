import { getCurrentUser } from "@/lib/auth"
import { getAutocountSettings } from "@/lib/autocount-settings"
import { getOrganizations } from "@/lib/organizations"

import { OrganizationsList } from "./organizations-list"

export default async function OrganizationsPage() {
  const [organizations, user] = await Promise.all([
    getOrganizations(),
    getCurrentUser(),
  ])

  const isAdmin = user?.role === "admin"

  const dbConfigured = isAdmin
    ? (Object.fromEntries(
        await Promise.all(
          organizations.map(
            async (org) =>
              [org.id, (await getAutocountSettings(org.id)) !== null] as const
          )
        )
      ) as Record<number, boolean>)
    : undefined

  return (
    <OrganizationsList
      organizations={organizations}
      isAdmin={isAdmin}
      dbConfigured={dbConfigured}
    />
  )
}

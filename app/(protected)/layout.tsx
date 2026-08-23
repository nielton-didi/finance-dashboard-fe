import { redirect } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { getAutocountSettings } from "@/lib/autocount-settings"
import { getCurrentUser } from "@/lib/auth"
import { getOrganizations } from "@/lib/organizations"
import { getSidebarDefaultOpen } from "@/lib/sidebar-cookie"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [defaultOpen, user] = await Promise.all([
    getSidebarDefaultOpen(),
    getCurrentUser(),
  ])

  if (!user) {
    redirect("/login")
  }

  const organizations = await getOrganizations()

  const isAdmin = user.role === "admin"
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
    <AppShell
      defaultOpen={defaultOpen}
      user={{ name: user.fullName, email: user.email, avatar: "" }}
      role={user.role}
      organizations={organizations}
      dbConfigured={dbConfigured}
    >
      {children}
    </AppShell>
  )
}

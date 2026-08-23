import { redirect } from "next/navigation"

import { AppShell } from "@/components/app-shell"
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

  return (
    <AppShell
      defaultOpen={defaultOpen}
      user={{ name: user.fullName, email: user.email, avatar: "" }}
      role={user.role}
      organizations={organizations}
    >
      {children}
    </AppShell>
  )
}

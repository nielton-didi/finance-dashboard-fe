import { redirect } from "next/navigation"

import { SettingsNav } from "@/components/settings-nav"
import { getCurrentUser } from "@/lib/auth"

export default async function SettingsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ orgId: string }>
}>) {
  const [user, { orgId }] = await Promise.all([getCurrentUser(), params])

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect(`/organizations/${orgId}/dashboard`)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 md:flex-row">
      <aside className="md:w-48 md:shrink-0">
        <SettingsNav />
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  )
}

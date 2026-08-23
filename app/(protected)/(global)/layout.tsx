import { redirect } from "next/navigation"

import { GlobalSidebar } from "@/components/global-sidebar"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { getSidebarDefaultOpen } from "@/lib/sidebar-cookie"

export default async function GlobalLayout({
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

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <GlobalSidebar
        user={{ name: user.fullName, email: user.email, avatar: "" }}
        role={user.role}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
          <PageBreadcrumb />
          <div className="flex justify-end px-4">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 justify-center p-4 pt-10">
          <div className="flex w-full max-w-6xl flex-col gap-4">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

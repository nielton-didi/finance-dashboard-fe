"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Building2Icon, ShieldUserIcon, UsersIcon } from "lucide-react"

import { NavGroup } from "@/components/nav-group"
import { NavUser } from "@/components/nav-user"
import { OrgSwitcher } from "@/components/org-switcher"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SidebarBrand } from "@/components/sidebar-brand"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { navGroups } from "@/config/nav"
import type { Organization } from "@/lib/organizations"

const globalItems = [
  { title: "Organizations", url: "/", icon: Building2Icon, adminOnly: false },
  { title: "Users", url: "/users", icon: UsersIcon, adminOnly: true },
  { title: "Account", url: "/account", icon: ShieldUserIcon, adminOnly: false },
]

function isItemActive(pathname: string, url: string) {
  if (url === "/") return pathname === "/"
  return pathname === url || pathname.startsWith(`${url}/`)
}

export function AppShell({
  defaultOpen,
  user,
  role,
  organizations,
  children,
}: {
  defaultOpen: boolean
  user: { name: string; email: string; avatar: string }
  role: "admin" | "staff"
  organizations: Organization[]
  children: React.ReactNode
}) {
  const { orgId } = useParams<{ orgId?: string }>()
  const pathname = usePathname()
  const inOrg = Boolean(orgId)

  const visibleGlobalItems = globalItems.filter(
    (item) => !item.adminOnly || role === "admin"
  )
  const visibleNavGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.adminOnly || role === "admin"),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon">
        <SidebarBrand />
        <SidebarContent>
          {inOrg ? (
            visibleNavGroups.map((group) => (
              <NavGroup key={group.label} {...group} />
            ))
          ) : (
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarMenu>
                {visibleGlobalItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isItemActive(pathname, item.url)}
                      render={<Link href={item.url} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {inOrg && <OrgSwitcher organizations={organizations} />}
          </div>
          <PageBreadcrumb />
          <div className="flex justify-end px-4">
            <ThemeToggle />
          </div>
        </header>
        {inOrg ? (
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        ) : (
          <main className="flex flex-1 justify-center p-4 pt-10">
            <div className="flex w-full max-w-6xl flex-col gap-4">
              {children}
            </div>
          </main>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2Icon, ShieldUserIcon, UsersIcon } from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { SidebarBrand } from "@/components/sidebar-brand"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const items = [
  { title: "Organizations", url: "/", icon: Building2Icon, adminOnly: false },
  { title: "Users", url: "/users", icon: UsersIcon, adminOnly: true },
  { title: "Account", url: "/account", icon: ShieldUserIcon, adminOnly: false },
]

function isItemActive(pathname: string, url: string) {
  if (url === "/") return pathname === "/"
  return pathname === url || pathname.startsWith(`${url}/`)
}

export function GlobalSidebar({
  user,
  role,
}: {
  user: { name: string; email: string; avatar: string }
  role: "admin" | "staff"
}) {
  const pathname = usePathname()
  const visibleItems = items.filter((item) => !item.adminOnly || role === "admin")

  return (
    <Sidebar collapsible="icon">
      <SidebarBrand />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {visibleItems.map((item) => (
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

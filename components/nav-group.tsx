"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { orgPath } from "@/lib/org-routes"
import type { NavGroup as NavGroupData, NavItem } from "@/config/nav"

function isUrlActive(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`)
}

export function NavGroup({ label, items }: NavGroupData) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavMenuItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavMenuItem({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const { orgId } = useParams<{ orgId: string }>()

  if (!item.items?.length) {
    const href = orgPath(orgId, item.url)
    const active = isUrlActive(pathname, href)

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={active}
          render={<Link href={href} />}
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  const childActive = item.items.some((subItem) =>
    isUrlActive(pathname, orgPath(orgId, subItem.url))
  )

  return (
    <Collapsible
      defaultOpen={childActive || item.isActive}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        render={<SidebarMenuButton tooltip={item.title} isActive={childActive} />}
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton
                isActive={isUrlActive(pathname, orgPath(orgId, subItem.url))}
                render={<Link href={orgPath(orgId, subItem.url)} />}
              >
                <span>{subItem.title}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

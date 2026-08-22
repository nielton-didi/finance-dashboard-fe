import {
  LayoutDashboardIcon,
  SettingsIcon,
  TrendingUpDownIcon,
  type LucideIcon,
} from "lucide-react"

export interface NavSubItem {
  title: string
  url: string
}

export interface NavItem {
  title: string
  // Relative to the organization root, e.g. "dashboard" resolves to
  // /organizations/{orgId}/dashboard.
  url: string
  icon?: LucideIcon
  // Default-open state for collapsible items; active highlighting is route-derived.
  isActive?: boolean
  items?: NavSubItem[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: "Platform",
    items: [
      {
        title: "Dashboard",
        url: "dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Profit & Loss Statement",
        url: "profit-loss",
        icon: TrendingUpDownIcon,
      },
      {
        title: "Settings",
        url: "settings",
        icon: SettingsIcon,
      },
    ],
  },
]

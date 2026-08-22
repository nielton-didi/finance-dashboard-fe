import { Building2Icon, DatabaseIcon, HistoryIcon, type LucideIcon } from "lucide-react"

export interface SettingsNavItem {
  title: string
  // Relative to the organization root, e.g. "settings/database" resolves to
  // /organizations/{orgId}/settings/database.
  url: string
  icon: LucideIcon
}

export const settingsNav: SettingsNavItem[] = [
  {
    title: "Organization",
    url: "settings/organization",
    icon: Building2Icon,
  },
  {
    title: "Database",
    url: "settings/database",
    icon: DatabaseIcon,
  },
  {
    title: "Audit Log",
    url: "settings/audit-log",
    icon: HistoryIcon,
  },
]

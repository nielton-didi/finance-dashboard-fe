import { navGroups } from "@/config/nav"
import { settingsNav } from "@/config/settings-nav"

export function orgPath(orgId: string, relativePath: string) {
  return `/organizations/${orgId}/${relativePath}`
}

export const orgLabelByPath = new Map<string, string>()

for (const group of navGroups) {
  for (const item of group.items) {
    orgLabelByPath.set(item.url, item.title)
    item.items?.forEach((subItem) =>
      orgLabelByPath.set(subItem.url, subItem.title)
    )
  }
}

for (const item of settingsNav) {
  orgLabelByPath.set(item.url, item.title)
}

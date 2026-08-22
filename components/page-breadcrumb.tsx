"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { orgLabelByPath, orgPath } from "@/lib/org-routes"

const globalLabelByUrl = new Map<string, string>([
  ["/users", "Users"],
  ["/account", "Profile & Security"],
])

function humanize(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getOrgCrumbs(orgId: string, remainder: string[]) {
  const segments = remainder.length === 0 ? ["dashboard"] : remainder

  return segments.map((segment, index) => {
    const relative = segments.slice(0, index + 1).join("/")
    return {
      url: orgPath(orgId, relative),
      label: orgLabelByPath.get(relative) ?? humanize(segment),
    }
  })
}

function getGlobalCrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)

  return segments.map((segment, index) => {
    const url = "/" + segments.slice(0, index + 1).join("/")
    return { url, label: globalLabelByUrl.get(url) ?? humanize(segment) }
  })
}

function getCrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)

  if (segments[0] === "organizations" && segments[1]) {
    return getOrgCrumbs(segments[1], segments.slice(2))
  }

  return getGlobalCrumbs(pathname)
}

export function PageBreadcrumb() {
  const pathname = usePathname()
  const crumbs = getCrumbs(pathname)

  if (crumbs.length === 0) {
    // Render an empty grid item (rather than null) so the header's
    // grid-cols-[1fr_auto_1fr] layout keeps ThemeToggle in the last track.
    return <div />
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <Fragment key={crumb.url}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-medium">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={crumb.url} />}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

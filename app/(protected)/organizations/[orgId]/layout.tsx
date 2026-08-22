import { AppSidebar } from "@/components/app-sidebar"
import { OrgSwitcher } from "@/components/org-switcher"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getSidebarDefaultOpen } from "@/lib/sidebar-cookie"

export default async function OrganizationLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const defaultOpen = await getSidebarDefaultOpen()

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <OrgSwitcher />
          </div>
          <PageBreadcrumb />
          <div className="flex justify-end px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

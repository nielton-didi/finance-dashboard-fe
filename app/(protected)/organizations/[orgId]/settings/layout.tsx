import { SettingsNav } from "@/components/settings-nav"

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-1 flex-col gap-8 md:flex-row">
      <aside className="md:w-48 md:shrink-0">
        <SettingsNav />
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  )
}

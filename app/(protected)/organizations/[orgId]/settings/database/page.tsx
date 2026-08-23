import { getAutocountSettings } from "@/lib/autocount-settings"

import { DatabaseForm } from "./database-form"

export default async function DatabaseSettingsPage({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params
  const settings = await getAutocountSettings(Number(orgId))

  return <DatabaseForm orgId={Number(orgId)} settings={settings} />
}

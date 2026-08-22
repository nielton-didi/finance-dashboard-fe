import { redirect } from "next/navigation"

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params

  redirect(`/organizations/${orgId}/settings/organization`)
}

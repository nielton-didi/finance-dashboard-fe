import { getOrganization } from "@/lib/organizations"

import { OrganizationForm } from "./organization-form"

export default async function OrganizationSettingsPage({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params
  const organization = await getOrganization(Number(orgId))

  return <OrganizationForm orgId={Number(orgId)} organization={organization} />
}

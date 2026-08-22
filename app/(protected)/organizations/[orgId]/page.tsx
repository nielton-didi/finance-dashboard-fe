import { redirect } from "next/navigation"

export default async function OrganizationRootPage({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params

  redirect(`/organizations/${orgId}/dashboard`)
}

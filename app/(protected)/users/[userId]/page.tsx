import { notFound, redirect } from "next/navigation"

import { ApiError } from "@/lib/api"
import { getCurrentUser } from "@/lib/auth"
import { getOrganizations } from "@/lib/organizations"
import { getUser, getUserOrganizations } from "@/lib/users"

import { BackToUsersLink } from "../back-to-users-link"

import { OrganizationAssignmentCard } from "./organization-assignment-card"
import { UserInfoCard } from "./user-info-card"

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  if (currentUser.role !== "admin") {
    redirect("/")
  }

  const { userId } = await params
  const id = Number(userId)

  let user
  try {
    user = await getUser(id)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      notFound()
    }
    throw error
  }

  const [organizations, grantedOrganizations] = await Promise.all([
    getOrganizations(),
    getUserOrganizations(id),
  ])

  return (
    <div className="flex flex-col gap-4">
      <BackToUsersLink />
      <UserInfoCard user={user} isSelf={user.id === currentUser.sub} />
      <OrganizationAssignmentCard
        userId={user.id}
        userRole={user.role}
        organizations={organizations}
        grantedOrganizations={grantedOrganizations}
      />
    </div>
  )
}

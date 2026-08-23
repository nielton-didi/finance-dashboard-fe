import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"
import { getOrganizations } from "@/lib/organizations"
import { getUsers } from "@/lib/users"

import { UsersTable } from "./users-table"

export default async function UsersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/")
  }

  const [users, organizations] = await Promise.all([
    getUsers(),
    getOrganizations(),
  ])

  return <UsersTable users={users} organizations={organizations} />
}

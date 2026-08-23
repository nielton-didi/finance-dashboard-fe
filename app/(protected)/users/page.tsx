import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"
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

  const users = await getUsers()

  return <UsersTable users={users} currentUserId={user.sub} />
}

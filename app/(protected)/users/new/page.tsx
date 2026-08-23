import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"

import { BackToUsersLink } from "../back-to-users-link"
import { AddUserForm } from "./add-user-form"

export default async function NewUserPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex flex-col gap-4">
      <BackToUsersLink />
      <AddUserForm />
    </div>
  )
}

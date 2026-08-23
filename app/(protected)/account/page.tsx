import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"

import { ProfileForm } from "./profile-form"
import { SecurityForm } from "./security-form"

export default async function AccountSettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileForm user={user} />
      <SecurityForm />
    </div>
  )
}

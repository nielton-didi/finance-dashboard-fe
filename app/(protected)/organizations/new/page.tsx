import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"

import { AddOrganizationForm } from "./add-organization-form"
import { BackToOrganizationsLink } from "./back-to-organizations-link"

export default async function NewOrganizationPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex flex-col gap-4">
      <BackToOrganizationsLink />
      <AddOrganizationForm />
    </div>
  )
}

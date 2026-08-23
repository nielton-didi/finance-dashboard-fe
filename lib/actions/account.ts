"use server"

import { revalidatePath } from "next/cache"

import { type ActionResult, apiFetch, runAction } from "@/lib/api"
import type { User } from "@/lib/users"

export interface UpdateProfileInput {
  fullName?: string
  phone?: string
}

export async function updateProfile(
  input: UpdateProfileInput
): Promise<ActionResult<User>> {
  const result = await runAction(() =>
    apiFetch<User>("/account", {
      method: "PATCH",
      body: JSON.stringify(input),
    })
  )

  if (result.ok) {
    revalidatePath("/account")
  }

  return result
}

export interface UpdatePasswordInput {
  currentPassword: string
  newPassword: string
}

export async function updatePassword(
  input: UpdatePasswordInput
): Promise<ActionResult<void>> {
  return runAction(() =>
    apiFetch<void>("/account/password", {
      method: "PATCH",
      body: JSON.stringify(input),
    })
  )
}

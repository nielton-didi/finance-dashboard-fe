"use server"

import { revalidatePath } from "next/cache"

import { type ActionResult, apiFetch, runAction } from "@/lib/api"
import type { User, UserRole } from "@/lib/users"

export interface CreateUserInput {
  fullName: string
  email: string
  phone?: string
  password: string
  role: UserRole
}

export async function createUser(
  input: CreateUserInput
): Promise<ActionResult<User>> {
  const result = await runAction(() =>
    apiFetch<User>("/users", {
      method: "POST",
      body: JSON.stringify(input),
    })
  )

  if (result.ok) {
    revalidatePath("/users")
  }

  return result
}

export interface UpdateUserInput {
  fullName?: string
  phone?: string
  role?: UserRole
  status?: "active" | "invited"
}

export async function updateUser(
  userId: number,
  input: UpdateUserInput
): Promise<ActionResult<User>> {
  const result = await runAction(() =>
    apiFetch<User>(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    })
  )

  if (result.ok) {
    revalidatePath("/users")
  }

  return result
}

export async function grantOrganizationAccess(
  userId: number,
  organizationId: number
): Promise<ActionResult<void>> {
  const result = await runAction(() =>
    apiFetch<void>(`/users/${userId}/organizations`, {
      method: "POST",
      body: JSON.stringify({ organizationId }),
    })
  )

  if (result.ok) {
    revalidatePath("/users")
  }

  return result
}

export async function revokeOrganizationAccess(
  userId: number,
  organizationId: number
): Promise<ActionResult<void>> {
  const result = await runAction(() =>
    apiFetch<void>(`/users/${userId}/organizations/${organizationId}`, {
      method: "DELETE",
    })
  )

  if (result.ok) {
    revalidatePath("/users")
  }

  return result
}

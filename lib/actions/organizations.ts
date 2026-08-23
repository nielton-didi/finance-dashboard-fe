"use server"

import { revalidatePath } from "next/cache"

import { type ActionResult, apiFetch, runAction } from "@/lib/api"
import type { Organization } from "@/lib/organizations"

export interface CreateOrganizationInput {
  name: string
  registrationNumber?: string
  plan?: string
}

export async function createOrganization(
  input: CreateOrganizationInput
): Promise<ActionResult<Organization>> {
  const result = await runAction(() =>
    apiFetch<Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify(input),
    })
  )

  if (result.ok) {
    revalidatePath("/")
  }

  return result
}

export interface UpdateOrganizationInput {
  name?: string
  registrationNumber?: string
  plan?: string
}

export async function updateOrganization(
  orgId: number,
  input: UpdateOrganizationInput
): Promise<ActionResult<Organization>> {
  const result = await runAction(() =>
    apiFetch<Organization>(`/organizations/${orgId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    })
  )

  if (result.ok) {
    revalidatePath(`/organizations/${orgId}/settings/organization`)
  }

  return result
}

export async function deleteOrganization(
  orgId: number
): Promise<ActionResult<void>> {
  const result = await runAction(() =>
    apiFetch<void>(`/organizations/${orgId}`, {
      method: "DELETE",
    })
  )

  if (result.ok) {
    revalidatePath("/")
  }

  return result
}

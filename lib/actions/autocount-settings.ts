"use server"

import { revalidatePath } from "next/cache"

import { type ActionResult, apiFetch, runAction } from "@/lib/api"
import type { MaskedAutocountCredential } from "@/lib/autocount-settings"

export interface UpsertAutocountSettingsInput {
  host: string
  port: number
  databaseName: string
  username: string
  password: string
}

export async function updateAutocountSettings(
  orgId: number,
  input: UpsertAutocountSettingsInput
): Promise<ActionResult<MaskedAutocountCredential>> {
  const result = await runAction(() =>
    apiFetch<MaskedAutocountCredential>(
      `/organizations/${orgId}/settings/database`,
      {
        method: "PUT",
        body: JSON.stringify(input),
      }
    )
  )

  if (result.ok) {
    revalidatePath(`/organizations/${orgId}/settings/database`)
  }

  return result
}

export async function testAutocountConnection(
  orgId: number
): Promise<ActionResult<{ ok: true }>> {
  return runAction(() =>
    apiFetch<{ ok: true }>(
      `/organizations/${orgId}/settings/database/test-connection`,
      { method: "POST" }
    )
  )
}

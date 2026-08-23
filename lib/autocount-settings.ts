import { ApiError, apiFetch } from "@/lib/api"

export interface MaskedAutocountCredential {
  host: string
  port: number
  databaseName: string
  username: string
  hasPassword: true
}

export async function getAutocountSettings(
  orgId: number
): Promise<MaskedAutocountCredential | null> {
  try {
    return await apiFetch<MaskedAutocountCredential>(
      `/organizations/${orgId}/settings/database`
    )
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null
    }
    throw error
  }
}

import { cache } from "react"

import { apiFetch } from "@/lib/api"

export interface Organization {
  id: number
  name: string
  registrationNumber: string | null
  plan: string | null
  createdAt: string
  updatedAt: string
}

export const getOrganizations = cache(async (): Promise<Organization[]> => {
  return apiFetch<Organization[]>("/organizations")
})

export const getOrganization = cache(
  async (orgId: number): Promise<Organization> => {
    return apiFetch<Organization>(`/organizations/${orgId}`)
  }
)

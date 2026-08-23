import { apiFetch } from "@/lib/api"
import type { Organization } from "@/lib/organizations"

export type UserRole = "admin" | "staff"
export type UserStatus = "active" | "invited"

export interface User {
  id: number
  fullName: string
  email: string
  phone: string | null
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export async function getUsers(): Promise<User[]> {
  return apiFetch<User[]>("/users")
}

export async function getUser(userId: number): Promise<User> {
  return apiFetch<User>(`/users/${userId}`)
}

export async function getUserOrganizations(
  userId: number
): Promise<Organization[]> {
  return apiFetch<Organization[]>(`/users/${userId}/organizations`)
}

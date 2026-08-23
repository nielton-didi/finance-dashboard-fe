import { apiFetch } from "@/lib/api"

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

import { cache } from "react"
import { cookies } from "next/headers"

import { apiFetch, ApiError } from "@/lib/api"
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-constants"

export { ACCESS_TOKEN_COOKIE }

export interface CurrentUser {
  sub: number
  email: string
  fullName: string
  role: "admin" | "staff"
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies()
  if (!cookieStore.get(ACCESS_TOKEN_COOKIE)?.value) {
    return null
  }

  try {
    return await apiFetch<CurrentUser>("/auth/me")
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return null
    }
    throw error
  }
})

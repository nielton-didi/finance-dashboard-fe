import { cookies } from "next/headers"

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-constants"

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:3001"

export type ApiErrorReason =
  | "NOT_CONFIGURED"
  | "AUTH_FAILED"
  | "UNREACHABLE"
  | "UNKNOWN"

export class ApiError extends Error {
  statusCode: number
  reason?: ApiErrorReason

  constructor(statusCode: number, message: string, reason?: ApiErrorReason) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
    this.reason = reason
  }
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const authHeader = await getAuthHeader()

  const res = await fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...init.headers,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : (body?.message ?? res.statusText)
    throw new ApiError(res.status, message, body?.reason)
  }

  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export interface ActionResult<T = undefined> {
  ok: boolean
  message?: string
  data?: T
}

export async function runAction<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn()
    return { ok: true, data }
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.message }
    }
    throw error
  }
}

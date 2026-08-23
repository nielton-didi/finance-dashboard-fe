import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { ApiError, apiFetch } from "@/lib/api"
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-constants"

interface LoginResponse {
  accessToken: string
}

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    const { accessToken } = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    const cookieStore = await cookies()
    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      )
    }
    throw error
  }
}

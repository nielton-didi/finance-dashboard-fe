import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-constants"

export function middleware(request: NextRequest) {
  const hasToken = Boolean(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value)
  const isLoginPage = request.nextUrl.pathname.startsWith("/login")

  if (!hasToken && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (hasToken && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
}

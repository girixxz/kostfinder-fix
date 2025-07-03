import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Protect kost detail pages
  if (request.nextUrl.pathname.startsWith("/kost/")) {
    // Check if user has auth token
    const token =
      request.cookies.get("auth-token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    // If no token found, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/kost/:path*", "/dashboard/:path*", "/favorites/:path*", "/admin/:path*"],
}

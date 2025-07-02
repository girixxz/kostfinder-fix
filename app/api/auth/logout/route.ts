import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      // Verify the token is valid
      jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")

      // In a production app, you might want to:
      // 1. Add the token to a blacklist/revoked tokens list
      // 2. Store revoked tokens in Redis or database
      // 3. Set token expiry to current time

      return NextResponse.json({
        message: "Logged out successfully",
      })
    } catch (error) {
      // Token is invalid, but that's okay for logout
      return NextResponse.json({
        message: "Logged out successfully",
      })
    }
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({
      message: "Logged out successfully",
    })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth-middleware"

// GET - Check if kost is in user's favorites
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ isFavorite: false })
    }

    const userDoc = await User.findById(user._id)
    const isFavorite = userDoc?.favorites?.includes(params.id) || false

    return NextResponse.json({ isFavorite })
  } catch (error) {
    console.error("Error checking favorite:", error)
    return NextResponse.json({ isFavorite: false })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Rating from "@/models/Rating"
import { verifyToken } from "@/lib/auth-middleware"

// GET - Check if user has rated this kost
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ hasRated: false, rating: null })
    }

    const rating = await Rating.findOne({ user: user._id, kost: params.id })

    return NextResponse.json({
      hasRated: !!rating,
      rating: rating
        ? {
            _id: rating._id,
            rating: rating.rating,
            review: rating.review,
            createdAt: rating.createdAt,
          }
        : null,
    })
  } catch (error) {
    console.error("Error checking rating:", error)
    return NextResponse.json({ hasRated: false, rating: null })
  }
}

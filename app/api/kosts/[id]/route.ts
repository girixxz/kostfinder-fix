import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Kost from "@/models/Kost"
import Rating from "@/models/Rating"

// GET - Public endpoint to fetch single kost with ratings
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const kost = await Kost.findById(params.id)
    if (!kost) {
      return NextResponse.json({ error: "Kost not found" }, { status: 404 })
    }

    // Get ratings with user details
    const ratings = await Rating.find({ kost: params.id }).populate("user", "name").sort({ createdAt: -1 })

    const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0

    return NextResponse.json({
      ...kost.toObject(),
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: ratings.length,
      ratings: ratings.map((rating) => ({
        _id: rating._id,
        rating: rating.rating,
        review: rating.review,
        createdAt: rating.createdAt,
        user: {
          name: rating.user.name,
        },
      })),
    })
  } catch (error) {
    console.error("Error fetching kost:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Rating from "@/models/Rating"
import Kost from "@/models/Kost"
import { requireAuth } from "@/lib/auth-middleware"

// POST - Add rating (requires authentication)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const user = await requireAuth(request)
    const { rating, review } = await request.json()

    // Validate kost exists
    const kost = await Kost.findById(params.id)
    if (!kost) {
      return NextResponse.json({ error: "Kost not found" }, { status: 404 })
    }

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    if (!review || review.trim().length < 10) {
      return NextResponse.json({ error: "Review must be at least 10 characters" }, { status: 400 })
    }

    // Check if user already rated this kost
    const existingRating = await Rating.findOne({ user: user._id, kost: params.id })
    if (existingRating) {
      return NextResponse.json({ error: "You have already rated this kost" }, { status: 400 })
    }

    // Create new rating
    const newRating = new Rating({
      user: user._id,
      kost: params.id,
      rating,
      review: review.trim(),
    })

    await newRating.save()
    await newRating.populate("user", "name")

    return NextResponse.json({
      _id: newRating._id,
      rating: newRating.rating,
      review: newRating.review,
      createdAt: newRating.createdAt,
      user: {
        name: newRating.user.name,
      },
    })
  } catch (error) {
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    console.error("Error adding rating:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET - Get ratings for a kost (public)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const ratings = await Rating.find({ kost: params.id }).populate("user", "name").sort({ createdAt: -1 })

    return NextResponse.json(
      ratings.map((rating) => ({
        _id: rating._id,
        rating: rating.rating,
        review: rating.review,
        createdAt: rating.createdAt,
        user: {
          name: rating.user.name,
        },
      })),
    )
  } catch (error) {
    console.error("Error fetching ratings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

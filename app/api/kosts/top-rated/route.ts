import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Kost from "@/models/Kost"
import Rating from "@/models/Rating"

// GET - Fetch top rated kosts
export async function GET() {
  try {
    await dbConnect()

    // Aggregate ratings: hitung total review & average rating
    const ratings = await Rating.aggregate([
      {
        $group: {
          _id: "$kost",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $match: {
          averageRating: { $gte: 4 },
          totalReviews: { $gte: 2 },
        },
      },
      {
        $sort: {
          totalReviews: -1,       // Prioritaskan yang paling banyak review
          averageRating: -1,      // Jika sama, prioritaskan rating tinggi
        },
      },
    ])

    const topRatedKosts = await Promise.all(
      ratings.map(async (rating) => {
        const kost = await Kost.findById(rating._id).lean()
        if (!kost) return null

        return {
          _id: kost._id.toString(),
          title: kost.title,
          location: kost.location,
          price: kost.price,
          type: kost.type,
          images: kost.images,
          facilities: kost.facilities,
          averageRating: Math.round(rating.averageRating * 10) / 10,
          totalReviews: rating.totalReviews,
        }
      })
    )

    const validKosts = topRatedKosts.filter(Boolean)

    const response = NextResponse.json({
      kosts: validKosts,
      timestamp: new Date().toISOString(),
    })

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("Error fetching top rated kosts:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch top rated kosts",
        kosts: [],
      },
      { status: 500 }
    )
  }
}

// Force dynamic rendering
export const dynamic = "force-dynamic"
export const revalidate = 0

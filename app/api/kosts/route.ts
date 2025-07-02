import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Kost from "@/models/Kost"
import Rating from "@/models/Rating"

// GET - Public endpoint to fetch kosts with optional filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const facilities = searchParams.get("facilities")?.split(",").filter(Boolean) || []

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { location: { $regex: search, $options: "i" } }]
    }

    if (type && type !== "all") {
      query.type = type
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseInt(minPrice)
      if (maxPrice) query.price.$lte = Number.parseInt(maxPrice)
    }

    if (facilities.length > 0) {
      query.facilities = { $in: facilities }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const kosts = await Kost.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })

    // Get ratings for each kost
    const kostsWithRatings = await Promise.all(
      kosts.map(async (kost) => {
        const ratings = await Rating.find({ kost: kost._id })
        const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0

        return {
          ...kost.toObject(),
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: ratings.length,
        }
      }),
    )

    const total = await Kost.countDocuments(query)

    return NextResponse.json({
      kosts: kostsWithRatings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching kosts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

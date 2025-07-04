import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Kost from "@/models/Kost"
import Rating from "@/models/Rating"

// GET - Fetch all featured kosts (tanpa limit)
export async function GET() {
  try {
    await dbConnect()

    // Ambil semua kost dan urutkan dari terbaru
    const kosts = await Kost.find({}).sort({ createdAt: -1 }).lean()

    // Log jumlah data ke terminal
    console.log("✅ Jumlah kost dari DB:", kosts.length)

    // Ambil rating untuk setiap kost
    const kostsWithRatings = await Promise.all(
      kosts.map(async (kost) => {
        const ratings = await Rating.find({ kost: kost._id }).lean()
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0

        return {
          _id: kost._id.toString(),
          title: kost.title,
          location: kost.location,
          price: kost.price,
          type: kost.type,
          images: kost.images,
          facilities: kost.facilities,
          averageRating: Math.round(averageRating * 10) / 10,
        }
      })
    )

    const response = NextResponse.json({
      kosts: kostsWithRatings,
      timestamp: new Date().toISOString(),
    })

    // Set cache control headers (disable caching)
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("❌ Error fetching featured kosts:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch featured kosts",
        kosts: [],
      },
      { status: 500 }
    )
  }
}

// Force dynamic rendering
export const dynamic = "force-dynamic"
export const revalidate = 0

import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Kost from "@/models/Kost"
import User from "@/models/User"
import jwt from "jsonwebtoken"

// Middleware to verify admin
async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No auth header or invalid format")
      return null
    }

    const token = authHeader.substring(7)
    if (!token) {
      console.log("No token found")
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string }

    await dbConnect()
    const user = await User.findById(decoded.userId)

    if (!user) {
      console.log("User not found")
      return null
    }

    if (user.role !== "admin") {
      console.log("User is not admin:", user.role)
      return null
    }

    return user
  } catch (error) {
    console.error("Admin verification error:", error)
    return null
  }
}

// GET - Fetch all kosts (admin only)
export async function GET(request: NextRequest) {
  try {
    console.log("Admin GET request received")

    const user = await verifyAdmin(request)
    if (!user) {
      console.log("Admin verification failed")
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    console.log("Admin verified, fetching kosts...")

    await dbConnect()
    const kosts = await Kost.find({}).sort({ createdAt: -1 }).lean()

    console.log(`Found ${kosts.length} kosts`)

    // Convert ObjectId to string for JSON serialization
    const serializedKosts = kosts.map((kost) => ({
      ...kost,
      _id: kost._id.toString(),
      createdAt: kost.createdAt?.toISOString(),
      updatedAt: kost.updatedAt?.toISOString(),
    }))

    return NextResponse.json(serializedKosts)
  } catch (error) {
    console.error("Error in admin GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new kost (admin only)
export async function POST(request: NextRequest) {
  try {
    console.log("Admin POST request received")

    const user = await verifyAdmin(request)
    if (!user) {
      console.log("Admin verification failed for POST")
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const kostData = await request.json()
    console.log("Received kost data:", kostData)

    // Validate required fields
    if (!kostData.title || !kostData.location || !kostData.price || !kostData.type) {
      return NextResponse.json({ error: "Missing required fields: title, location, price, type" }, { status: 400 })
    }

    await dbConnect()

    // Set default values if not provided
    const kost = new Kost({
      title: kostData.title,
      location: kostData.location,
      price: Number(kostData.price),
      type: kostData.type,
      description: kostData.description || "Kost description",
      latitude: Number(kostData.latitude) || -6.2088,
      longitude: Number(kostData.longitude) || 106.8456,
      phone: kostData.phone || "081234567890",
      owner_name: kostData.owner_name || "Owner",
      facilities: Array.isArray(kostData.facilities) ? kostData.facilities : [],
      images:
        Array.isArray(kostData.images) && kostData.images.length > 0
          ? kostData.images
          : ["https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Kost+Image"],
    })

    await kost.save()
    console.log("Kost created successfully:", kost._id)

    return NextResponse.json(
      {
        ...kost.toObject(),
        _id: kost._id.toString(),
        createdAt: kost.createdAt?.toISOString(),
        updatedAt: kost.updatedAt?.toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in admin POST:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

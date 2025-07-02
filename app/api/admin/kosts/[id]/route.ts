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
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string }

    await dbConnect()
    const user = await User.findById(decoded.userId)

    if (!user || user.role !== "admin") {
      return null
    }

    return user
  } catch (error) {
    console.error("Admin verification error:", error)
    return null
  }
}

// PUT - Update kost (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const kostData = await request.json()

    await dbConnect()
    const kost = await Kost.findByIdAndUpdate(
      params.id,
      {
        ...kostData,
        price: Number(kostData.price),
        latitude: Number(kostData.latitude) || -6.2088,
        longitude: Number(kostData.longitude) || 106.8456,
      },
      { new: true },
    )

    if (!kost) {
      return NextResponse.json({ error: "Kost not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...kost.toObject(),
      _id: kost._id.toString(),
      createdAt: kost.createdAt?.toISOString(),
      updatedAt: kost.updatedAt?.toISOString(),
    })
  } catch (error) {
    console.error("Error updating kost:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete kost (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const kost = await Kost.findByIdAndDelete(params.id)

    if (!kost) {
      return NextResponse.json({ error: "Kost not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Kost deleted successfully" })
  } catch (error) {
    console.error("Error deleting kost:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

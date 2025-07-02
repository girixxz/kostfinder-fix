import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Kost from "@/models/Kost"
import { requireAuth } from "@/lib/auth-middleware"

// GET - Get user's favorites (requires authentication)
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const user = await requireAuth(request)

    const userWithFavorites = await User.findById(user._id).populate({
      path: "favorites",
      model: "Kost",
    })

    if (!userWithFavorites) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(userWithFavorites.favorites)
  } catch (error) {
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Add to favorites (requires authentication)
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const user = await requireAuth(request)
    const { kostId } = await request.json()

    if (!kostId) {
      return NextResponse.json({ error: "Kost ID is required" }, { status: 400 })
    }

    // Check if kost exists
    const kost = await Kost.findById(kostId)
    if (!kost) {
      return NextResponse.json({ error: "Kost not found" }, { status: 404 })
    }

    // Add to favorites if not already added
    const updatedUser = await User.findByIdAndUpdate(user._id, { $addToSet: { favorites: kostId } }, { new: true })

    return NextResponse.json({ message: "Added to favorites", favorites: updatedUser.favorites })
  } catch (error) {
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    console.error("Error adding to favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Remove from favorites (requires authentication)
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()

    const user = await requireAuth(request)
    const { kostId } = await request.json()

    if (!kostId) {
      return NextResponse.json({ error: "Kost ID is required" }, { status: 400 })
    }

    // Remove from favorites
    const updatedUser = await User.findByIdAndUpdate(user._id, { $pull: { favorites: kostId } }, { new: true })

    return NextResponse.json({ message: "Removed from favorites", favorites: updatedUser.favorites })
  } catch (error) {
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    console.error("Error removing from favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

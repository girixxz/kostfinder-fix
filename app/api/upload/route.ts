import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log("Uploading to Cloudinary...")
    console.log("Cloud name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    console.log("File size:", file.size, "bytes")
    console.log("File type:", file.type)

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

    // Create FormData for Cloudinary upload
    const cloudinaryFormData = new FormData()

    // Convert buffer to Blob for upload
    const blob = new Blob([buffer], { type: file.type })
    cloudinaryFormData.append("file", blob, file.name)

    // Try with kostfinder_preset first
    cloudinaryFormData.append("upload_preset", "kostfinder_preset")
    cloudinaryFormData.append("folder", "kostfinder")

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudinaryFormData,
    })

    console.log("Cloudinary response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Cloudinary upload failed:", errorText)

      // Try with ml_default preset as fallback
      console.log("Trying with ml_default preset...")

      const fallbackFormData = new FormData()
      const fallbackBlob = new Blob([buffer], { type: file.type })
      fallbackFormData.append("file", fallbackBlob, file.name)
      fallbackFormData.append("upload_preset", "ml_default")

      const fallbackResponse = await fetch(cloudinaryUrl, {
        method: "POST",
        body: fallbackFormData,
      })

      if (fallbackResponse.ok) {
        const result = await fallbackResponse.json()
        console.log("Fallback upload successful:", result.secure_url)
        return NextResponse.json({ url: result.secure_url })
      }

      // If both fail, return a working placeholder
      const placeholderUrl = `https://picsum.photos/400/300?random=${Date.now()}`
      console.log("Using placeholder:", placeholderUrl)

      return NextResponse.json({
        url: placeholderUrl,
        message: "Upload failed, using placeholder",
      })
    }

    const result = await response.json()
    console.log("Upload successful:", result.secure_url)
    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    console.error("Upload error:", error)

    // Return a working placeholder on any error
    const placeholderUrl = `https://picsum.photos/400/300?random=${Date.now()}`
    return NextResponse.json({
      url: placeholderUrl,
      message: "Upload failed, using placeholder",
    })
  }
}

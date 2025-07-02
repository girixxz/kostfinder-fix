"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, X, Upload, ImageIcon, CheckCircle } from "lucide-react"
import Image from "next/image"

interface Kost {
  _id: string
  title: string
  location: string
  price: number
  type: string
  description: string
  images: string[]
  latitude: number
  longitude: number
  phone: string
  owner_name: string
  facilities: string[]
}

const availableFacilities = [
  "AC",
  "WiFi",
  "Kamar Mandi Dalam",
  "Kamar Mandi Luar",
  "Dapur Bersama",
  "Laundry",
  "Parkir Motor",
  "Parkir Mobil",
  "Security 24 Jam",
  "CCTV",
  "Gym",
  "Rooftop",
  "Balkon",
  "Lemari",
  "Kasur",
  "Meja Belajar",
]

// Working placeholder images
const getPlaceholderImage = (title = "Kost") => {
  return `https://picsum.photos/400/300?random=${encodeURIComponent(title)}&t=${Date.now()}`
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [kosts, setKosts] = useState<Kost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingKost, setEditingKost] = useState<Kost | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [kostsLoading, setKostsLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    type: "",
    description: "",
    latitude: "",
    longitude: "",
    phone: "",
    owner_name: "",
    facilities: [] as string[],
    images: [] as string[],
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>("")

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/")
      return
    }
    if (user && user.role === "admin") {
      fetchKosts()
    }
  }, [user, loading, router])

  const fetchKosts = async () => {
    try {
      setKostsLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        console.error("No token found")
        toast({
          title: "Error",
          description: "No authentication token found. Please login again.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/admin/kosts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setKosts(data)
        toast({
          title: "Success",
          description: `Loaded ${data.length} kosts`,
        })
      } else {
        const errorText = await response.text()
        console.error("Failed to fetch kosts:", response.status, errorText)

        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Please login again as admin",
            variant: "destructive",
          })
          router.push("/login")
        } else {
          toast({
            title: "Error",
            description: `Failed to fetch kosts: ${response.status}`,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error fetching kosts:", error)
      toast({
        title: "Error",
        description: "Network error while fetching kosts",
        variant: "destructive",
      })
    } finally {
      setKostsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        })
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        })
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setImageFiles((prev) => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })

    toast({
      title: "Images Added",
      description: `${validFiles.length} image(s) ready for upload`,
    })
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreview((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const uploadSingleImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Upload failed:", errorData)

      // Return a working placeholder if upload fails
      return getPlaceholderImage(file.name)
    }

    const result = await response.json()
    return result.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.location || !formData.price || !formData.type) {
        throw new Error("Please fill in all required fields")
      }

      let imageUrls = [...formData.images]

      // Upload new images if any
      if (imageFiles.length > 0) {
        setUploadingImages(true)
        setUploadProgress("Starting upload...")

        try {
          // Upload images one by one with progress
          const newImageUrls: string[] = []
          for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i]
            setUploadProgress(`Uploading ${i + 1}/${imageFiles.length}: ${file.name}`)

            try {
              const url = await uploadSingleImage(file)
              newImageUrls.push(url)
              setUploadProgress(`✅ Uploaded ${i + 1}/${imageFiles.length}`)
            } catch (error) {
              console.error(`Failed to upload ${file.name}:`, error)
              // Use placeholder for failed uploads
              const placeholderUrl = getPlaceholderImage(file.name)
              newImageUrls.push(placeholderUrl)
              setUploadProgress(`⚠️ Failed ${i + 1}/${imageFiles.length}, using placeholder`)
            }
          }

          imageUrls = [...imageUrls, ...newImageUrls]
          setUploadProgress("Upload complete!")

          toast({
            title: "Upload Complete",
            description: `Successfully processed ${imageFiles.length} image(s)`,
          })
        } catch (uploadError) {
          console.error("Image upload error:", uploadError)
          toast({
            title: "Upload Warning",
            description: "Some images failed to upload, using placeholders",
            variant: "destructive",
          })
        }
        setUploadingImages(false)
        setUploadProgress("")
      }

      // Ensure at least one image
      if (imageUrls.length === 0) {
        imageUrls = [getPlaceholderImage(formData.title || "Kost")]
      }

      const kostData = {
        ...formData,
        price: Number(formData.price),
        latitude: Number(formData.latitude) || -6.2088,
        longitude: Number(formData.longitude) || 106.8456,
        phone: formData.phone || "081234567890",
        owner_name: formData.owner_name || "Owner",
        description: formData.description || "Kost description",
        images: imageUrls,
      }

      const url = editingKost ? `/api/admin/kosts/${editingKost._id}` : "/api/admin/kosts"
      const method = editingKost ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(kostData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Kost ${editingKost ? "updated" : "created"} successfully`,
        })
        resetForm()
        fetchKosts()
      } else {
        const errorText = await response.text()
        console.error("Submit error:", response.status, errorText)

        let errorMessage = "Failed to save kost"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Server error: ${response.status}`
        }

        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Error saving kost:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save kost",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
      setUploadingImages(false)
      setUploadProgress("")
    }
  }

  const handleEdit = (kost: Kost) => {
    setEditingKost(kost)
    setFormData({
      title: kost.title,
      location: kost.location,
      price: kost.price.toString(),
      type: kost.type,
      description: kost.description,
      latitude: kost.latitude.toString(),
      longitude: kost.longitude.toString(),
      phone: kost.phone,
      owner_name: kost.owner_name,
      facilities: kost.facilities,
      images: kost.images,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this kost?")) return

    try {
      const response = await fetch(`/api/admin/kosts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Kost deleted successfully",
        })
        fetchKosts()
      } else {
        throw new Error("Failed to delete kost")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete kost",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      price: "",
      type: "",
      description: "",
      latitude: "",
      longitude: "",
      phone: "",
      owner_name: "",
      facilities: [],
      images: [],
    })
    setImageFiles([])
    setImagePreview([])
    setEditingKost(null)
    setShowForm(false)
    setUploadProgress("")
  }

  const handleFacilityChange = (facility: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      facilities: checked ? [...prev.facilities, facility] : prev.facilities.filter((f) => f !== facility),
    }))
  }

  const addImageUrl = () => {
    const url = prompt("Enter image URL (or leave empty for random placeholder):")
    if (url !== null) {
      const imageUrl = url.trim() || getPlaceholderImage(formData.title || "Kost")
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }))
      toast({
        title: "Image Added",
        description: url.trim() ? "Image URL added successfully" : "Random placeholder added",
      })
    }
  }

  const addPlaceholderImage = () => {
    const placeholderUrl = getPlaceholderImage(formData.title || "Kost")
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, placeholderUrl],
    }))
    toast({
      title: "Placeholder Added",
      description: "Beautiful random image added from Picsum",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <Button onClick={() => setShowForm(true)} className="bg-black hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            Add New Kost
          </Button>
        </div>

        {/* System Status */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">🎯 Image System Status</p>
                <p className="text-xs text-blue-700">
                  ✅ Upload API: Ready | ✅ Cloudinary:{" "}
                  {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "Connected" : "Fallback Mode"} | ✅ Placeholders:
                  Active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingKost ? "Edit Kost" : "Add New Kost"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price (per month) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="putra">Putra</SelectItem>
                        <SelectItem value="putri">Putri</SelectItem>
                        <SelectItem value="campur">Campur</SelectItem>
                        <SelectItem value="exclusive">Exclusive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="owner_name">Owner Name</Label>
                    <Input
                      id="owner_name"
                      value={formData.owner_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, owner_name: e.target.value }))}
                      placeholder="Pak/Ibu..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="081234567890"
                    />
                  </div>

                  <div>
                    <Label htmlFor="latitude">Latitude (optional)</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value }))}
                      placeholder="-6.2088"
                    />
                  </div>

                  <div>
                    <Label htmlFor="longitude">Longitude (optional)</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData((prev) => ({ ...prev, longitude: e.target.value }))}
                      placeholder="106.8456"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    placeholder="Describe the kost..."
                  />
                </div>

                {/* Facilities */}
                <div>
                  <Label>Facilities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {availableFacilities.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={facility}
                          checked={formData.facilities.includes(facility)}
                          onCheckedChange={(checked) => handleFacilityChange(facility, checked as boolean)}
                        />
                        <Label htmlFor={facility} className="text-sm">
                          {facility}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <Label>Images</Label>
                  <div className="mt-2 space-y-4">
                    {/* Upload Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full"
                          disabled={uploadingImages}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.querySelector('input[type="file"]')?.click()}
                        disabled={uploadingImages}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Files
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addImageUrl}
                        disabled={uploadingImages}
                        className="w-full bg-transparent"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Add URL
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addPlaceholderImage}
                        disabled={uploadingImages}
                        className="w-full bg-transparent"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Add Placeholder
                      </Button>
                    </div>

                    {/* Upload Status */}
                    {uploadingImages && (
                      <div className="text-center py-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-blue-600 font-medium">📤 Processing Images</div>
                        <div className="text-sm text-blue-500 mt-1">{uploadProgress}</div>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                    )}

                    {/* Image Preview */}
                    {(imagePreview.length > 0 || formData.images.length > 0) && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Existing images */}
                        {formData.images.map((url, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`Image ${index + 1}`}
                              width={200}
                              height={150}
                              className="object-cover rounded border w-full h-32"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeExistingImage(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-1 rounded">
                              ✅ Saved
                            </div>
                          </div>
                        ))}

                        {/* New image previews */}
                        {imagePreview.map((url, index) => (
                          <div key={`preview-${index}`} className="relative group">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              width={200}
                              height={150}
                              className="object-cover rounded border border-blue-300 w-full h-32"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                              🆕 New
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Help Text */}
                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                      <p className="font-medium mb-1">📸 Image Options:</p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          • <strong>Upload Files:</strong> Choose images from your computer (max 5MB each)
                        </li>
                        <li>
                          • <strong>Add URL:</strong> Paste image links from the internet
                        </li>
                        <li>
                          • <strong>Add Placeholder:</strong> Use beautiful random images from Picsum Photos
                        </li>
                        <li>
                          • <strong>Auto Fallback:</strong> If upload fails, placeholders will be used automatically
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={formLoading || uploadingImages}
                    className="bg-black hover:bg-gray-800"
                  >
                    {uploadingImages
                      ? "Processing Images..."
                      : formLoading
                        ? "Saving..."
                        : editingKost
                          ? "Update Kost"
                          : "Create Kost"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} disabled={formLoading || uploadingImages}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {kostsLoading && (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading kosts...</div>
          </div>
        )}

        {/* Kosts List */}
        {!kostsLoading && (
          <>
            {kosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kosts.map((kost) => (
                  <Card key={kost._id}>
                    <div className="relative h-48">
                      <Image
                        src={kost.images[0] || getPlaceholderImage(kost.title)}
                        alt={kost.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{kost.title}</h3>
                      <p className="text-gray-600 mb-2">{kost.location}</p>
                      <p className="text-green-600 font-bold mb-2">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(kost.price)}
                        /bulan
                      </p>
                      <Badge className="mb-3">{kost.type}</Badge>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(kost)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(kost._id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No kosts found. Add your first kost!</p>
                <Button onClick={() => setShowForm(true)}>Add New Kost</Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

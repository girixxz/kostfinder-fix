"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoadingSpinner } from "@/components/loading-spinner"
import { PageTransition } from "@/components/page-transition"
import { FadeIn } from "@/components/fade-in"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Heart, Star, MapPin, Phone, User, MessageSquare, ExternalLink, Lock, LogIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />,
})

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
  averageRating: number
  totalReviews: number
  ratings: Rating[]
}

interface Rating {
  _id: string
  rating: number
  review: string
  createdAt: string
  user: {
    name: string
  }
}

export default function KostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  const [kost, setKost] = useState<Kost | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    review: "",
  })
  const [submittingReview, setSubmittingReview] = useState(false)

  // Redirect jika user belum login setelah auth loading selesai
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Login Required",
        description: "Silakan login terlebih dahulu untuk melihat detail kost",
        variant: "destructive",
      })
      router.push("/login")
      return
    }
  }, [user, authLoading, router, toast])

  useEffect(() => {
    if (params.id && user) {
      fetchKostDetail()
      checkFavoriteStatus()
      checkRatingStatus()
    }
  }, [params.id, user])

  const fetchKostDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/kosts/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setKost(data)
      } else {
        throw new Error(data.error || "Failed to fetch kost")
      }
    } catch (error) {
      console.error("Error fetching kost:", error)
      toast({
        title: "Error",
        description: "Failed to load kost details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/user/check-favorite/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setIsFavorite(data.isFavorite)
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }

  const checkRatingStatus = async () => {
    try {
      const response = await fetch(`/api/user/check-rating/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setHasRated(data.hasRated)
    } catch (error) {
      console.error("Error checking rating status:", error)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add favorites",
        variant: "destructive",
      })
      return
    }

    try {
      const method = isFavorite ? "DELETE" : "POST"
      const response = await fetch("/api/favorites", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ kostId: params.id }),
      })

      if (response.ok) {
        setIsFavorite(!isFavorite)
        toast({
          title: "Success",
          description: isFavorite ? "Removed from favorites" : "Added to favorites",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      })
    }
  }

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to write a review",
        variant: "destructive",
      })
      return
    }

    if (reviewData.review.trim().length < 10) {
      toast({
        title: "Review Too Short",
        description: "Please write at least 10 characters",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmittingReview(true)
      const response = await fetch(`/api/kosts/${params.id}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(reviewData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Review submitted successfully",
        })
        setShowReviewForm(false)
        setHasRated(true)
        fetchKostDetail() // Refresh to show new review
      } else {
        const data = await response.json()
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getWhatsAppLink = (phone: string, kostTitle: string) => {
    const message = `Halo, saya tertarik dengan kost "${kostTitle}". Bisakah saya mendapat informasi lebih lanjut?`
    return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Checking authentication..." />
        </div>
      </div>
    )
  }

  // Show login required message if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
              <p className="text-gray-600 mb-6">Silakan login terlebih dahulu untuk melihat detail kost</p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login Sekarang
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/register">Daftar Akun Baru</Link>
                </Button>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/search">Kembali ke Pencarian</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading kost details..." />
        </div>
      </div>
    )
  }

  if (!kost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kost Not Found</h2>
              <p className="text-gray-600 mb-6">The kost you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link href="/search">Browse Other Kosts</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <FadeIn>
                <Card>
                  <CardContent className="p-0">
                    <div className="relative h-96">
                      <Image
                        src={kost.images[currentImageIndex] || "/placeholder.svg?height=400&width=600"}
                        alt={kost.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      {kost.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {kost.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full ${
                                index === currentImageIndex ? "bg-white" : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {kost.images.length > 1 && (
                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-2">
                          {kost.images.slice(0, 4).map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`relative h-20 rounded-lg overflow-hidden ${
                                index === currentImageIndex ? "ring-2 ring-black" : ""
                              }`}
                            >
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`Image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Kost Info */}
              <FadeIn delay={0.1}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{kost.title}</h1>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span>{kost.location}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className="text-sm">{kost.type.charAt(0).toUpperCase() + kost.type.slice(1)}</Badge>
                          {kost.averageRating > 0 && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium">{kost.averageRating}</span>
                              <span className="text-sm text-gray-500 ml-1">({kost.totalReviews} reviews)</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">{formatPrice(kost.price)}</p>
                        <p className="text-gray-600">per bulan</p>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                      <p className="text-gray-700">{kost.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Facilities */}
              <FadeIn delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle>Fasilitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {kost.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Map */}
              <FadeIn delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle>Lokasi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MapComponent latitude={kost.latitude} longitude={kost.longitude} title={kost.title} />
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Reviews */}
              <FadeIn delay={0.4}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Reviews ({kost.totalReviews})
                      </CardTitle>
                      {user && !hasRated && <Button onClick={() => setShowReviewForm(true)}>Write Review</Button>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Review Form */}
                    {showReviewForm && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-4">Write Your Review</h4>
                        <div className="space-y-4">
                          <div>
                            <Label>Rating</Label>
                            <div className="flex items-center space-x-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      star <= reviewData.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="review">Review</Label>
                            <Textarea
                              id="review"
                              value={reviewData.review}
                              onChange={(e) => setReviewData((prev) => ({ ...prev, review: e.target.value }))}
                              placeholder="Share your experience..."
                              rows={4}
                              className="mt-2"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={submitReview} disabled={submittingReview}>
                              {submittingReview ? "Submitting..." : "Submit Review"}
                            </Button>
                            <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {kost.ratings && kost.ratings.length > 0 ? (
                        kost.ratings.map((rating) => (
                          <div key={rating._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex items-start space-x-3">
                              <Avatar>
                                <AvatarFallback>{rating.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium">{rating.user.name}</h5>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < rating.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-gray-700 mb-2">{rating.review}</p>
                                <p className="text-sm text-gray-500">{formatDate(rating.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <FadeIn delay={0.1}>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Contact Owner</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{kost.owner_name}</p>
                        <p className="text-sm text-gray-600">Owner</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{kost.phone}</p>
                        <p className="text-sm text-gray-600">Phone Number</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                        <a href={getWhatsAppLink(kost.phone, kost.title)} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Contact via WhatsApp
                        </a>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={toggleFavorite}
                        className={`w-full ${isFavorite ? "text-red-600 border-red-600" : ""}`}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  )
}

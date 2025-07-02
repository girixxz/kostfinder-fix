"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { KostCard } from "@/components/kost-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { PageTransition } from "@/components/page-transition"
import { FadeIn } from "@/components/fade-in"
import { useToast } from "@/hooks/use-toast"
import { Heart, Star, User, Calendar, MapPin, Trash2, Edit } from "lucide-react"
import Link from "next/link"

interface Kost {
  _id: string
  title: string
  location: string
  price: number
  type: string
  images: string[]
  facilities: string[]
  averageRating?: number
}

interface UserRating {
  _id: string
  rating: number
  review: string
  createdAt: string
  kost: {
    _id: string
    title: string
    location: string
    images: string[]
  }
}

interface DashboardStats {
  totalFavorites: number
  totalReviews: number
  averageRating: number
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [favorites, setFavorites] = useState<Kost[]>([])
  const [userRatings, setUserRatings] = useState<UserRating[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalFavorites: 0,
    totalReviews: 0,
    averageRating: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    if (user) {
      fetchDashboardData()
    }
  }, [user, authLoading, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      // Fetch favorites
      const favoritesResponse = await fetch("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const favoritesData = await favoritesResponse.json()
      setFavorites(favoritesData)

      // Fetch user ratings
      const ratingsResponse = await fetch("/api/user/ratings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const ratingsData = await ratingsResponse.json()
      setUserRatings(ratingsData)

      // Calculate stats
      const averageRating =
        ratingsData.length > 0
          ? ratingsData.reduce((sum: number, r: UserRating) => sum + r.rating, 0) / ratingsData.length
          : 0

      setStats({
        totalFavorites: favoritesData.length,
        totalReviews: ratingsData.length,
        averageRating: Math.round(averageRating * 10) / 10,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (kostId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ kostId }),
      })

      if (response.ok) {
        setFavorites((prev) => prev.filter((kost) => kost._id !== kostId))
        setStats((prev) => ({ ...prev, totalFavorites: prev.totalFavorites - 1 }))
        toast({
          title: "Success",
          description: "Removed from favorites",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      })
    }
  }

  const deleteReview = async (ratingId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/user/ratings/${ratingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setUserRatings((prev) => prev.filter((rating) => rating._id !== ratingId))
        setStats((prev) => ({ ...prev, totalReviews: prev.totalReviews - 1 }))
        toast({
          title: "Success",
          description: "Review deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <FadeIn>
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-black text-white text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                  <p className="text-gray-600">Manage your kost preferences and reviews</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Heart className="w-8 h-8 text-red-500 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalFavorites}</p>
                        <p className="text-gray-600">Favorite Kosts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Star className="w-8 h-8 text-yellow-500 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                        <p className="text-gray-600">Reviews Written</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <User className="w-8 h-8 text-blue-500 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "N/A"}
                        </p>
                        <p className="text-gray-600">Average Rating Given</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </FadeIn>

          {/* Tabs */}
          <FadeIn delay={0.2}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="favorites">My Favorites ({stats.totalFavorites})</TabsTrigger>
                <TabsTrigger value="reviews">My Reviews ({stats.totalReviews})</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Favorites */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-red-500" />
                        Recent Favorites
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {favorites.slice(0, 3).length > 0 ? (
                        <div className="space-y-4">
                          {favorites.slice(0, 3).map((kost) => (
                            <div key={kost._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{kost.title}</h4>
                                <p className="text-sm text-gray-600 truncate">{kost.location}</p>
                                <p className="text-sm font-medium text-green-600">
                                  {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                  }).format(kost.price)}
                                  /bulan
                                </p>
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" asChild className="w-full bg-transparent">
                            <Link href="/dashboard?tab=favorites">View All Favorites</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No favorites yet</p>
                          <Button asChild className="mt-4">
                            <Link href="/search">Find Your First Kost</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Reviews */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-500" />
                        Recent Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userRatings.slice(0, 3).length > 0 ? (
                        <div className="space-y-4">
                          {userRatings.slice(0, 3).map((rating) => (
                            <div key={rating._id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900 truncate">{rating.kost.title}</h4>
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
                              <p className="text-sm text-gray-600 line-clamp-2">{rating.review}</p>
                              <p className="text-xs text-gray-500 mt-2">{formatDate(rating.createdAt)}</p>
                            </div>
                          ))}
                          <Button variant="outline" asChild className="w-full bg-transparent">
                            <Link href="/dashboard?tab=reviews">View All Reviews</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No reviews yet</p>
                          <Button asChild className="mt-4">
                            <Link href="/search">Find Kosts to Review</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites">
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((kost, index) => (
                      <FadeIn key={kost._id} delay={index * 0.1}>
                        <div className="relative">
                          <KostCard kost={kost} />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 left-2 z-10"
                            onClick={() => removeFavorite(kost._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
                      <p className="text-gray-600 mb-6">Start exploring and save your favorite kosts!</p>
                      <Button asChild>
                        <Link href="/search">Browse Kosts</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                {userRatings.length > 0 ? (
                  <div className="space-y-6">
                    {userRatings.map((rating, index) => (
                      <FadeIn key={rating._id} delay={index * 0.1}>
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <Link
                                  href={`/kost/${rating.kost._id}`}
                                  className="text-lg font-semibold text-gray-900 hover:text-gray-700"
                                >
                                  {rating.kost.title}
                                </Link>
                                <div className="flex items-center mt-1">
                                  <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                                  <span className="text-sm text-gray-600">{rating.kost.location}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/kost/${rating.kost._id}`}>
                                    <Edit className="w-4 h-4 mr-1" />
                                    View Kost
                                  </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => deleteReview(rating._id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center mb-3">
                              <div className="flex items-center mr-4">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < rating.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <Badge variant="secondary">{rating.rating}/5</Badge>
                            </div>

                            <p className="text-gray-700 mb-4">{rating.review}</p>

                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>Reviewed on {formatDate(rating.createdAt)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </FadeIn>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                      <p className="text-gray-600 mb-6">Share your experience by writing your first review!</p>
                      <Button asChild>
                        <Link href="/search">Find Kosts to Review</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </FadeIn>
        </div>

        <Footer />
      </div>
    </PageTransition>
  )
}

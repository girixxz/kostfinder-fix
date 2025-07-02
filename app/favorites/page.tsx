"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { KostCard } from "@/components/kost-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { PageTransition } from "@/components/page-transition"
import { FadeIn } from "@/components/fade-in"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Heart, Trash2 } from "lucide-react"
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

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [favorites, setFavorites] = useState<Kost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    if (user) {
      fetchFavorites()
    }
  }, [user, authLoading, router])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFavorites(data)
      } else {
        throw new Error("Failed to fetch favorites")
      }
    } catch (error) {
      console.error("Error fetching favorites:", error)
      toast({
        title: "Error",
        description: "Failed to load favorites",
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading favorites..." />
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
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">My Favorites</h1>
              <p className="text-gray-600">Kost yang telah Anda simpan sebagai favorit</p>
            </div>
          </FadeIn>

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
        </div>

        <Footer />
      </div>
    </PageTransition>
  )
}

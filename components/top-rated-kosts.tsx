"use client"

import { useState, useEffect } from "react"
import { KostCard } from "@/components/kost-card"
import { FadeIn } from "@/components/fade-in"
import { LoadingSpinner } from "@/components/loading-spinner"

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

export function TopRatedKosts() {
  const [kosts, setKosts] = useState<Kost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTopRatedKosts()
  }, [])

  const fetchTopRatedKosts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use relative URL for Vercel compatibility
      const response = await fetch("/api/kosts/top-rated", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for fresh data
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setKosts(data.kosts || [])
    } catch (error) {
      console.error("Error fetching top rated kosts:", error)
      setError("Failed to load top rated kosts")
    } finally {
      setLoading(false)
    }
  }

  // Don't render if no kosts or loading
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Loading top rated kosts..." />
          </div>
        </div>
      </section>
    )
  }

  if (error || kosts.length === 0) {
    return null // Don't show section if no data
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kost Rating Tertinggi</h2>
            <p className="text-gray-600">Kost dengan rating tertinggi dari penghuni</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {kosts.map((kost) => (
            <FadeIn key={kost._id}>
              <KostCard kost={kost} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

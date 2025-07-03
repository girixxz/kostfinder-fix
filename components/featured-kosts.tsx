"use client"

import { useState, useEffect } from "react"
import { KostCard } from "@/components/kost-card"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/fade-in"
import { LoadingSpinner } from "@/components/loading-spinner"
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

export function FeaturedKosts() {
  const [kosts, setKosts] = useState<Kost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFeaturedKosts()
  }, [])

  const fetchFeaturedKosts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use relative URL for Vercel compatibility
      const response = await fetch("/api/kosts/featured", {
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
      console.error("Error fetching featured kosts:", error)
      setError("Failed to load featured kosts")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Kost Terbaru</h2>
              <p className="text-gray-600">Pilihan kost terbaru yang mungkin Anda sukai</p>
            </div>
          </FadeIn>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Loading featured kosts..." />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchFeaturedKosts}>Try Again</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kost Terbaru</h2>
            <p className="text-gray-600">Pilihan kost terbaru yang mungkin Anda sukai</p>
          </div>
        </FadeIn>

        {kosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kosts.map((kost, index) => (
              <FadeIn key={kost._id} delay={index * 0.1}>
                <div className="transform transition-all duration-300 hover:scale-105">
                  <KostCard kost={kost} />
                </div>
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Belum ada kost yang tersedia</p>
            <Button asChild>
              <Link href="/admin">Tambah Kost Pertama</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

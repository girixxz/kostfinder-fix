"use client"

import { useState, useEffect, useMemo } from "react"
import { KostCard } from "@/components/kost-card"
import { FadeIn } from "@/components/fade-in"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"

interface Kost {
  _id: string
  title: string
  location: string
  price: number
  type: string
  images: string[]
  facilities: string[]
  averageRating?: number
  totalReviews?: number
}

export function TopRatedKosts() {
  const [kosts, setKosts] = useState<Kost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const [hasNavigated, setHasNavigated] = useState(false)

  useEffect(() => {
    fetchTopRatedKosts()
  }, [])

  const fetchTopRatedKosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/kosts/top-rated", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setKosts(data.kosts || [])
    } catch (error) {
      console.error("Error fetching top rated kosts:", error)
      setError("Gagal memuat data kost terbaik.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasNavigated) {
      const section = document.getElementById("top-rated-kosts")
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [currentPage])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(kosts.length / itemsPerPage)), [kosts])
  const paginatedKosts = useMemo(() => {
    return kosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [kosts, currentPage])

  if (loading) {
    return (
      <section className=" bg-white" id="top-rated-kosts">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Loading top rated kosts..." />
          </div>
        </div>
      </section>
    )
  }

  if (error || kosts.length === 0) {
    return null
  }

  return (
    <section className=" bg-white" id="top-rated-kosts">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-start mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Kost Dengan Rating Baik</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {paginatedKosts.map((kost, index) => (
            <FadeIn key={kost._id} delay={index * 0.1}>
              <KostCard kost={kost} />
            </FadeIn>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1))
                setHasNavigated(true)
              }}
            >
              Previous
            </Button>
            <span className="text-gray-600 font-medium">
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1))
                setHasNavigated(true)
              }}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

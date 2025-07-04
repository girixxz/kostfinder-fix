"use client"

import { useState, useEffect, useMemo } from "react"
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const [hasNavigated, setHasNavigated] = useState(false) // 🧠 Flag agar tidak scroll di awal

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(kosts.length / itemsPerPage)),
    [kosts.length]
  )

  const paginatedKosts = useMemo(() => {
    return kosts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  }, [kosts, currentPage])

  useEffect(() => {
    fetchFeaturedKosts()
  }, [])

  const fetchFeaturedKosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/kosts/featured", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Data kost yang didapat:", data.kosts)
      setKosts(data.kosts || [])
    } catch (error) {
      console.error("Error fetching featured kosts:", error)
      setError("Gagal memuat data kost")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Scroll hanya jika user klik pagination
  useEffect(() => {
    if (hasNavigated) {
      const section = document.getElementById("featured-kosts")
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [currentPage])

  if (loading) {
    return (
      <section className="py-16 bg-white" id="featured-kosts">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-start mt-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Rekomendasi Kost</h2>
            </div>
          </FadeIn>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Memuat data kost..." />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-white" id="featured-kosts">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchFeaturedKosts}>Coba Lagi</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white" id="featured-kosts">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-start mt-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rekomendasi Kost</h2>
          </div>
        </FadeIn>

        {paginatedKosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {paginatedKosts.map((kost, index) => (
                <FadeIn key={kost._id} delay={index * 0.1}>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <KostCard kost={kost} />
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-10 gap-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1))
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
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                  setHasNavigated(true)
                }}
              >
                Next
              </Button>
            </div>
          </>
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

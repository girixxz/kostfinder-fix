"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { KostCard } from "@/components/kost-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { PageTransition } from "@/components/page-transition"
import { FadeIn } from "@/components/fade-in"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface SearchFilters {
  search: string
  type: string
  minPrice: number
  maxPrice: number
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

const kostTypes = [
  { value: "all", label: "Semua Tipe" },
  { value: "putra", label: "Putra" },
  { value: "putri", label: "Putri" },
  { value: "campur", label: "Campur" },
  { value: "exclusive", label: "Exclusive" },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [kosts, setKosts] = useState<Kost[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const [filters, setFilters] = useState<SearchFilters>({
    search: searchParams.get("q") || "",
    type: "all",
    minPrice: 500000,
    maxPrice: 5000000,
    facilities: [],
  })

  const [priceRange, setPriceRange] = useState([500000, 5000000])

  useEffect(() => {
    fetchKosts()
  }, [currentPage])

  useEffect(() => {
    setCurrentPage(1)
    fetchKosts()
  }, [filters])

  const fetchKosts = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      })

      if (filters.search) params.append("search", filters.search)
      if (filters.type !== "all") params.append("type", filters.type)
      if (filters.minPrice > 500000) params.append("minPrice", filters.minPrice.toString())
      if (filters.maxPrice < 5000000) params.append("maxPrice", filters.maxPrice.toString())
      if (filters.facilities.length > 0) params.append("facilities", filters.facilities.join(","))

      const response = await fetch(`/api/kosts?${params}`)
      const data = await response.json()

      if (response.ok) {
        setKosts(data.kosts)
        setTotalPages(data.pagination.pages)
        setTotalResults(data.pagination.total)
      } else {
        throw new Error(data.error || "Failed to fetch kosts")
      }
    } catch (error) {
      console.error("Error fetching kosts:", error)
      toast({
        title: "Error",
        description: "Failed to load kosts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchKosts()
  }

  const handleFacilityChange = (facility: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      facilities: checked ? [...prev.facilities, facility] : prev.facilities.filter((f) => f !== facility),
    }))
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    setFilters((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "all",
      minPrice: 500000,
      maxPrice: 5000000,
      facilities: [],
    })
    setPriceRange([500000, 5000000])
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Cari Kost</h1>
              <p className="text-gray-600">Temukan kost impian Anda dengan filter yang sesuai</p>
            </div>
          </FadeIn>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80">
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Filter className="w-5 h-5 mr-2" />
                      Filter
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <Label htmlFor="search">Cari berdasarkan nama atau lokasi</Label>
                    <form onSubmit={handleSearch} className="flex mt-2">
                      <Input
                        id="search"
                        value={filters.search}
                        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                        placeholder="Masukkan kata kunci..."
                        className="flex-1"
                      />
                      <Button type="submit" className="ml-2">
                        <Search className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>

                  {/* Type */}
                  <div>
                    <Label>Tipe Kost</Label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {kostTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label>Rentang Harga per Bulan</Label>
                    <div className="mt-4 mb-4">
                      <Slider
                        value={priceRange}
                        onValueChange={handlePriceChange}
                        max={5000000}
                        min={500000}
                        step={100000}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div>
                    <Label>Fasilitas</Label>
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                      {availableFacilities.map((facility) => (
                        <div key={facility} className="flex items-center space-x-2">
                          <Checkbox
                            id={facility}
                            checked={filters.facilities.includes(facility)}
                            onCheckedChange={(checked) => handleFacilityChange(facility, checked as boolean)}
                          />
                          <Label htmlFor={facility} className="text-sm">
                            {facility}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <FadeIn>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-600">
                      {loading ? "Mencari..." : `Menampilkan ${totalResults} kost`}
                      {filters.search && ` untuk "${filters.search}"`}
                    </p>
                    {filters.facilities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {filters.facilities.map((facility) => (
                          <Badge key={facility} variant="secondary" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="lg:hidden bg-transparent"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </FadeIn>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" text="Mencari kost..." />
                </div>
              )}

              {/* Results Grid */}
              {!loading && (
                <>
                  {kosts.length > 0 ? (
                    <FadeIn>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        {kosts.map((kost, index) => (
                          <FadeIn key={kost._id} delay={index * 0.1}>
                            <KostCard kost={kost} />
                          </FadeIn>
                        ))}
                      </div>
                    </FadeIn>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Kost Ditemukan</h3>
                        <p className="text-gray-600 mb-6">
                          Coba ubah filter pencarian atau kata kunci untuk hasil yang lebih luas
                        </p>
                        <Button onClick={clearFilters}>Reset Filter</Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <FadeIn>
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>

                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                          if (pageNum > totalPages) return null

                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          )
                        })}

                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </FadeIn>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  )
}

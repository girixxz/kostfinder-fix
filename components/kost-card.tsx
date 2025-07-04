"use client"

import type React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Lock } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface KostCardProps {
  kost: {
    _id: string
    title: string
    location: string
    price: number
    type: string
    images: string[]
    facilities: string[]
    averageRating?: number
  }
}

export function KostCard({ kost }: KostCardProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "putra":
        return "bg-blue-100 text-blue-800"
      case "putri":
        return "bg-pink-100 text-pink-800"
      case "campur":
        return "bg-green-100 text-green-800"
      case "exclusive":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Login Required",
        description: "Silakan login terlebih dahulu untuk melihat detail kost",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    router.push(`/kost/${kost._id}`)
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Gambar */}
      <div className="relative h-32 md:h-40 lg:h-44 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        <Image
          src={kost.images[0] || "/placeholder.svg?height=200&width=300"}
          alt={kost.title}
          fill
          className={`object-cover transition-all duration-300 group-hover:scale-110 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setImageLoading(false)}
        />

        <Badge
          className={`absolute top-2 right-2 ${getTypeColor(
            kost.type
          )} transition-transform duration-200 group-hover:scale-105`}
        >
          {kost.type.charAt(0).toUpperCase() + kost.type.slice(1)}
        </Badge>

        {!user && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white text-center">
              <Lock className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Login untuk melihat detail</p>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">

        

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors duration-200">
          {kost.title}
        </h3>

        {/* Lokasi */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm line-clamp-1">{kost.location}</span>
        </div>

        {/* Fasilitas */}
        <div className="flex flex-wrap gap-1 mb-4">
          {kost.facilities.slice(0, 2).map((facility, index) => (
            <Badge key={index} variant="secondary" className="text-[10px]">
              {facility}
            </Badge>
          ))}
          {kost.facilities.length > 2 && (
            <Badge variant="secondary" className="text-[10px]">
              +{kost.facilities.length - 2} lainnya
            </Badge>
          )}
        </div>

        {/* Harga dan Rating */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-600">
            {formatPrice(kost.price)}/
            <span className="text-gray-400">bulan</span>
          </span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm ml-1">
              {typeof kost.averageRating === "number" && kost.averageRating > 0
                ? kost.averageRating.toFixed(1)
                : "N/A"}
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

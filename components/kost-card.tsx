"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"
import { useState } from "react"

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

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative h-48 overflow-hidden">
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
          className={`absolute top-2 right-2 ${getTypeColor(kost.type)} transition-transform duration-200 group-hover:scale-105`}
        >
          {kost.type.charAt(0).toUpperCase() + kost.type.slice(1)}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors duration-200">
          {kost.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm line-clamp-1">{kost.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-green-600">{formatPrice(kost.price)}/bulan</span>
          {kost.averageRating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm ml-1">{kost.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {kost.facilities.slice(0, 3).map((facility, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {facility}
            </Badge>
          ))}
          {kost.facilities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{kost.facilities.length - 3} lainnya
            </Badge>
          )}
        </div>

        <Link
          href={`/kost/${kost._id}`}
          className="block w-full bg-black text-white text-center py-2 rounded hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Lihat Detail
        </Link>
      </CardContent>
    </Card>
  )
}

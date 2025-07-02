"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="bg-black text-white w-12 h-12 rounded flex items-center justify-center font-bold text-xl">
              K
            </div>
            <span className="text-2xl font-bold text-gray-900">KostFinder</span>
          </Link>
        </div>

        {/* 404 Content */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau tidak ada.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-black hover:bg-gray-800">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Cari Kost
            </Link>
          </Button>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Button variant="ghost" onClick={() => window.history.back()} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Halaman Sebelumnya
          </Button>
        </div>
      </div>
    </div>
  )
}

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { KostCard } from "@/components/kost-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollToTop } from "@/components/scroll-to-top"
import { FadeIn } from "@/components/fade-in"
import { PageTransition } from "@/components/page-transition"
import Link from "next/link"
import { Search, MapPin, Shield, Star, Clock } from "lucide-react"
import dbConnect from "@/lib/mongodb"
import Kost from "@/models/Kost"
import Rating from "@/models/Rating"

// Server component to fetch real data
async function getFeaturedKosts() {
  try {
    await dbConnect()

    // Get latest 6 kosts
    const kosts = await Kost.find({}).sort({ createdAt: -1 }).limit(6).lean()

    // Get ratings for each kost
    const kostsWithRatings = await Promise.all(
      kosts.map(async (kost) => {
        const ratings = await Rating.find({ kost: kost._id }).lean()
        const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0

        return {
          _id: kost._id.toString(),
          title: kost.title,
          location: kost.location,
          price: kost.price,
          type: kost.type,
          images: kost.images,
          facilities: kost.facilities,
          averageRating: Math.round(averageRating * 10) / 10,
        }
      }),
    )

    return kostsWithRatings
  } catch (error) {
    console.error("Error fetching kosts:", error)
    return []
  }
}

async function getTopRatedKosts() {
  try {
    await dbConnect()

    // Get kosts with ratings
    const ratings = await Rating.aggregate([
      {
        $group: {
          _id: "$kost",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $match: {
          averageRating: { $gte: 4 },
          totalReviews: { $gte: 2 },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $limit: 4,
      },
    ])

    const topRatedKosts = await Promise.all(
      ratings.map(async (rating) => {
        const kost = await Kost.findById(rating._id).lean()
        if (!kost) return null

        return {
          _id: kost._id.toString(),
          title: kost.title,
          location: kost.location,
          price: kost.price,
          type: kost.type,
          images: kost.images,
          facilities: kost.facilities,
          averageRating: Math.round(rating.averageRating * 10) / 10,
        }
      }),
    )

    return topRatedKosts.filter(Boolean)
  } catch (error) {
    console.error("Error fetching top rated kosts:", error)
    return []
  }
}

export default async function HomePage() {
  const [featuredKosts, topRatedKosts] = await Promise.all([getFeaturedKosts(), getTopRatedKosts()])

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />

        {/* Hero Section with animation */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn delay={0.2}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Temukan Kost Impian Anda</h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-xl md:text-2xl mb-8 text-gray-300">
                Platform pencarian kost terpercaya dengan ribuan pilihan di seluruh Indonesia
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <Button
                size="lg"
                asChild
                className="bg-white text-black hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                <Link href="/search">
                  <Search className="w-5 h-5 mr-2" />
                  Cari Kost Sesuai Kriteria Anda
                </Link>
              </Button>
            </FadeIn>
          </div>
        </section>

        {/* Featured Kosts with real data */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Kost Terbaru</h2>
                <p className="text-gray-600">Pilihan kost terbaru yang mungkin Anda sukai</p>
              </div>
            </FadeIn>

            {featuredKosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredKosts.map((kost, index) => (
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

        {/* Top Rated Kosts with real data */}
        {topRatedKosts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Kost Rating Tertinggi</h2>
                  <p className="text-gray-600">Kost dengan rating tertinggi dari penghuni</p>
                </div>
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {topRatedKosts.map((kost) => (
                  <FadeIn key={kost._id}>
                    <KostCard kost={kost} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tentang KostFinder</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  KostFinder adalah platform digital yang menghubungkan pencari kost dengan pemilik kost di seluruh
                  Indonesia. Kami berkomitmen memberikan pengalaman terbaik dalam mencari hunian ideal.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Mengapa Harus KostFinder?</h2>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FadeIn>
                <Card>
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Lokasi Strategis</h3>
                    <p className="text-gray-600 text-sm">
                      Ribuan pilihan kost di lokasi strategis dekat kampus dan perkantoran
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Terpercaya</h3>
                    <p className="text-gray-600 text-sm">
                      Semua kost telah diverifikasi dan memiliki review dari penghuni sebelumnya
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Rating & Review</h3>
                    <p className="text-gray-600 text-sm">Sistem rating dan review membantu Anda memilih kost terbaik</p>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">24/7 Support</h3>
                    <p className="text-gray-600 text-sm">Tim customer service siap membantu Anda kapan saja</p>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
              <p className="text-gray-600 mb-8">
                Ada pertanyaan? Tim kami siap membantu Anda menemukan kost yang tepat
              </p>
            </FadeIn>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline">
                Email: info@kostfinder.com
              </Button>
              <Button size="lg" variant="outline">
                WhatsApp: +62 812-3456-7890
              </Button>
            </div>
          </div>
        </section>

        <ScrollToTop />
        <Footer />
      </div>
    </PageTransition>
  )
}

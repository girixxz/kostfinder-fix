import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollToTop } from "@/components/scroll-to-top"
import { FadeIn } from "@/components/fade-in"
import { PageTransition } from "@/components/page-transition"
import { FeaturedKosts } from "@/components/featured-kosts"
import { TopRatedKosts } from "@/components/top-rated-kosts"
import Link from "next/link"
import { Search, MapPin, Shield, Star, Clock } from "lucide-react"

// Convert to Client Component untuk real-time data
export default function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />

        {/* Hero Section with animation */}
        {/* <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20 overflow-hidden">
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
        </section> */}

        <section
          className="relative h-[500px] md:h-[600px] bg-[url('/images/hero-section-1.png')] bg-cover bg-[center_right] bg-no-repeat"
        >
          {/* Overlay gelap dari kiri ke kanan */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 z-0" />

          <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-md leading-tight">
              <span className="text-yellow-500">Temukan</span> Kost Impian Anda
            </h1>
            <p className="text-base md:text-xl text-gray-300 max-w-xl mb-6 leading-relaxed">
              Platform <span className="text-yellow-400 font-medium">pencarian kost terpercaya</span> dengan ribuan pilihan di seluruh Indonesia.
            </p>
          </div>
        </section>
        
        <section className="bg-white text-center pt-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
              Ingin <span className="text-yellow-600 font-bold">mencari kos</span> yang sesuai <span className="text-yellow-600 font-bold">kriteriamu?</span>
            </h2>
            <p className="text-sm text-gray-500 mb-6">Login untuk mendapatkan info lebih jauh!</p>

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <Button
                  size="lg"
                  asChild
                  className="w-full bg-white text-black hover:bg-gray-100 transition-all duration-300 hover:scale-105 border border-gray-300 shadow-sm"
                >
                  <Link href="/search">
                    <Search className="w-5 h-5 mr-2" />
                    Temukan kost sesuai kriteriamu
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>


        {/* Featured Kosts - Now using Client Component */}
        <FeaturedKosts />

        {/* Top Rated Kosts - Now using Client Component */}
        <TopRatedKosts />

        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-20">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Tentang Kost<span className="text-yellow-600">Finder</span></h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  KostFinder adalah platform digital yang menghubungkan pencari kost dengan pemilik kost di seluruh
                  Indonesia. Kami berkomitmen memberikan pengalaman terbaik dalam mencari hunian ideal.
                </p>
              </div>
            </FadeIn>

            {/* Foto Tim - Ukuran Lebih Besar */}
            <FadeIn delay={0.3}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 justify-center items-center text-center">
                {/* Developer */}
                <div>
                  <img
                    src="/team/developer.jpg"
                    alt="Developer"
                    className="w-44 h-44 md:w-48 md:h-48 mx-auto rounded-full object-cover border-4 border-yellow-500 shadow-xl"
                  />
                  <p className="mt-4 text-lg font-semibold text-gray-800">Developer</p>
                </div>

                {/* Admin 1 */}
                <div>
                  <img
                    src="/team/admin1.jpg"
                    alt="Admin 1"
                    className="w-44 h-44 md:w-48 md:h-48 mx-auto rounded-full object-cover border-4 border-yellow-500 shadow-xl"
                  />
                  <p className="mt-4 text-lg font-semibold text-gray-800">Admin 1</p>
                </div>

                {/* Admin 2 */}
                <div>
                  <img
                    src="/team/admin2.jpg"
                    alt="Admin 2"
                    className="w-44 h-44 md:w-48 md:h-48 mx-auto rounded-full object-cover border-4 border-yellow-500 shadow-xl"
                  />
                  <p className="mt-4 text-lg font-semibold text-gray-800">Admin 2</p>
                </div>

                {/* CEO */}
                <div>
                  <img
                    src="/team/ceo.jpg"
                    alt="CEO"
                    className="w-44 h-44 md:w-48 md:h-48 mx-auto rounded-full object-cover border-4 border-yellow-500 shadow-xl"
                  />
                  <p className="mt-4 text-lg font-semibold text-gray-800">CEO</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>


        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Keunggulan Platform</h2>
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

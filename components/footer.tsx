import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white text-black w-8 h-8 rounded flex items-center justify-center font-bold">K</div>
              <span className="text-xl font-bold">KostFinder</span>
            </div>
            <p className="text-gray-400 mb-4">
              Platform pencarian kost terpercaya yang membantu Anda menemukan hunian ideal dengan berbagai pilihan
              lokasi dan fasilitas terlengkap.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white">
                  Cari Kost
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-white">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@kostfinder.com</li>
              <li>Phone: +62 812-3456-7890</li>
              <li>Address: Yogyakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 KostFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

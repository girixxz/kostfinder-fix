export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo with pulse animation */}
        <div className="mb-6">
          <div className="bg-black text-white w-16 h-16 rounded flex items-center justify-center font-bold text-2xl mx-auto animate-pulse">
            K
          </div>
          <span className="text-xl font-bold text-gray-900 mt-2 block">KostFinder</span>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>

        <p className="text-gray-600">Memuat halaman...</p>
      </div>
    </div>
  )
}

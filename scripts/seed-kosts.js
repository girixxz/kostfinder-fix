const mongoose = require("mongoose")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://username:password@cluster.mongodb.net/kostfinder"

const KostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["putra", "putri", "campur", "exclusive"], required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone: { type: String, required: true },
    owner_name: { type: String, required: true },
    facilities: [{ type: String, required: true }],
  },
  { timestamps: true },
)

const Kost = mongoose.models.Kost || mongoose.model("Kost", KostSchema)

const sampleKosts = [
  {
    title: "Kost Nyaman Dekat Kampus UI",
    location: "Depok, Jawa Barat",
    price: 1500000,
    type: "campur",
    description: "Kost nyaman dan strategis dekat dengan Universitas Indonesia. Fasilitas lengkap dan lingkungan aman.",
    images: ["https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Kost+UI"],
    latitude: -6.3588,
    longitude: 106.8316,
    phone: "081234567890",
    owner_name: "Ibu Sari",
    facilities: ["AC", "WiFi", "Kamar Mandi Dalam", "Parkir Motor", "Security 24 Jam"],
  },
  {
    title: "Kost Putri Eksklusif Jakarta Selatan",
    location: "Jakarta Selatan",
    price: 2500000,
    type: "putri",
    description: "Kost khusus putri dengan fasilitas premium di area Jakarta Selatan yang strategis.",
    images: ["https://via.placeholder.com/400x300/E74C3C/FFFFFF?text=Kost+Putri"],
    latitude: -6.2615,
    longitude: 106.7942,
    phone: "081234567891",
    owner_name: "Ibu Rina",
    facilities: ["AC", "WiFi", "Kamar Mandi Dalam", "Dapur Bersama", "Laundry", "CCTV"],
  },
  {
    title: "Kost Putra Strategis Bandung",
    location: "Bandung, Jawa Barat",
    price: 1200000,
    type: "putra",
    description: "Kost putra dengan lokasi strategis di pusat kota Bandung, dekat dengan berbagai fasilitas umum.",
    images: ["https://via.placeholder.com/400x300/2ECC71/FFFFFF?text=Kost+Bandung"],
    latitude: -6.9175,
    longitude: 107.6191,
    phone: "081234567892",
    owner_name: "Pak Budi",
    facilities: ["WiFi", "Parkir Motor", "Security 24 Jam", "Kamar Mandi Luar", "Dapur Bersama"],
  },
  {
    title: "Kost Premium Menteng",
    location: "Jakarta Pusat",
    price: 3500000,
    type: "exclusive",
    description: "Kost premium di area Menteng dengan fasilitas mewah dan lokasi yang sangat strategis.",
    images: ["https://via.placeholder.com/400x300/9B59B6/FFFFFF?text=Kost+Premium"],
    latitude: -6.1944,
    longitude: 106.8229,
    phone: "081234567893",
    owner_name: "Ibu Maya",
    facilities: ["AC", "WiFi", "Kamar Mandi Dalam", "Gym", "Rooftop", "Parkir Mobil", "CCTV"],
  },
  {
    title: "Kost Modern Surabaya",
    location: "Surabaya, Jawa Timur",
    price: 1800000,
    type: "campur",
    description: "Kost modern dengan desain kontemporer di Surabaya, cocok untuk mahasiswa dan pekerja muda.",
    images: ["https://via.placeholder.com/400x300/F39C12/FFFFFF?text=Kost+Surabaya"],
    latitude: -7.2575,
    longitude: 112.7521,
    phone: "081234567894",
    owner_name: "Pak Andi",
    facilities: ["AC", "WiFi", "Kamar Mandi Dalam", "CCTV", "Laundry", "Parkir Motor"],
  },
]

async function seedKosts() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing kosts
    await Kost.deleteMany({})
    console.log("Cleared existing kosts")

    // Insert sample kosts
    await Kost.insertMany(sampleKosts)
    console.log("✅ Sample kosts created successfully!")
    console.log(`📊 Created ${sampleKosts.length} sample kosts`)
  } catch (error) {
    console.error("❌ Error seeding kosts:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

seedKosts()

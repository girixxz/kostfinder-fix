export interface Kost {
  id: number
  name: string
  location: string
  price: number
  type: string
  facilities: string[]
  description: string
  images: string[]
  ownerPhone: string
}

export const kostData: Kost[] = [
  {
    id: 1,
    name: "Kost Melati Premium",
    location: "Jl. Melati Indah No. 15, Menteng, Jakarta Pusat",
    price: 1800000,
    type: "Putri",
    facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Dapur", "Parkir", "Security 24 Jam"],
    description:
      "Kost premium khusus putri dengan fasilitas lengkap dan modern. Lokasi strategis di jantung kota Jakarta dengan akses mudah ke berbagai tempat. Lingkungan aman dan nyaman dengan security 24 jam.",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    ownerPhone: "6281234567890",
  },
  {
    id: 2,
    name: "Mawar Residence Executive",
    location: "Jl. Mawar Raya No. 8, Kemang, Jakarta Selatan",
    price: 2500000,
    type: "Putra",
    facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Laundry", "Gym", "Co-working Space"],
    description:
      "Kost eksklusif untuk putra dengan standar apartemen. Dilengkapi dengan gym, co-working space, dan fasilitas modern lainnya. Cocok untuk profesional muda dan mahasiswa S2.",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    ownerPhone: "6281234567891",
  },
  {
    id: 3,
    name: "Anggrek Garden Kost",
    location: "Jl. Anggrek Putih No. 22, Tebet, Jakarta Selatan",
    price: 1400000,
    type: "Campur",
    facilities: ["WiFi", "Kamar Mandi Dalam", "Dapur Bersama", "Parkir", "Taman"],
    description:
      "Kost campur dengan suasana asri dan taman yang indah. Lingkungan tenang dan nyaman, cocok untuk mahasiswa dan pekerja yang menyukai suasana natural di tengah kota.",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    ownerPhone: "6281234567892",
  },
  {
    id: 4,
    name: "Dahlia Luxury Living",
    location: "Jl. Dahlia Raya No. 5, Senayan, Jakarta Pusat",
    price: 3200000,
    type: "Putri",
    facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Gym", "Rooftop", "Laundry", "Cleaning Service"],
    description:
      "Kost mewah khusus putri dengan fasilitas premium seperti gym, rooftop garden, dan cleaning service. Lokasi premium di area bisnis Senayan dengan akses mudah ke mall dan perkantoran.",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    ownerPhone: "6281234567893",
  },
  {
    id: 5,
    name: "Kenanga Budget Kost",
    location: "Jl. Kenanga No. 12, Cikini, Jakarta Pusat",
    price: 1200000,
    type: "Putra",
    facilities: ["WiFi", "Kamar Mandi Luar", "Dapur Bersama", "Parkir Motor"],
    description:
      "Kost ekonomis untuk putra dengan fasilitas standar namun lengkap. Lingkungan asri dan tenang, cocok untuk mahasiswa dengan budget terbatas. Dekat dengan kampus dan fasilitas pendidikan.",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    ownerPhone: "6281234567894",
  },
  {
    id: 6,
    name: "Flamboyan Modern Living",
    location: "Jl. Flamboyan No. 18, Kuningan, Jakarta Selatan",
    price: 2200000,
    type: "Campur",
    facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Lift", "CCTV", "Parkir", "Smart Lock"],
    description:
      "Kost modern dengan teknologi smart home dan desain minimalis. Dilengkapi dengan lift, sistem keamanan CCTV, dan smart lock. Lokasi strategis di kawasan bisnis Kuningan.",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    ownerPhone: "6281234567895",
  },
  {
    id: 7,
    name: "Bougenville Homey Kost",
    location: "Jl. Bougenville No. 7, Pancoran, Jakarta Selatan",
    price: 1600000,
    type: "Putri",
    facilities: ["WiFi", "Kamar Mandi Dalam", "Dapur", "Taman", "Parkir", "Ruang Santai"],
    description:
      "Kost putri dengan suasana homey dan taman yang asri. Dilengkapi dengan ruang santai bersama dan taman yang indah. Lingkungan yang aman dan nyaman untuk beristirahat.",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    ownerPhone: "6281234567896",
  },
  {
    id: 8,
    name: "Sakura Digital Nomad Hub",
    location: "Jl. Sakura No. 25, Menteng, Jakarta Pusat",
    price: 2800000,
    type: "Putra",
    facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Co-working Space", "Pantry", "Meeting Room"],
    description:
      "Kost premium untuk putra dengan fokus pada digital nomad dan remote worker. Dilengkapi dengan co-working space, meeting room, dan pantry lengkap. Ideal untuk profesional IT dan startup.",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    ownerPhone: "6281234567897",
  },
]

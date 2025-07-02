require("dotenv").config({ path: ".env.local" })
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// MongoDB connection - now reads from .env.local
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables")
  process.exit(1)
}

// User schema (simplified version)
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
)

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.models.User || mongoose.model("User", UserSchema)

async function createAdmin() {
  try {
    console.log("🔗 Connecting to MongoDB...")

    // Connect to MongoDB with database name
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB successfully!")

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@kostfinder.com" })
    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists!")
      console.log("📧 Email: admin@kostfinder.com")
      console.log("🔑 Password: admin123")
      console.log("🌐 You can login at: http://localhost:3000/login")
      return
    }

    // Create admin user
    console.log("👤 Creating admin user...")
    const adminUser = new User({
      name: "Admin KostFinder",
      email: "admin@kostfinder.com",
      password: "admin123",
      role: "admin",
    })

    await adminUser.save()
    console.log("🎉 Admin user created successfully!")
    console.log("")
    console.log("📋 Admin Credentials:")
    console.log("📧 Email: admin@kostfinder.com")
    console.log("🔑 Password: admin123")
    console.log("")
    console.log("🌐 Login URL: http://localhost:3000/login")
    console.log("⚙️  Admin Panel: http://localhost:3000/admin")
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message)
    if (error.code === 11000) {
      console.log("ℹ️  Admin user already exists!")
    }
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Disconnected from MongoDB")
  }
}

createAdmin()

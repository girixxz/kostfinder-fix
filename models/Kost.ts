import mongoose from "mongoose"

const KostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["putra", "putri", "campur", "exclusive"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    owner_name: {
      type: String,
      required: true,
    },
    facilities: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

KostSchema.index({ location: "text", title: "text" })
KostSchema.index({ price: 1 })
KostSchema.index({ type: 1 })

export default mongoose.models.Kost || mongoose.model("Kost", KostSchema)

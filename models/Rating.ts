import mongoose from "mongoose"

const RatingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    kost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kost",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

RatingSchema.index({ user: 1, kost: 1 }, { unique: true })

export default mongoose.models.Rating || mongoose.model("Rating", RatingSchema)

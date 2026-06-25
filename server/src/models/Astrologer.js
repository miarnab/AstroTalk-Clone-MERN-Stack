import mongoose from "mongoose";

const astrologerSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    specialties: [{ type: String }],
    languages: [{ type: String }],
    experience: Number,
    rating: Number,
    orders: Number,
    pricePerMinute: Number,
    modes: [{ type: String, enum: ["chat", "call"] }],
    status: { type: String, enum: ["online", "busy", "offline"], default: "online" },
    responseTime: String,
    accent: String
  },
  { timestamps: true }
);

export default mongoose.model("Astrologer", astrologerSchema);

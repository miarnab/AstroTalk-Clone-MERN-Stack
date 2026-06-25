import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    astrologerId: { type: String, required: true },
    astrologerName: { type: String, required: true },
    customerName: { type: String, required: true },
    concern: { type: String, required: true },
    mode: { type: String, enum: ["chat", "call"], required: true },
    birthDate: String,
    birthTime: String,
    place: String,
    etaMinutes: Number,
    status: { type: String, default: "confirmed" }
  },
  { timestamps: true }
);

export default mongoose.model("Consultation", consultationSchema);

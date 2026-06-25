import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    adminCodeVerified: {
      type: Boolean,
      default: false
    },
    wallet: {
      balance: {
        type: Number,
        default: 1200
      },
      rewards: {
        type: Number,
        default: 340
      },
      freeMinutes: {
        type: Number,
        default: 12
      },
      spendThisMonth: {
        type: Number,
        default: 860
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

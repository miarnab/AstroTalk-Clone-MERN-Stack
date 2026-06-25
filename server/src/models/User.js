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
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", userSchema);

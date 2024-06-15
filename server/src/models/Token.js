import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 3600 // an hour
    }
  }
)

export default Token = mongoose.model("Token", tokenSchema);
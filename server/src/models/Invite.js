import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    role: {
      type: String,
      enum: ["member", "manager"],
      default: "member",
      required: true,
    },

    // Optional — if set, only this email can accept the invite
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, //! TTL index → auto delete when expired
    },

    // If invite is used
    used: {
      type: Boolean,
      default: false,
    },

    // If invite is revoked
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Invite", inviteSchema);

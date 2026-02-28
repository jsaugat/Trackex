import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const roles = ["owner", "manager", "member"]; // define allowed roles

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    role: {
      type: String,
      enum: roles,
      default: "member", // default role for new users
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true },
);

//? Hash password before saving to database (each time when 'password' is modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

//? Check if password entered for login matches with the one in db.
userSchema.methods.passwordMatches = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generates a one-time password-reset token.
// Raw token is returned for transport (email URL), hashed version is stored in DB.
// Expiry is intentionally short-lived to reduce replay risk.
userSchema.methods.generatePasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  return rawToken;
};

export default mongoose.model("User", userSchema);

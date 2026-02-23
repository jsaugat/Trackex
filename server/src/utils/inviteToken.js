// src/utils/inviteToken.js
import jwt from "jsonwebtoken";
import AppError from "./appError.js";

/**
 * Invite token payload example:
 * {
 *   orgId: "mongoObjectId",
 *   email: "invited@x.com", // optional but recommended
 *   role: "member",
 *   iat, exp
 * }
 */
export function verifyInviteToken(inviteToken) {
  try {
    return jwt.verify(inviteToken, process.env.INVITE_JWT_SECRET);
  } catch {
    throw new AppError("Invalid or expired invite token.", 401);
  }
}

// Optional: if you want to generate tokens server-side
export function signInviteToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, process.env.INVITE_JWT_SECRET, { expiresIn });
}

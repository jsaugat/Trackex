import asyncHandler from "express-async-handler";
import Invite from "../models/Invite.js";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import { signInviteToken, verifyInviteToken } from "../utils/inviteToken.js";
import generateToken from "../utils/generateToken.js";
import AppError from "../utils/appError.js";

/**
 * @desc    Create an invitation link
 * @route   POST /api/invitations
 * @access  Private (owner / manager)
 */
export const createInvitation = asyncHandler(async (req, res) => {
  const { role, email } = req.body; // role: "member" | "manager", email: optional
  const user = req.user;

  // Only owner or manager can invite
  if (!["owner", "manager"].includes(user.role)) {
    throw new AppError("Only owners and managers can create invitations.", 403);
  }

  // Managers cannot invite other managers
  if (user.role === "manager" && role === "manager") {
    throw new AppError("Managers cannot invite other managers.", 403);
  }

  const validRoles = ["member", "manager"];
  if (!validRoles.includes(role)) {
    throw new AppError(
      `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      400,
    );
  }

  const orgId = user.organization;

  // Verify org exists
  const org = await Organization.findById(orgId);
  if (!org) throw new AppError("Organization not found.", 404);

  // Build JWT payload
  const payload = {
    orgId: org._id.toString(),
    orgName: org.name,
    role,
  };
  if (email) payload.email = email.toLowerCase().trim();

  // Sign the invite token (7-day expiry)
  const token = signInviteToken(payload, "7d");

  // Persist in DB for one-time-use enforcement & revocation
  await Invite.create({
    token,
    organization: org._id,
    role,
    email: email ? email.toLowerCase().trim() : undefined,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Build the invite link
  const clientOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
  const inviteLink = `${clientOrigin}/invite/${token}`;

  res.status(201).json({ token, inviteLink });
});

/**
 * @desc    Validate an invitation token (public)
 * @route   GET /api/invitations/:token
 * @access  Public
 */
export const validateInvitation = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Find in DB
  const doc = await Invite.findOne({ token }).populate("organization");
  if (!doc) {
    throw new AppError("Invitation not found.", 404);
  }

  // Check if already used
  if (doc.used) {
    return res
      .status(410)
      .json({
        status: "used",
        message: "This invitation has already been used.",
      });
  }

  // Check if revoked
  if (doc.revoked) {
    throw new AppError("This invitation has been revoked.", 410);
  }

  // Check expiry
  if (doc.expiresAt < new Date()) {
    return res
      .status(410)
      .json({ status: "expired", message: "This invitation has expired." });
  }

  // Verify JWT integrity
  let payload;
  try {
    payload = verifyInviteToken(token);
  } catch {
    return res
      .status(410)
      .json({
        status: "expired",
        message: "This invitation has expired or is invalid.",
      });
  }

  res.json({
    status: "valid",
    orgId: payload.orgId,
    orgName: payload.orgName || doc.organization?.name || "Unknown",
    role: payload.role,
    email: payload.email || null,
  });
});

/**
 * @desc    Accept an invitation (register via invite)
 * @route   POST /api/invitations/:token/accept
 * @access  Public
 */
export const acceptInvitation = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required.", 400);
  }

  // Validate the DB record
  const doc = await Invite.findOne({ token, used: false, revoked: false });
  if (!doc) {
    throw new AppError("Invalid or already-used invitation.", 400);
  }

  if (doc.expiresAt < new Date()) {
    throw new AppError("This invitation has expired.", 410);
  }

  // Verify JWT
  let payload;
  try {
    payload = verifyInviteToken(token);
  } catch {
    throw new AppError("Invalid or expired invite token.", 401);
  }

  // If invite was sent to a specific email, enforce it
  if (payload.email && payload.email.toLowerCase() !== email.toLowerCase()) {
    throw new AppError(
      "This invitation was sent to a different email address.",
      403,
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("A user with this email already exists.", 409);
  }

  // Find the organization
  const org = await Organization.findById(payload.orgId);
  if (!org) {
    throw new AppError("Organization not found.", 404);
  }

  // Create the user (password hashing happens in the pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
    role: payload.role,
    organization: org._id,
  });

  // Mark invitation as used
  doc.used = true;
  await doc.save();

  // Issue auth token
  const authToken = generateToken(res, user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization: {
      _id: org._id,
      name: org.name,
      slug: org.slug,
    },
    token: authToken,
  });
});

/**
 * @desc    Revoke an invitation
 * @route   DELETE /api/invitations/:token
 * @access  Private (owner / manager)
 */
export const revokeInvitation = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const user = req.user;

  if (!["owner", "manager"].includes(user.role)) {
    throw new AppError("Only owners and managers can revoke invitations.", 403);
  }

  const doc = await Invite.findOne({ token, organization: user.organization });
  if (!doc) {
    throw new AppError("Invitation not found.", 404);
  }

  doc.revoked = true;
  await doc.save();

  res.json({ message: "Invitation revoked." });
});

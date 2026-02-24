// src/services/auth.service.js
import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import { verifyInviteToken } from "../utils/inviteToken.js";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Invite from "../models/Invite.js";

export async function registerUserService(input) {
  const { name, email, password, inviteToken, orgName, orgSlug } = input;

  // Always check existing user first (outside txn is fine too, but inside is OK)
  const existing = await User.findOne({ email }).lean();
  if (existing) throw new AppError("User already exists.", 409);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let user;
    let organization;

    if (inviteToken) {
      // ----- INVITED FLOW -----
      const payload = verifyInviteToken(inviteToken);

      const invitedOrgId = payload.orgId;
      const invitedEmail = payload.email; // recommended
      const role = payload.role || "member";

      if (!invitedOrgId)
        throw new AppError("Invite token is missing org info.", 401);
      if (invitedEmail && invitedEmail.toLowerCase() !== email.toLowerCase()) {
        throw new AppError("Invite token does not match this email.", 403);
      }

      organization = await Organization.findById(invitedOrgId).session(session);
      if (!organization)
        throw new AppError("Organization not found for invite.", 404);

      user = await User.create(
        [
          {
            name,
            email,
            password,
            role,
            organization: organization._id,
          },
        ],
        { session },
      );

      user = user[0];

      // Mark the invite as used so the link can't be reused
      await Invite.findOneAndUpdate(
        { token: inviteToken, used: false },
        { used: true },
        { session },
      );
    } else {
      // ----- OWNER CREATES ORG FLOW -----
      if (!orgName || !orgSlug) {
        throw new AppError(
          "Organization name and workspace URL are required.",
          400,
        );
      }

      // Ideally enforce uniqueness with a DB unique index too.
      const orgExists = await Organization.findOne({ slug: orgSlug }).session(
        session,
      );
      if (orgExists) throw new AppError("Workspace URL is already taken.", 409);

      // Create org and user atomically
      const userId = new mongoose.Types.ObjectId();
      const orgId = new mongoose.Types.ObjectId();

      organization = await Organization.create(
        [
          {
            _id: orgId,
            name: orgName,
            slug: orgSlug,
            owner: userId,
          },
        ],
        { session },
      );

      organization = organization[0];

      user = await User.create(
        [
          {
            _id: userId,
            name,
            email,
            password,
            role: "owner",
            organization: orgId,
          },
        ],
        { session },
      );

      user = user[0];
    }

    await session.commitTransaction();
    session.endSession();

    return { user, organization };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

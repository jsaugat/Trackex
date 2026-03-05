import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import { verifyInviteToken } from "../utils/inviteToken.js";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Invite from "../models/Invite.js";
import { logActivity } from "../utils/logActivity.js";

// registerUserService
//  ├─ ensureUserDoesNotExist
//  ├─ registerInvitedUser
//  │    ├─ validateInvitePayload
//  │    └─ markInviteUsed
//  ├─ registerOwnerWithOrganization
//  └─ handlePostRegistration

/**
 * Main service: orchestrates registration flow
 */
export async function registerUserService(input) {
  const { email, inviteToken } = input;

  await ensureUserDoesNotExist(email);

  // Use MongoDB transaction to ensure atomicity of registration and invite consumption
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let result;

    if (inviteToken) {
      result = await registerInvitedUser(input, session);
    } else {
      result = await registerOwnerWithOrganization(input, session);
    }

    await session.commitTransaction();
    session.endSession();

    await handlePostRegistration(result, inviteToken);

    return {
      user: result.user,
      organization: result.organization,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

/**
 * Ensure email is not already registered
 */
async function ensureUserDoesNotExist(email) {
  const existing = await User.findOne({ email }).lean();

  if (existing) {
    throw new AppError("User already exists.", 409);
  }
}

/**
 * Flow: User joins via invite
 */
async function registerInvitedUser(input, session) {
  const { name, email, password, inviteToken } = input;

  const payload = verifyInviteToken(inviteToken);

  const invitedOrgId = payload.orgId;
  const invitedEmail = payload.email;
  const role = payload.role || "member";

  validateInvitePayload(invitedOrgId, invitedEmail, email);

  const organization =
    await Organization.findById(invitedOrgId).session(session);

  if (!organization) {
    throw new AppError("Organization not found for invite.", 404);
  }

  let user = await User.create(
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

  const inviteDoc = await markInviteUsed(inviteToken, session);

  return {
    user,
    organization,
    acceptedInviteId: inviteDoc._id,
  };
}

/**
 * Flow: First user creates organization
 */
async function registerOwnerWithOrganization(input, session) {
  const { name, email, password, orgName, orgSlug } = input;

  if (!orgName || !orgSlug) {
    throw new AppError(
      "Organization name and workspace URL are required.",
      400,
    );
  }

  const orgExists = await Organization.findOne({ slug: orgSlug }).session(
    session,
  );

  if (orgExists) {
    throw new AppError("Workspace URL is already taken.", 409);
  }

  const userId = new mongoose.Types.ObjectId();
  const orgId = new mongoose.Types.ObjectId();

  let organization = await Organization.create(
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

  let user = await User.create(
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

  return {
    user,
    organization,
  };
}

/**
 * Validate invite token payload
 */
function validateInvitePayload(invitedOrgId, invitedEmail, email) {
  if (!invitedOrgId) {
    throw new AppError("Invite token is missing org info.", 401);
  }

  if (invitedEmail && invitedEmail.toLowerCase() !== email.toLowerCase()) {
    throw new AppError("Invite token does not match this email.", 403);
  }
}

/**
 * Mark invite as used
 */
async function markInviteUsed(inviteToken, session) {
  // Atomically find the invite by token and mark it as used if it's valid and unused
  const inviteDoc = await Invite.findOneAndUpdate(
    { token: inviteToken, used: false },
    { used: true },
    { session, new: true },
  );

  if (!inviteDoc) {
    throw new AppError("Invalid or already-used invitation.", 400);
  }

  return inviteDoc;
}

/**
 * Post-registration side effects
 */
async function handlePostRegistration(result, inviteToken) {
  if (!inviteToken) return;

  // Only proceed if the user registered through invitation
  const { user, organization, acceptedInviteId } = result;

  if (!user || !organization) return;

  await logActivity({
    req: {
      user: {
        _id: user._id,
        organization: organization._id,
      },
    },
    action: "invite.accepted",
    entity: "invite",
    entityId: acceptedInviteId || "invite-token-flow",
    meta: {
      invitedUserId: user._id,
      role: user.role,
    },
  });
}

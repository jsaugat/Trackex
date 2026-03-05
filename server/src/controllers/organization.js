import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Revenue from "../models/Revenue.js";
import Expense from "../models/Expense.js";
import Invite from "../models/Invite.js";
import { updateOrganizationSchema } from "../schemas/organization.schema.js";

const getMyOrganization = asyncHandler(async (req, res) => {
  const org = await Organization.findById(req.user.organization).lean(); // lean returns a plain JS object instead of a Mongoose document, which is more efficient for read-only operations
  if (!org) {
    throw new AppError("Organization not found.", 404);
  }

  // Only the organization owner can access this page
  if (org.owner.toString() !== req.user._id.toString()) {
    throw new AppError(
      "Only the organization owner can access this page.",
      403,
    );
  }

  const owner = await User.findById(org.owner).select("name email role").lean();
  if (!owner) {
    throw new AppError("Organization owner not found.", 404);
  }

  res.status(200).json({
    _id: org._id,
    name: org.name,
    slug: org.slug,
    owner: {
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
    },
  });
});

const updateMyOrganization = asyncHandler(async (req, res) => {
  const { name, slug } = updateOrganizationSchema.parse(req.body);

  // Find the organization associated with the authenticated user
  const org = await Organization.findById(req.user.organization);
  if (!org) {
    throw new AppError("Organization not found.", 404);
  }
  console.log("Organization found :: ", {
    reqUser: req.user,
    org: org,
  });

  // Only the organization owner can update this page
  if (org.owner.toString() !== req.user._id.toString()) {
    throw new AppError(
      "Only the organization owner can update this page.",
      403,
    );
  }

  if (slug && slug !== org.slug) {
    const slugExists = await Organization.findOne({ slug }).lean();
    if (slugExists) {
      throw new AppError("Workspace URL is already taken.", 409);
    }
  }

  org.name = name ?? org.name;
  org.slug = slug ?? org.slug;
  const updatedOrg = await org.save();

  res.status(200).json({
    _id: updatedOrg._id,
    name: updatedOrg.name,
    slug: updatedOrg.slug,
  });
});

const deleteMyOrganization = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  const requesterId = req.user._id;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const org = await Organization.findById(organizationId).session(session);
      if (!org) {
        throw new AppError("Organization not found.", 404);
      }

      if (org.owner.toString() !== requesterId.toString()) {
        throw new AppError(
          "Only the organization owner can delete this workspace.",
          403,
        );
      }

      await Promise.all([
        Category.deleteMany({ organization: organizationId }).session(session),
        Revenue.deleteMany({ organization: organizationId }).session(session),
        Expense.deleteMany({ organization: organizationId }).session(session),
        Invite.deleteMany({ organization: organizationId }).session(session),
        User.deleteMany({ organization: organizationId }).session(session),
      ]);

      await Organization.deleteOne({ _id: organizationId }).session(session);
    });

    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(),
    });

    res.status(200).json({ message: "Workspace deleted successfully." });
  } finally {
    session.endSession();
  }
});

export { getMyOrganization, updateMyOrganization, deleteMyOrganization };

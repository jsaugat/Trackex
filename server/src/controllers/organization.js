import asyncHandler from "express-async-handler";
import AppError from "../utils/appError.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
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

export { getMyOrganization, updateMyOrganization };

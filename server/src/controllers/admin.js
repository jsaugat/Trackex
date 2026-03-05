import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import AppError from "../utils/appError.js";
import { logActivity } from "../utils/logActivity.js";

//? GET all users in the same organization
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ organization: req.user.organization });
  res.status(200).json(users);
});

//? DELETE a user
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOneAndDelete({
    _id: req.params.id,
    organization: req.user.organization, // Ensure the user belongs to the same organization
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res
    .status(200)
    .json({ message: user.name + " has been deleted", data: user });
});

//? UPDATE a user
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    organization: req.user.organization, // Ensure the user belongs to the same organization
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Extract new values and perform role-based checks
  const { name: newName, email: newEmail, role: newRole } = req.body;
  const oldRole = user.role;

  // The user performing the update
  const actorRole = req.user?.role;

  const allowedRoles = ["owner", "manager", "member"];
  const targetIsOwner = oldRole === "owner";

  // Prevent managers from modifying the owner account or changing roles to owner
  if (targetIsOwner && actorRole === "manager") {
    throw new AppError("Managers cannot modify the owner account.", 403);
  }

  // Only allow valid role changes and prevent changing the owner role
  if (newRole !== undefined) {
    if (!allowedRoles.includes(newRole)) {
      throw new AppError("Invalid role.", 400);
    }

    if (targetIsOwner) {
      throw new AppError("Owner role cannot be changed.", 403);
    }

    if (actorRole === "manager" && newRole === "owner") {
      throw new AppError("Managers cannot promote users to owner.", 403);
    }
  }

  user.name = newName || user.name;
  user.email = newEmail || user.email;
  user.role = newRole === undefined ? user.role : newRole;

  const updatedUser = await user.save();

  // IF role changed, log the activity
  if (newRole !== undefined && oldRole !== updatedUser.role) {
    await logActivity({
      req,
      action: "user.role_changed",
      entity: "user",
      entityId: updatedUser._id,
      meta: {
        fromRole: oldRole,
        toRole: updatedUser.role,
        targetUserId: updatedUser._id,
      },
    });
  }

  res.status(200).json(updatedUser);
});

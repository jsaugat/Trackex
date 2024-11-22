import User from "../models/User.js";
import asyncHandler from "express-async-handler";

//? GET all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

//? DELETE a user
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res
    .status(200)
    .json({ message: user.name + " has been deleted", data: user });
});

//? UPDATE a user
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { name: newName, email: newEmail, isAdmin: newIsAdmin } = req.body;

  console.log("newIsAdmin : ", newIsAdmin);

  user.name = newName || user.name; 
  user.email = newEmail || user.email;
  // boolean is taken care of this way
  user.isAdmin = newIsAdmin === undefined ? user.isAdmin : newIsAdmin;

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

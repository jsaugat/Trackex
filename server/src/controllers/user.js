import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import generateToken from "../utils/generateToken.js";
import validator from "validator";
import { throwError } from "../helpers/throwError.js";

/**
 *  @desc    Auth user & get token
 *  @route   POST /api/auth/login
 *  @access  Public
 */
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //? Step 1: Find user and populate organization
  const user = await User.findOne({ email }).populate("organization");

  //? Step 2: If user is found and password matches.
  if (user && (await user.passwordMatches(password))) {
    const token = generateToken(res, user._id); // generate jwt using the _id and set a http cookie using it

    const org = user.organization;

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: org
        ? {
            _id: org._id,
            name: org.name,
            slug: org.slug,
          }
        : undefined,
      token,
    });
  } else {
    res.status(401);
    throw Error("Invalid email or password");
  }
});

/**
 * @desc    Register a new user and organization
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, orgName, orgSlug } = req.body;

  // Validate user inputs
  if (!name || !email || !password || !orgName || !orgSlug)
    throwError("Please fill in all fields.");
  if (!validator.isEmail(email)) throwError("Invalid email.");
  if (!validator.isStrongPassword(password))
    throwError("Please enter a strong password.");

  //! If user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  //! If organization slug already exists
  const orgExists = await Organization.findOne({ slug: orgSlug });
  if (orgExists) {
    res.status(400);
    throw new Error("Workspace URL is already taken.");
  }

  // Pre-generate IDs to link User and Organization bidirectionally
  const userId = new mongoose.Types.ObjectId();
  const orgId = new mongoose.Types.ObjectId();

  const organization = new Organization({
    _id: orgId,
    name: orgName,
    slug: orgSlug,
    owner: userId,
  });

  const user = new User({
    _id: userId,
    name,
    email,
    password,
    role: "owner",
    organization: orgId,
  });

  await organization.save();
  await user.save();

  //? if user and org are successfully created
  if (user && organization) {
    // generate jwt for the created user and set a cookie using it
    const token = generateToken(res, user._id);
    // send json response with user data
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: {
        _id: organization._id,
        name: organization.name,
        slug: organization.slug,
      },
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logoutUser = asyncHandler(async (req, res, next) => {
  // alternative : res.clearCookie('jwt')
  //? Clear the authentication http-cookie that we named "jwt"
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(),
  });
  res.status(200).json({ message: "User logged out" });
});

/**
 * @desc    Get user profile
 * @route   POST /api/auth/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("organization");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const org = user.organization;
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization: org
      ? {
          _id: org._id,
          name: org.name,
          slug: org.slug,
        }
      : undefined,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res, next) => {
  // req.user doesn't include password property so following approach is better for updateUserProfile -->
  const { _id } = req.user; // from shield from user controller
  const { name, email, password } = req.body; // from react form
  const user = await User.findById(_id).populate("organization");
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      user.password = password;
    }
    const updatedUser = await user.save();

    const org = updatedUser.organization;
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      organization: org
        ? {
            _id: org._id,
            name: org.name,
            slug: org.slug,
          }
        : undefined,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};

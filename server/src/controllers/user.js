import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { registerUserService } from "../services/auth.service.js";
import { registerSchema } from "../schemas/auth.schema.js";

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
export const registerUser = asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);

  // Enforce either inviteToken OR org fields
  const hasInvite = !!input.inviteToken;
  const hasOrgFields = !!input.orgName && !!input.orgSlug;

  // User must register EITHER via invite OR by creating a new organization.
  // If neither is provided, we cannot determine the registration flow.
  if (!hasInvite && !hasOrgFields) {
    throw new AppError("Provide inviteToken OR orgName + orgSlug.", 400);
  }

  // Prevent conflicting input: user cannot both accept an invite
  // AND create a new organization in the same request.
  if (hasInvite && hasOrgFields) {
    throw new AppError(
      "Provide either inviteToken OR orgName + orgSlug, not both.",
      400,
    );
  }

  const { user, organization } = await registerUserService(input);

  const token = generateToken(res, user._id);

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

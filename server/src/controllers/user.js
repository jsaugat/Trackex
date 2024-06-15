import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Token from "../models/Token.js";
import generateToken from "../utils/generateToken.js";
import validator from "validator";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js"; // Import sendEmail function

/**
 *  @desc    Auth user & get token
 *  @route   POST /api/auth/login
 *  @access  Public
 */
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //? Step 1: Find user
  const user = await User.findOne({ email });

  //? Step 2: If user is found and password matches.
  if (user && (await user.passwordMatches(password))) {
    const token = generateToken(res, user._id); // generate jwt using the _id and set a http cookie using it
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } else {
    res.status(401);
    throw Error("Invalid email or password");
  }
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (!validator.isEmail(email)) {
    throw Error("Invalid email.");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Please enter a strong password.");
  }

  //! if user already exists
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin: false,
  });

  //? if user is successfully created
  if (user) {
    // Generate a verification token for this user
    const token = await Token.create({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    console.log("Verification token", token)

    // Send verification email
    const verificationUrl = `http://${process.env.BASE_URL}/api/auth/confirmation/${token.token}`;
    const message = `Hello ${user.name},\n\nPlease verify your account by clicking the link: \n${verificationUrl}\n\nThank You!\n`;

    try {
      await sendEmail(user.email, "TRACKEX Authentication", message);
      res.status(200).json(`A verification email has been sent to ${user.email}. It will expire after one hour. If you do not receive the verification email, click on resend token.`);
    } catch (error) {
      res.status(500).json({ message: "Technical Issue! Please click on resend to verify your email." });
    }
  } else {
    res.status(400).throw(new Error("Invalid user data"));
  }
});

/**
 * @desc    Confirm email
 * @route   GET /api/auth/confirmation/:token
 * @access  Public
 */
const confirmEmail = asyncHandler(async (req, res, next) => {
  try {
    const token = await Token.findOne({ token: req.params.token });
    alert("TOKEN: %s", token)
    if (!token) {
      return res.status(400).json({ message: "Your verification link may have expired. Please click on resend to verify your email." });
    }

    const user = await User.findOne({ _id: token.userId });
    if (!user) {
      return res.status(401).json({ message: "We were unable to find a user for this verification. Please SignUp!" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "User has been already verified. Please Login." });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json("Your account has been successfully verified.");
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  const { _id, name, email } = req.user;
  res.status(200).json({ _id, name, email });
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
  const user = await User.findById(_id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      user.password = password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
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
  confirmEmail,
};

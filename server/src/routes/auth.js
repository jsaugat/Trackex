import express from "express";
import {
  forgotPassword,
  loginUser,
  guestLogin,
  verifyLoginOtp,
  resetPassword,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.js";
// route protector
import { validateToken } from "../middlewares/validateToken.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify-otp", verifyLoginOtp);
router.post("/guest", guestLogin);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(validateToken, getUserProfile)
  .put(validateToken, updateUserProfile);

export default router;

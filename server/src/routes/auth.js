import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.js";
// route protector
import { validateToken } from "../middlewares/validateToken.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(validateToken, getUserProfile)
  .put(validateToken, updateUserProfile);

export default router;

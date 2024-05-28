import express from "express";
import { getAllUsers, deleteUser, updateUser } from "../controllers/admin.js";
import { validateToken, verifyAdmin } from "../middlewares/validateToken.js";

const router = express.Router();

router.route("/users").get(validateToken, verifyAdmin, getAllUsers);
router
  .route("/users/:id")
  .delete(validateToken, verifyAdmin, deleteUser)
  .put(validateToken, verifyAdmin, updateUser);

export default router;

import express from "express";
import {
  getMyOrganization,
  updateMyOrganization,
  deleteMyOrganization,
} from "../controllers/organization.js";
import { validateToken, verifyOwner } from "../middlewares/validateToken.js";

const router = express.Router();

router
  .route("/me")
  .get(validateToken, verifyOwner, getMyOrganization)
  .put(validateToken, verifyOwner, updateMyOrganization)
  .delete(validateToken, verifyOwner, deleteMyOrganization);

export default router;

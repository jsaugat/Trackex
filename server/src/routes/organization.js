import express from "express";
import {
  getMyOrganization,
  updateMyOrganization,
} from "../controllers/organization.js";
import { validateToken, verifyOwner } from "../middlewares/validateToken.js";

const router = express.Router();

router
  .route("/me")
  .get(validateToken, verifyOwner, getMyOrganization)
  .put(validateToken, verifyOwner, updateMyOrganization);

export default router;

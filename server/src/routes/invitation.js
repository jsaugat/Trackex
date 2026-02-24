import express from "express";
import {
  createInvitation,
  validateInvitation,
  acceptInvitation,
  revokeInvitation,
} from "../controllers/invitation.js";
import { validateToken } from "../middlewares/validateToken.js";

const router = express.Router();

// Create invitation (requires auth — owner/manager only)
router.post("/", validateToken, createInvitation);

// Validate invitation (public — invitee checks before rendering form)
router.get("/:token", validateInvitation);

// Accept invitation (public — invitee registers)
router.post("/:token/accept", acceptInvitation);

// Revoke invitation (requires auth — owner/manager only)
router.delete("/:token", validateToken, revokeInvitation);

export default router;

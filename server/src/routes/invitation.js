import express from "express";
import {
  createInvitation,
  validateInvitation,
  acceptInvitation,
  revokeInvitation,
} from "../controllers/invitation.js";
import { validateToken } from "../middlewares/validateToken.js";
import { perUserRateLimit } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Rate limit: 1 invitation per 10 seconds per user
const inviteRateLimit = perUserRateLimit({
  cooldownMs: 10_000,
  message: "Please wait {retryAfter} second(s) before creating another invitation.",
});

// Create invitation (requires auth — owner/manager only)
router.post("/", validateToken, inviteRateLimit, createInvitation);

// Validate invitation (public — invitee checks before rendering form)
router.get("/:token", validateInvitation);

// Accept invitation (public — invitee registers)
router.post("/:token/accept", acceptInvitation);

// Revoke invitation (requires auth — owner/manager only)
router.delete("/:token", validateToken, revokeInvitation);

export default router;

import express from "express";
import { getAuditLogs } from "../controllers/auditLogs.js";
import { validateToken, verifyAdmin } from "../middlewares/validateToken.js";

const router = express.Router();

router.get("/", validateToken, verifyAdmin, getAuditLogs);

export default router;

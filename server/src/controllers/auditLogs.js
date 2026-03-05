import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import AuditLog from "../models/AuditLog.js";
import AppError from "../utils/appError.js";
/**
 * Allowed audit log actions
 * Used to validate query filters
 */
const ALLOWED_ACTIONS = new Set([
  "transaction.created",
  "transaction.updated",
  "transaction.deleted",
  "user.role_changed",
  "invite.sent",
  "invite.accepted",
  "invite.revoked",
]);

/**
 * Allowed entity types for filtering
 */
const ALLOWED_ENTITIES = new Set(["expense", "revenue", "user", "invite"]);

/**
 * Parse and normalize pagination parameters
 */
function parsePagination(query) {
  const rawPage = Number(query.page ?? 1);
  const rawLimit = Number(query.limit ?? 20);

  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  // Hard cap limit to prevent abuse
  const limit =
    Number.isNaN(rawLimit) || rawLimit < 1 ? 20 : Math.min(rawLimit, 100);

  // Calculate how many documents to skip based on current page and limit
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Validate and parse a date string
 */
function parseDate(value, label) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`Invalid ${label} date`, 400);
  }

  return date;
}

/**
 * Build MongoDB query object from request filters
 */
function buildAuditLogQuery(queryParams, organizationId) {
  const query = { organization: organizationId };

  /**
   * Filter by action
   */
  if (queryParams.action) {
    if (!ALLOWED_ACTIONS.has(queryParams.action)) {
      throw new AppError("Invalid action filter", 400);
    }
    query.action = queryParams.action;
  }

  /**
   * Filter by entity
   */
  if (queryParams.entity) {
    if (!ALLOWED_ENTITIES.has(queryParams.entity)) {
      throw new AppError("Invalid entity filter", 400);
    }
    query.entity = queryParams.entity;
  }

  /**
   * Filter by actor ID
   */
  if (queryParams.actorId) {
    if (!mongoose.Types.ObjectId.isValid(queryParams.actorId)) {
      throw new AppError("Invalid actorId filter", 400);
    }

    query.actor = queryParams.actorId;
  }

  /**
   * Filter by date range
   */
  if (queryParams.from || queryParams.to) {
    query.createdAt = {};

    if (queryParams.from) {
      query.createdAt.$gte = parseDate(queryParams.from, "from");
    }

    if (queryParams.to) {
      query.createdAt.$lte = parseDate(queryParams.to, "to");
    }
  }

  return query;
}

/**
 * GET /audit-logs
 *
 * Returns paginated audit logs for the current organization
 *
 * Query filters:
 * - action
 * - entity
 * - actorId
 * - from (date)
 * - to (date)
 * - page
 * - limit
 */
export const getAuditLogs = asyncHandler(async (req, res) => {
  const organizationId = req.user?.organization;

  if (!organizationId) {
    throw new AppError("Unable to determine organization context", 400);
  }

  // Parse pagination
  const { page, limit, skip } = parsePagination(req.query);

  // Build Mongo query
  const query = buildAuditLogQuery(req.query, organizationId);

  // Fetch logs and total count in parallel
  const [items, total] = await Promise.all([
    AuditLog.find(query)
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    AuditLog.countDocuments(query),
  ]);

  res.status(200).json({
    items,
    page,
    limit,
    total,
    hasMore: page * limit < total,
  });
});

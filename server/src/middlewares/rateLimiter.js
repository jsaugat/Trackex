import AppError from "../utils/appError.js";

/**
 * Creates a per-user in-memory rate limiter middleware.
 *
 * @param {object}  options
 * @param {number}  options.cooldownMs    - Minimum interval between requests (ms).
 * @param {string}  options.message       - Error message on 429.
 * @param {number}  [options.cleanupIntervalMs=60000] - How often stale entries are purged.
 * @returns {import("express").RequestHandler}
 */
export function perUserRateLimit({
  cooldownMs,
  message = "Too many requests. Please try again later.",
  cleanupIntervalMs = 60_000,
}) {
  /** @type {Map<string, number>} userId → last request timestamp */
  const timestamps = new Map();

  // Periodic cleanup: remove entries older than cooldownMs to prevent unbounded growth
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, ts] of timestamps) {
      if (now - ts >= cooldownMs) {
        timestamps.delete(key);
      }
    }
  }, cleanupIntervalMs);

  // Allow the Node process to exit even if the timer is still scheduled
  if (cleanupTimer.unref) cleanupTimer.unref();

  /** @type {import("express").RequestHandler} */
  return (req, _res, next) => {
    // req.user is populated by validateToken upstream
    const userId = req.user?._id?.toString();
    if (!userId) return next(); // no authenticated user — skip

    const now = Date.now();
    const lastRequest = timestamps.get(userId);

    if (lastRequest && now - lastRequest < cooldownMs) {
      const retryAfter = Math.ceil(
        (cooldownMs - (now - lastRequest)) / 1000,
      );
      throw new AppError(
        message.replace("{retryAfter}", String(retryAfter)),
        429,
      );
    }

    timestamps.set(userId, now);
    next();
  };
}

import AuditLog from "../models/AuditLog.js";

const REDACTED_KEYS = [
  "password",
  "token",
  "otp",
  "authorization",
  "resetPasswordToken",
  "loginOtpToken",
];

function sanitizeMeta(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeMeta);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((acc, [key, nestedValue]) => {
      const isRedacted = REDACTED_KEYS.some((redactedKey) =>
        key.toLowerCase().includes(redactedKey.toLowerCase()),
      );

      acc[key] = isRedacted ? "[REDACTED]" : sanitizeMeta(nestedValue);
      return acc;
    }, {});
  }

  return value;
}

export async function logActivity({ req, action, entity, entityId, meta = {} }) {
  try {
    const organizationId = req?.user?.organization;
    const actorId = req?.user?._id;

    if (!organizationId || !actorId || !entityId || !action || !entity) {
      return;
    }

    await AuditLog.create({
      organization: organizationId,
      actor: actorId,
      action,
      entity,
      entityId: String(entityId),
      meta: sanitizeMeta(meta),
    });
  } catch (error) {
    console.warn("[AUDIT_LOG_WRITE_FAILED]", error?.message || error);
  }
}

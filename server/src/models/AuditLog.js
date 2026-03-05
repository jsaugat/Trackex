import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "transaction.created",
        "transaction.updated",
        "transaction.deleted",
        "user.role_changed",
        "invite.sent",
        "invite.accepted",
        "invite.revoked",
      ],
      index: true,
    },
    entity: {
      type: String,
      required: true,
      enum: ["expense", "revenue", "user", "invite"],
      index: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

// DB Indexing for faster queries
auditLogSchema.index({ organization: 1, createdAt: -1 });
auditLogSchema.index({ organization: 1, action: 1, createdAt: -1 });
auditLogSchema.index({ organization: 1, entity: 1, createdAt: -1 });

export default mongoose.model("AuditLog", auditLogSchema);

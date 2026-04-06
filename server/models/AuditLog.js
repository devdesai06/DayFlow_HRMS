import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    actorEmail: { type: String, required: true, lowercase: true, trim: true },
    actorRole: { type: String, required: true, trim: true },

    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "BULK_DELETE"],
      required: true,
      index: true,
    },
    entityType: { type: String, required: true, trim: true, index: true },
    entityId: { type: String, required: true, trim: true, index: true },

    before: { type: mongoose.Schema.Types.Mixed, default: null },
    after: { type: mongoose.Schema.Types.Mixed, default: null },
    meta: {
      ip: { type: String, default: "" },
      userAgent: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);


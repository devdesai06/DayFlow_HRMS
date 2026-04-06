import { AuditLog } from "../models/AuditLog.js";

export async function writeAudit({
  req,
  action,
  entityType,
  entityId,
  before,
  after,
}) {
  const actor = req.user;
  await AuditLog.create({
    actorUserId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    action,
    entityType,
    entityId,
    before: before ?? null,
    after: after ?? null,
    meta: {
      ip: req.ip || "",
      userAgent: req.get("user-agent") || "",
    },
  });
}


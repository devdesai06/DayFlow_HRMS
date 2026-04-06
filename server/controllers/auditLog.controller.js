import { asyncWrapper } from "../utils/asyncWrapper.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const listAuditLogs = asyncWrapper(async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 30)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.action) filter.action = req.query.action;
  if (req.query.entityType) filter.entityType = req.query.entityType;
  if (req.query.actorEmail) filter.actorEmail = { $regex: req.query.actorEmail, $options: "i" };

  const [rows, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse({
      message: "Audit logs loaded.",
      data: { rows },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    })
  );
});

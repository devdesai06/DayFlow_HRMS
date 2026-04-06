import mongoose from "mongoose";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Leave } from "../models/Leave.js";
import { Employee } from "../models/Employee.js";
import { diffDaysInclusive, defaultAnnualBalance } from "../services/leaveService.js";
import { writeAudit } from "../services/auditService.js";

function isPrivileged(req) {
  return ["SUPER_ADMIN", "ADMIN", "HR"].includes(req.user.role);
}

function resolveEmployeeIdForApply(req) {
  if (req.user.employeeId) return req.user.employeeId;
  throw new ApiError(400, "This user is not linked to an employee profile");
}

export const listLeaves = asyncWrapper(async (req, res) => {
  const { page, limit, status, employeeId, type, from, to } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;

  if (employeeId) {
    if (!isPrivileged(req) && String(req.user.employeeId) !== String(employeeId)) {
      throw new ApiError(403, "Forbidden");
    }
    filter.employeeId = new mongoose.Types.ObjectId(employeeId);
  } else if (!isPrivileged(req)) {
    filter.employeeId = new mongoose.Types.ObjectId(req.user.employeeId);
  }

  if (from || to) {
    filter.startDate = {};
    if (from) filter.startDate.$gte = new Date(from);
    if (to) filter.startDate.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const [rows, total] = await Promise.all([
    Leave.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Leave.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse({
      message: "Leaves fetched.",
      data: { leaves: rows },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  );
});

export const applyLeave = asyncWrapper(async (req, res) => {
  const employeeId = resolveEmployeeIdForApply(req);
  const employee = await Employee.findById(employeeId).select("_id");
  if (!employee) throw new ApiError(404, "Employee not found");

  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  if (endDate < startDate) throw new ApiError(400, "endDate must be after startDate");

  const days = diffDaysInclusive(startDate, endDate);

  const overlap = await Leave.findOne({
    employeeId,
    status: { $in: ["PENDING", "APPROVED"] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
    ],
  }).select("_id");
  if (overlap) throw new ApiError(409, "Overlapping leave request exists");

  const leave = await Leave.create({
    employeeId,
    type: req.body.type,
    startDate,
    endDate,
    days,
    reason: req.body.reason,
    attachmentUrl: req.body.attachmentUrl,
    status: "PENDING",
  });

  await writeAudit({
    req,
    action: "CREATE",
    entityType: "Leave",
    entityId: String(leave._id),
    before: null,
    after: leave.toObject(),
  });

  res.status(201).json(
    new ApiResponse({
      message: "Leave applied.",
      data: { leave },
    })
  );
});

export const approveLeave = asyncWrapper(async (req, res) => {
  if (!isPrivileged(req)) throw new ApiError(403, "Forbidden");
  const { id } = req.params;

  const before = await Leave.findById(id);
  if (!before) throw new ApiError(404, "Leave not found");
  if (before.status !== "PENDING") throw new ApiError(409, "Leave is not pending");

  before.status = "APPROVED";
  before.decidedByUserId = req.user.id;
  before.decidedAt = new Date();
  before.decisionNote = req.body.note || "";
  await before.save();

  await writeAudit({
    req,
    action: "UPDATE",
    entityType: "Leave",
    entityId: String(before._id),
    before: { status: "PENDING" },
    after: before.toObject(),
  });

  res.status(200).json(new ApiResponse({ message: "Leave approved.", data: { leave: before } }));
});

export const rejectLeave = asyncWrapper(async (req, res) => {
  if (!isPrivileged(req)) throw new ApiError(403, "Forbidden");
  const { id } = req.params;

  const before = await Leave.findById(id);
  if (!before) throw new ApiError(404, "Leave not found");
  if (before.status !== "PENDING") throw new ApiError(409, "Leave is not pending");

  before.status = "REJECTED";
  before.decidedByUserId = req.user.id;
  before.decidedAt = new Date();
  before.decisionNote = req.body.note || "";
  await before.save();

  await writeAudit({
    req,
    action: "UPDATE",
    entityType: "Leave",
    entityId: String(before._id),
    before: { status: "PENDING" },
    after: before.toObject(),
  });

  res.status(200).json(new ApiResponse({ message: "Leave rejected.", data: { leave: before } }));
});

export const getBalance = asyncWrapper(async (req, res) => {
  const employeeId = req.user.employeeId;
  const year = Number(req.query?.year || new Date().getFullYear());
  const annual = defaultAnnualBalance();

  if (!employeeId) {
    return res.status(200).json(
      new ApiResponse({
        message: "No employee profile linked.",
        data: { year, annual, used: {}, remaining: annual },
      })
    );
  }

  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));

  const approved = await Leave.find({
    employeeId,
    status: "APPROVED",
    startDate: { $gte: start, $lt: end },
  }).select("type days");

  const used = approved.reduce((acc, l) => {
    acc[l.type] = (acc[l.type] || 0) + Number(l.days || 0);
    return acc;
  }, {});

  const remaining = {};
  for (const k of Object.keys(annual)) {
    remaining[k] = Math.max(0, Number(annual[k]) - Number(used[k] || 0));
  }

  res.status(200).json(
    new ApiResponse({
      message: "Leave balance fetched.",
      data: { year, annual, used, remaining },
    })
  );
});


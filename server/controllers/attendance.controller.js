import { asyncWrapper } from "../utils/asyncWrapper.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Attendance } from "../models/Attendance.js";
import { Employee } from "../models/Employee.js";
import { writeAudit } from "../services/auditService.js";
import { computeFlags, computeMinutes, dateKeyUTC } from "../services/attendanceService.js";

function resolveEmployeeId(req, providedEmployeeId) {
  const isPrivileged = ["SUPER_ADMIN", "ADMIN", "HR"].includes(req.user.role);
  if (providedEmployeeId && isPrivileged) return providedEmployeeId;
  if (req.user.employeeId) return req.user.employeeId;
  throw new ApiError(400, "employeeId is required for this user");
}

export const checkIn = asyncWrapper(async (req, res) => {
  const employeeId = resolveEmployeeId(req, req.body.employeeId);
  const employee = await Employee.findById(employeeId).select("_id");
  if (!employee) throw new ApiError(404, "Employee not found");

  const now = new Date();
  const dateKey = dateKeyUTC(now);

  const existing = await Attendance.findOne({ employeeId, dateKey });
  if (existing?.checkInAt && !existing?.checkOutAt) {
    throw new ApiError(409, "Already checked in");
  }

  const doc = await Attendance.findOneAndUpdate(
    { employeeId, dateKey },
    { $set: { checkInAt: now, checkOutAt: null, notes: "" } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json(
    new ApiResponse({
      message: "Checked in.",
      data: { attendance: doc },
    })
  );
});

export const checkOut = asyncWrapper(async (req, res) => {
  const employeeId = resolveEmployeeId(req, req.body.employeeId);
  const now = new Date();
  const dateKey = dateKeyUTC(now);

  const doc = await Attendance.findOne({ employeeId, dateKey });
  if (!doc || !doc.checkInAt) throw new ApiError(409, "No active check-in");
  if (doc.checkOutAt) throw new ApiError(409, "Already checked out");

  const checkOutAt = now;
  const totalMinutes = computeMinutes(doc.checkInAt, checkOutAt);
  const flags = computeFlags({ checkInAt: doc.checkInAt, checkOutAt });

  doc.checkOutAt = checkOutAt;
  doc.totalMinutes = totalMinutes;
  doc.flags = flags;
  await doc.save();

  res.status(200).json(
    new ApiResponse({
      message: "Checked out.",
      data: { attendance: doc },
    })
  );
});

export const monthly = asyncWrapper(async (req, res) => {
  const { employeeId } = req.params;
  const { year, month } = req.query;

  const isSelf = req.user.employeeId && String(req.user.employeeId) === String(employeeId);
  const isPrivileged = ["SUPER_ADMIN", "ADMIN", "HR"].includes(req.user.role);
  if (!isSelf && !isPrivileged) throw new ApiError(403, "Forbidden");

  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));

  const rows = await Attendance.find({
    employeeId,
    createdAt: { $gte: start, $lt: end },
  }).sort({ dateKey: 1 });

  const summary = rows.reduce(
    (acc, r) => {
      acc.days += 1;
      acc.totalMinutes += Number(r.totalMinutes || 0);
      if (r.flags?.late) acc.lateDays += 1;
      if (r.flags?.earlyLeave) acc.earlyLeaveDays += 1;
      if (r.flags?.overtime) acc.overtimeDays += 1;
      return acc;
    },
    { days: 0, totalMinutes: 0, lateDays: 0, earlyLeaveDays: 0, overtimeDays: 0 }
  );

  res.status(200).json(
    new ApiResponse({
      message: "Monthly attendance fetched.",
      data: { rows, summary, year, month },
    })
  );
});

export const adminEdit = asyncWrapper(async (req, res) => {
  const isPrivileged = ["SUPER_ADMIN", "ADMIN", "HR"].includes(req.user.role);
  if (!isPrivileged) throw new ApiError(403, "Forbidden");

  const { employeeId, dateKey } = req.params;
  const before = await Attendance.findOne({ employeeId, dateKey });
  if (!before) throw new ApiError(404, "Attendance not found");

  const nextCheckIn = req.body.checkInAt ? new Date(req.body.checkInAt) : before.checkInAt;
  const nextCheckOut =
    req.body.checkOutAt === null
      ? null
      : req.body.checkOutAt
        ? new Date(req.body.checkOutAt)
        : before.checkOutAt;

  if (nextCheckOut && nextCheckIn && nextCheckOut < nextCheckIn) {
    throw new ApiError(400, "checkOutAt must be after checkInAt");
  }

  const totalMinutes = nextCheckOut ? computeMinutes(nextCheckIn, nextCheckOut) : 0;
  const flags = computeFlags({ checkInAt: nextCheckIn, checkOutAt: nextCheckOut });

  const after = await Attendance.findOneAndUpdate(
    { employeeId, dateKey },
    {
      $set: {
        checkInAt: nextCheckIn,
        checkOutAt: nextCheckOut,
        totalMinutes,
        flags,
        notes: req.body.notes ?? before.notes,
        editedByUserId: req.user.id,
        editedAt: new Date(),
      },
    },
    { new: true }
  );

  await writeAudit({
    req,
    action: "UPDATE",
    entityType: "Attendance",
    entityId: `${employeeId}:${dateKey}`,
    before: before.toObject(),
    after: after.toObject(),
  });

  res.status(200).json(
    new ApiResponse({
      message: "Attendance updated.",
      data: { attendance: after },
    })
  );
});


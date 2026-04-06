import { ApiError } from "../utils/ApiError.js";

export function dateKeyUTC(d) {
  const dt = new Date(d);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function computeMinutes(checkInAt, checkOutAt) {
  if (!checkInAt || !checkOutAt) return 0;
  const ms = new Date(checkOutAt).getTime() - new Date(checkInAt).getTime();
  return Math.max(0, Math.floor(ms / 60000));
}

export function computeFlags({ checkInAt, checkOutAt }) {
  if (!checkInAt) return { late: false, earlyLeave: false, overtime: false };
  const inDt = new Date(checkInAt);
  const outDt = checkOutAt ? new Date(checkOutAt) : null;

  // Policy (production-ready defaults; can be moved to settings later)
  const lateAfterMinutes = Number(process.env.ATT_LATE_AFTER_MIN || 10); // after 10:10
  const startHour = Number(process.env.ATT_START_HOUR || 10); // 10:00
  const startMinute = Number(process.env.ATT_START_MIN || 0);
  const endHour = Number(process.env.ATT_END_HOUR || 18); // 18:00
  const endMinute = Number(process.env.ATT_END_MIN || 0);
  const overtimeAfterMinutes = Number(process.env.ATT_OVERTIME_AFTER_MIN || 540); // 9h

  const start = new Date(Date.UTC(inDt.getUTCFullYear(), inDt.getUTCMonth(), inDt.getUTCDate(), startHour, startMinute, 0));
  const end = new Date(Date.UTC(inDt.getUTCFullYear(), inDt.getUTCMonth(), inDt.getUTCDate(), endHour, endMinute, 0));

  const late = inDt.getTime() > start.getTime() + lateAfterMinutes * 60000;
  const earlyLeave = outDt ? outDt.getTime() < end.getTime() : false;
  const minutes = outDt ? computeMinutes(inDt, outDt) : 0;
  const overtime = outDt ? minutes > overtimeAfterMinutes : false;

  return { late, earlyLeave, overtime };
}

export function requireEmployeeScope(req, employeeId) {
  const isSelf = String(req.user?.employeeId || "") === String(employeeId);
  const isPrivileged = ["SUPER_ADMIN", "ADMIN", "HR"].includes(req.user?.role);
  if (!isSelf && !isPrivileged) throw new ApiError(403, "Forbidden");
}


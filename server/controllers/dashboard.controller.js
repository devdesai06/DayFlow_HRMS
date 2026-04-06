import { asyncWrapper } from "../utils/asyncWrapper.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Employee } from "../models/Employee.js";
import { Leave } from "../models/Leave.js";
import { Attendance } from "../models/Attendance.js";
import { Payroll } from "../models/Payroll.js";

function isRole(req, roles) {
  return roles.includes(req.user.role);
}

export const adminDash = asyncWrapper(async (req, res) => {
  if (!isRole(req, ["SUPER_ADMIN", "ADMIN"])) throw new ApiError(403, "Forbidden");

  const [headcount, pendingApprovals, payrollCount] = await Promise.all([
    Employee.countDocuments({ status: "ACTIVE" }),
    Leave.countDocuments({ status: "PENDING" }),
    Payroll.countDocuments({}),
  ]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const liveAttendance = await Attendance.countDocuments({ dateKey: todayKey, checkInAt: { $ne: null } });

  res.status(200).json(
    new ApiResponse({
      message: "Admin dashboard loaded.",
      data: {
        headcount,
        pendingApprovals,
        liveAttendance,
        payrollRuns: payrollCount,
      },
    })
  );
});

export const hrDash = asyncWrapper(async (req, res) => {
  if (!isRole(req, ["SUPER_ADMIN", "ADMIN", "HR"])) throw new ApiError(403, "Forbidden");

  const [pendingLeaves, activeEmployees] = await Promise.all([
    Leave.find({ status: "PENDING" }).sort({ createdAt: -1 }).limit(10),
    Employee.countDocuments({ status: "ACTIVE" }),
  ]);

  res.status(200).json(
    new ApiResponse({
      message: "HR dashboard loaded.",
      data: {
        activeEmployees,
        pendingLeaves,
      },
    })
  );
});

export const employeeDash = asyncWrapper(async (req, res) => {
  const empId = req.user.employeeId;
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  if (!empId) {
    return res.status(200).json(
      new ApiResponse({
        message: "No employee profile linked.",
        data: {
          year,
          month,
          recentLeaves: [],
          recentPayroll: [],
        },
      })
    );
  }

  const [recentLeaves, recentPayroll] = await Promise.all([
    Leave.find({ employeeId: empId }).sort({ createdAt: -1 }).limit(5),
    Payroll.find({ employeeId: empId }).sort({ createdAt: -1 }).limit(5),
  ]);

  res.status(200).json(
    new ApiResponse({
      message: "Employee dashboard loaded.",
      data: {
        year,
        month,
        recentLeaves,
        recentPayroll,
      },
    })
  );
});


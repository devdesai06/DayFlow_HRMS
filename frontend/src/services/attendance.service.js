import { USE_MOCK } from "../config/env";
import {
  checkIn as checkInApi,
  checkOut as checkOutApi,
  getMyAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
} from "../api/attendance.api";

/**
 * Employee check-in
 */
export const checkInService = async () => {
  try {
    if (USE_MOCK) {
      return { status: "PRESENT", check_in: "09:30" };
    }

    const res = await checkInApi();
    return res.data;
  } catch (err) {
    console.error("Check-in failed", err);
    throw err;
  }
};

/**
 * Employee check-out
 */
export const checkOutService = async () => {
  try {
    if (USE_MOCK) {
      return { status: "COMPLETED", check_out: "18:30" };
    }

    const res = await checkOutApi();
    return res.data;
  } catch (err) {
    console.error("Check-out failed", err);
    throw err;
  }
};

/**
 * Logged-in employee attendance
 */
export const fetchMyAttendance = async () => {
  try {
    if (USE_MOCK) return [];

    const res = await getMyAttendance();
    return res.data;
  } catch (err) {
    console.error("Fetch my attendance failed", err);
    throw err;
  }
};

/**
 * Admin / HR: all attendance
 */
export const fetchAllAttendance = async () => {
  try {
    const res = await getAllAttendance();
    return res.data;
  } catch (err) {
    console.error("Fetch all attendance failed", err);
    throw err;
  }
};

/**
 * Admin / HR: attendance of one employee
 */
export const fetchAttendanceByEmployee = async (employeeId) => {
  try {
    if (!employeeId) {
      throw new Error("Employee ID is required");
    }

    const res = await getAttendanceByEmployee(employeeId);
    return res.data;
  } catch (err) {
    console.error("Fetch employee attendance failed", err);
    throw err;
  }
};

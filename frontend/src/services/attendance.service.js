import {
  checkIn as checkInApi,
  checkOut as checkOutApi,
  getMyAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
} from "../api/attendance.api";

/**
 * Normalize backend responses
 */
const resolveData = (res) => {
  if (!res) throw new Error("No response from server");
  return res.data ?? res;
};

/**
 * Employee check-in
 * POST /attendance/check-in
 */
export const checkInService = async () => {
  try {
    const res = await checkInApi();
    return resolveData(res);
  } catch (err) {
    console.error("❌ Check-in failed:", err);
    throw err;
  }
};

/**
 * Employee check-out
 * POST /attendance/check-out
 */
export const checkOutService = async () => {
  try {
    const res = await checkOutApi();
    return resolveData(res);
  } catch (err) {
    console.error("❌ Check-out failed:", err);
    throw err;
  }
};

/**
 * Logged-in employee attendance
 * GET /attendance/me
 */
export const fetchMyAttendance = async () => {
  try {
    const res = await getMyAttendance();
    return resolveData(res);
  } catch (err) {
    console.error("❌ Fetch my attendance failed:", err);
    throw err;
  }
};

/**
 * Admin / HR: all attendance
 * GET /attendance
 */
export const fetchAllAttendance = async () => {
  try {
    const res = await getAllAttendance();
    return resolveData(res);
  } catch (err) {
    console.error("❌ Fetch all attendance failed:", err);
    throw err;
  }
};

/**
 * Admin / HR: attendance of one employee
 * GET /attendance/:employeeId
 */
export const fetchAttendanceByEmployee = async (employeeId) => {
  if (!employeeId) {
    throw new Error("Employee ID is required");
  }

  try {
    const res = await getAttendanceByEmployee(employeeId);
    return resolveData(res);
  } catch (err) {
    console.error("❌ Fetch employee attendance failed:", err);
    throw err;
  }
};

/**
 * Helper: get today's attendance record
 * (used for UI button logic)
 */
export const getTodayAttendance = (attendanceList = []) => {
  const today = new Date().toISOString().split("T")[0];
  return attendanceList.find(
    (a) => a.attendance_date?.startsWith(today)
  );
};

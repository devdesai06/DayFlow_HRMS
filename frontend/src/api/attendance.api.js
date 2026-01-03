import api from "./axios";

export const checkIn = () =>
  api.post("/attendance/check-in");

export const checkOut = () =>
  api.post("/attendance/check-out");

export const getMyAttendance = () =>
  api.get("/attendance/me");

export const getAllAttendance = () =>
  api.get("/attendance");

export const getAttendanceByEmployee = (employeeId) =>
  api.get(`/attendance/${employeeId}`);

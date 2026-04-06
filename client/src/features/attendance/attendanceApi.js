import { api } from "../../services/api.js";

export async function checkIn(employeeId) {
  const res = await api.post("/api/attendance/checkin", employeeId ? { employeeId } : {});
  return res.data;
}

export async function checkOut(employeeId) {
  const res = await api.post("/api/attendance/checkout", employeeId ? { employeeId } : {});
  return res.data;
}

export async function fetchMonthly(employeeId, { year, month }) {
  const res = await api.get(`/api/attendance/${employeeId}/monthly`, {
    params: { year, month },
  });
  return res.data;
}


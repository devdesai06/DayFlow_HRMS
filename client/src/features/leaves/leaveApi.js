import { api } from "../../services/api.js";

export async function fetchLeaves(params) {
  const res = await api.get("/api/leaves", { params });
  return res.data;
}

export async function applyLeave(payload) {
  const res = await api.post("/api/leaves", payload);
  return res.data;
}

export async function approveLeave(id, note) {
  const res = await api.patch(`/api/leaves/${id}/approve`, { note });
  return res.data;
}

export async function rejectLeave(id, note) {
  const res = await api.patch(`/api/leaves/${id}/reject`, { note });
  return res.data;
}

export async function fetchLeaveBalance(year) {
  const res = await api.get("/api/leaves/balance", { params: { year } });
  return res.data;
}


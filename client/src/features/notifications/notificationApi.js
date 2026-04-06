import { api } from "../../services/api.js";

export async function fetchNotifications(params) {
  const res = await api.get("/api/notifications", { params });
  return res.data;
}

export async function markNotificationRead(id) {
  const res = await api.patch(`/api/notifications/${id}/read`);
  return res.data;
}


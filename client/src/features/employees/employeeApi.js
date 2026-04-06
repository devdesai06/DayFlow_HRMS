import { api } from "../../services/api.js";

export async function fetchEmployees(params) {
  const res = await api.get("/api/employees", { params });
  return res.data;
}

export async function fetchEmployee(id) {
  const res = await api.get(`/api/employees/${id}`);
  return res.data;
}

export async function createEmployee(payload) {
  const res = await api.post("/api/employees", payload);
  return res.data;
}

export async function updateEmployee(id, payload) {
  const res = await api.put(`/api/employees/${id}`, payload);
  return res.data;
}

export async function deleteEmployee(id) {
  const res = await api.delete(`/api/employees/${id}`);
  return res.data;
}

export async function bulkDeleteEmployees(ids) {
  const res = await api.post("/api/employees/bulk-delete", { ids });
  return res.data;
}

export async function getCloudinarySignature(publicId) {
  const res = await api.post("/api/uploads/cloudinary/signature", { publicId });
  return res.data;
}


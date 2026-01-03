import api from "./axios";

export const getMyPayroll = () => api.get("/payroll/me");
export const getAllPayroll = () => api.get("/payroll");
export const createPayroll = (data) => api.post("/payroll", data);
export const updatePayroll = (id, data) =>
  api.put(`/payroll/${id}`, data);

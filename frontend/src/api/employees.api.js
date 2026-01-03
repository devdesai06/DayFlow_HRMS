import api from "./axios";

export const getMyEmployeeProfile = () => api.get("/employees/me");
export const getEmployees = () => api.get("/employees");
export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const updateEmployee = (id, data) =>
  api.put(`/employees/${id}`, data);

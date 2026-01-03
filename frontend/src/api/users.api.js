import api from "./axios";

export const getMe = () => api.get("/users/me");
export const getUsers = () => api.get("/users");
export const updateUserStatus = (id, data) =>
  api.put(`/users/${id}/status`, data);

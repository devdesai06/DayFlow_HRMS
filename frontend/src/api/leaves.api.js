import api from "./axios";

export const getLeaveTypes = () => api.get("/leave-types");
export const createLeaveType = (data) => api.post("/leave-types", data);

export const applyLeave = (data) => api.post("/leaves", data);
export const getMyLeaves = () => api.get("/leaves/me");
export const getAllLeaves = () => api.get("/leaves");
export const decideLeave = (id, data) =>
  api.put(`/leaves/${id}/decision`, data);

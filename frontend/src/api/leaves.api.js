import api from "./axios";

export const applyLeave = (data) =>
  api.post("/leaves", data);

export const getMyLeaves = () =>
  api.get("/leaves/me");

export const getAllLeaves = () =>
  api.get("/leaves");

export const decideLeave = (id, decision) =>
  api.put(`/leaves/${id}/decision`, decision);

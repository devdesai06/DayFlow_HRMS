import api from "./axios";

// export const login = (data) => api.post("/auth/login", data);
export const registerApi = (data) => api.post("/auth/register", data);
export const verifyEmailApi = (data) => api.post("/auth/verify-email", data);
export const loginApi = (data) => api.post("/auth/login", data);
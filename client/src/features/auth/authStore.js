import { create } from "zustand";
import { api, setAccessToken } from "../../services/api.js";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  status: "idle",

  setSession: ({ user, accessToken }) => {
    setAccessToken(accessToken || null);
    set({ user: user || null, accessToken: accessToken || null });
  },

  clear: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore
    }
    setAccessToken(null);
    set({ user: null, accessToken: null, status: "idle" });
  },

  hydrate: async () => {
    const { status } = get();
    if (status === "loading") return;
    set({ status: "loading" });
    try {
      const refreshed = await api.post("/api/auth/refresh", {});
      const accessToken = refreshed?.data?.data?.accessToken || null;
      if (accessToken) setAccessToken(accessToken);
      const me = await api.get("/api/auth/me");
      set({
        user: me?.data?.data?.user || null,
        accessToken,
        status: "ready",
      });
    } catch {
      setAccessToken(null);
      set({ user: null, accessToken: null, status: "ready" });
    }
  },

  login: async ({ email, password }) => {
    const res = await api.post("/api/auth/login", { email, password });
    const accessToken = res?.data?.data?.accessToken || null;
    const user = res?.data?.data?.user || null;
    setAccessToken(accessToken);
    set({ user, accessToken, status: "ready" });
    return { user, accessToken };
  },

  register: async ({ email, password }) => {
    const res = await api.post("/api/auth/register", { email, password });
    return res?.data;
  },

  forgotPassword: async ({ email }) => {
    const res = await api.post("/api/auth/forgot-password", { email });
    return res?.data;
  },

  resetPassword: async ({ email, otp, newPassword }) => {
    const res = await api.post("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return res?.data;
  },

  verifyEmail: async ({ token }) => {
    const res = await api.post("/api/auth/verify-email", { token });
    return res?.data;
  },
}));


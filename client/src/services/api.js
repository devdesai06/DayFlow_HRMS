import axios from "axios";
import { toast } from "sonner";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise = null;

async function refreshAccessToken() {
  const res = await api.post("/api/auth/refresh", {});
  const token = res?.data?.data?.accessToken;
  if (!token) throw new Error("Missing accessToken");
  setAccessToken(token);
  return token;
}

export async function fetchDashboard(kind) {
  const res = await api.get(`/api/dashboard/${kind}`);
  return res.data;
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config;

    if (!original || original.__isRetryRequest) throw error;

    // Skip retry for refresh itself
    if (status === 401 && !original.url?.includes("/auth/refresh")) {
      try {
        original.__isRetryRequest = true;
        refreshPromise = refreshPromise || refreshAccessToken();
        await refreshPromise;
        refreshPromise = null;
        return api(original);
      } catch (e) {
        refreshPromise = null;
        setAccessToken(null);
        throw error;
      }
    }

    // Suppress toasts for 401 errors so calling code handles it
    if (status !== 401) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Request failed. Please try again.";
      toast.error(msg);
    }
    throw error;
  }
);


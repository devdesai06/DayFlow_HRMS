/**
 * Environment configuration
 * Switch between mock and real backend from ONE place
 */

// 🔹 Toggle this to false to use real backend
export const USE_MOCK = false;

// 🔹 Backend base URL
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:4000/api/v1";

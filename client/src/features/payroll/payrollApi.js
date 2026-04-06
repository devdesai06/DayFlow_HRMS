import { api } from "../../services/api.js";

export async function runPayroll(payload) {
  const res = await api.post("/api/payroll/run", payload);
  return res.data;
}

export async function fetchPayrollHistory(params) {
  const res = await api.get("/api/payroll/history", { params });
  return res.data;
}

export async function downloadPayslip(id) {
  const res = await api.get(`/api/payroll/payslip/${id}`, { responseType: "blob" });
  return res;
}


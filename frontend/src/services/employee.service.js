import { USE_MOCK } from "../config/env";
import { employeesMock } from "../mock/employees.mock";
import {
  getEmployees,
  getEmployeeById,
  getMyEmployeeProfile,
} from "../api/employees.api";

// 1️⃣ Get all employees
export const fetchEmployees = async () => {
  if (USE_MOCK) {
    return Promise.resolve(employeesMock);
  }
  const res = await getEmployees();
  return res.data;
};

// 2️⃣ Get employee by ID
export const fetchEmployeeById = async (id) => {
  if (USE_MOCK) {
    return employeesMock.find(e => e.id === id);
  }
  const res = await getEmployeeById(id);
  return res.data;
};

// 3️⃣ Get logged-in employee
export const fetchMyProfile = async () => {
  if (USE_MOCK) {
    return employeesMock[0];
  }
  const res = await getMyEmployeeProfile();
  return res.data;
};

import {
  getEmployees,
  getEmployeeById,
  getMyEmployeeProfile,
} from "../api/employees.api";

/**
 * Helper: validate API response
 */
const handleResponse = (res) => {
  if (!res || !res.data) {
    throw new Error("Invalid API response");
  }
  return res.data;
};

/**
 * 1️⃣ Fetch all employees (Admin / HR)
 */
export const fetchEmployees = async () => {
  try {
    const res = await getEmployees();
    return handleResponse(res);
  } catch (error) {
    console.error("fetchEmployees failed:", error);
    throw error;
  }
};

/**
 * 2️⃣ Fetch employee by ID (Admin / HR)
 */
export const fetchEmployeeById = async (id) => {
  try {
    if (!id) {
      throw new Error("Employee ID is required");
    }

    const res = await getEmployeeById(id);
    return handleResponse(res);
  } catch (error) {
    console.error(`fetchEmployeeById(${id}) failed:`, error);
    throw error;
  }
};

/**
 * 3️⃣ Fetch logged-in employee profile
 */
export const fetchMyProfile = async () => {
  try {
    const res = await getMyEmployeeProfile();
    return handleResponse(res);
  } catch (error) {
    console.error("fetchMyProfile failed:", error);
    throw error;
  }
};

import {
  applyLeave as applyLeaveApi,
  getMyLeaves as getMyLeavesApi,
  getAllLeaves as getAllLeavesApi,
 
  decideLeave as decideLeaveApi,
} from "../api/leaves.api";

/**
 * Normalize backend response
 */
const resolveData = (res) => {
  if (!res) throw new Error("No response from server");
  return res.data ?? res;
};

/**
 * Employee: Apply for leave
 * POST /leaves
 */
export const applyLeaveService = async (payload) => {
  try {
    /**
     * payload example:
     * {
     *   leave_type_id: number,
     *   start_date: "YYYY-MM-DD",
     *   end_date: "YYYY-MM-DD",
     *   reason: string
     * }
     */
    const res = await applyLeaveApi(payload);
    return resolveData(res);
  } catch (err) {
    console.error("❌ Apply leave failed:", err);
    throw err;
  }
};

/**
 * Employee: Get own leave requests
 * GET /leaves/me
 */
export const fetchMyLeaves = async () => {
  try {
    const res = await getMyLeavesApi();
    return resolveData(res);
  } catch (err) {
    console.error("❌ Fetch my leaves failed:", err);
    throw err;
  }
};

/**
 * Admin / HR: Get all leave requests
 * GET /leaves
 */
export const fetchAllLeaves = async () => {
  try {
    const res = await getAllLeavesApi();
    return resolveData(res);
  } catch (err) {
    console.error("❌ Fetch all leaves failed:", err);
    throw err;
  }
};



/**
 * Admin / HR: Approve or reject leave
 * PUT /leaves/:id/decision
 */
export const decideLeaveService = async (leaveId, decisionPayload) => {
  if (!leaveId) {
    throw new Error("Leave ID is required");
  }

  /**
   * decisionPayload example:
   * {
   *   status: "APPROVED" | "REJECTED",
   *   admin_comment?: string
   * }
   */
  try {
    const res = await decideLeaveApi(leaveId, decisionPayload);
    return resolveData(res);
  } catch (err) {
    console.error("❌ Decide leave failed:", err);
    throw err;
  }
};

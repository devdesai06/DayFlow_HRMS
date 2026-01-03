import pool from "../db/mysql.js";
import { markLeaveAttendance } from "../utils/attendance.helper.js";

/**
 * POST /api/v1/leaves
 * Employee applies for leave
 */
export async function applyLeave(req, res) {
  try {
    const userId = req.user.userId;
    const { leaveTypeId, startDate, endDate, reason } = req.body;

    if (!leaveTypeId || !startDate || !endDate) {
      return res.status(400).json({
        message: "leaveTypeId, startDate and endDate are required"
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        message: "startDate cannot be after endDate"
      });
    }

    await pool.execute(
      `
      INSERT INTO leave_requests
      (employee_id, leave_type_id, start_date, end_date, reason)
      VALUES (
        (SELECT id FROM employees WHERE user_id = ?),
        ?, ?, ?, ?
      )
      `,
      [userId, leaveTypeId, startDate, endDate, reason]
    );

    return res.status(201).json({
      message: "Leave request submitted successfully"
    });
  } catch (err) {
    console.error("APPLY LEAVE ERROR:", err);
    return res.status(500).json({
      message: "Failed to apply leave"
    });
  }
}

/**
 * GET /api/v1/leaves/me
 * Employee views own leave requests
 */
export async function getMyLeaves(req, res) {
  try {
    const userId = req.user.userId;

    const [rows] = await pool.execute(
      `
      SELECT 
        lr.id,
        lt.name AS leave_type,
        lr.start_date,
        lr.end_date,
        lr.status,
        lr.reason,
        lr.created_at
      FROM leave_requests lr
      JOIN leave_types lt ON lt.id = lr.leave_type_id
      WHERE lr.employee_id = (SELECT id FROM employees WHERE user_id = ?)
      ORDER BY lr.created_at DESC
      `,
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch leave requests"
    });
  }
}
/**
 * GET /api/v1/leaves
 * Admin / HR: view all leave requests
 */
export async function getAllLeaves(req, res) {
  try {
    const [rows] = await pool.execute(
      `
      SELECT 
        lr.id,
        e.full_name,
        lt.name AS leave_type,
        lr.start_date,
        lr.end_date,
        lr.status,
        lr.reason,
        lr.created_at
      FROM leave_requests lr
      JOIN employees e ON e.id = lr.employee_id
      JOIN leave_types lt ON lt.id = lr.leave_type_id
      ORDER BY lr.created_at DESC
      `
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch leave requests"
    });
  }
}

/**
 * GET /api/v1/leaves/:id
 * Admin / HR: view single leave request
 */
export async function getLeaveById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `
      SELECT 
        lr.id,
        e.full_name,
        lt.name AS leave_type,
        lr.start_date,
        lr.end_date,
        lr.status,
        lr.reason,
        lr.created_at
      FROM leave_requests lr
      JOIN employees e ON e.id = lr.employee_id
      JOIN leave_types lt ON lt.id = lr.leave_type_id
      WHERE lr.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }

    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch leave request"
    });
  }
}

/**
 * PUT /api/v1/leaves/:id/decision
 * Admin / HR: approve or reject leave
 */

export async function decideLeave(req, res) {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const reviewerId = req.user.userId;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Status must be APPROVED or REJECTED"
      });
    }

    await connection.beginTransaction();

    // 1️⃣ Fetch leave request
    const [[leave]] = await connection.execute(
      `
      SELECT employee_id, start_date, end_date, status
      FROM leave_requests
      WHERE id = ?
      FOR UPDATE
      `,
      [id]
    );

    if (!leave) {
      await connection.rollback();
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leave.status !== "PENDING") {
      await connection.rollback();
      return res.status(400).json({
        message: "Leave already processed"
      });
    }

    // 2️⃣ Update leave status
    await connection.execute(
      `
      UPDATE leave_requests
      SET 
        status = ?,
        reviewed_by = ?,
        reviewed_at = NOW(),
        admin_comment = ?
      WHERE id = ?
      `,
      [status, reviewerId, comment, id]
    );

    // 3️⃣ If approved → update attendance
    if (status === "APPROVED") {
      await markLeaveAttendance(
        connection,
        leave.employee_id,
        leave.start_date,
        leave.end_date
      );
    }

    await connection.commit();

    return res.json({
      message: `Leave ${status.toLowerCase()} successfully`
    });

  } catch (err) {
    await connection.rollback();
    console.error("LEAVE DECISION ERROR:", err);
    return res.status(500).json({
      message: "Failed to process leave decision"
    });
  } finally {
    connection.release();
  }
}

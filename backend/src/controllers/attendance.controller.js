import pool from "../db/mysql.js";

/**
 * POST /api/v1/attendance/check-in
 * Employee: mark check-in for today
 */
export async function checkIn(req, res) {
  try {
    const userId = req.user.userId;

    await pool.execute(
      `
      INSERT INTO attendance (employee_id, attendance_date, check_in, status)
      VALUES (
        (SELECT id FROM employees WHERE user_id = ?),
        CURDATE(),
        CURTIME(),
        'PRESENT'
      )
      `,
      [userId]
    );

    return res.json({ message: "Checked in successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Already checked in for today"
      });
    }

    return res.status(500).json({
      message: "Failed to check in"
    });
  }
}

/**
 * POST /api/v1/attendance/check-out
 * Employee: mark check-out for today
 */
export async function checkOut(req, res) {
  try {
    const userId = req.user.userId;

    const [result] = await pool.execute(
      `
      UPDATE attendance
      SET check_out = CURTIME()
      WHERE employee_id = (SELECT id FROM employees WHERE user_id = ?)
        AND attendance_date = CURDATE()
      `,
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "No check-in found for today"
      });
    }

    return res.json({ message: "Checked out successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to check out"
    });
  }
}

/**
 * GET /api/v1/attendance/me
 * Employee: view own attendance
 */
export async function getMyAttendance(req, res) {
  try {
    const userId = req.user.userId;

    const [rows] = await pool.execute(
      `
      SELECT *
      FROM attendance
      WHERE employee_id = (SELECT id FROM employees WHERE user_id = ?)
      ORDER BY attendance_date DESC
      `,
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch attendance"
    });
  }
}

/**
 * GET /api/v1/attendance
 * Admin / HR: view all attendance
 */
export async function getAllAttendance(req, res) {
  try {
    const [rows] = await pool.execute(
      `
      SELECT a.*, e.full_name
      FROM attendance a
      JOIN employees e ON e.id = a.employee_id
      ORDER BY a.attendance_date DESC
      `
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch attendance"
    });
  }
}

/**
 * GET /api/v1/attendance/:employeeId
 * Admin / HR: view attendance of specific employee
 */
export async function getEmployeeAttendance(req, res) {
  try {
    const { employeeId } = req.params;

    const [rows] = await pool.execute(
      `
      SELECT *
      FROM attendance
      WHERE employee_id = ?
      ORDER BY attendance_date DESC
      `,
      [employeeId]
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch employee attendance"
    });
  }
}

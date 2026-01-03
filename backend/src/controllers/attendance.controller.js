import pool from "../db/mysql.js";

/**
 * POST /api/v1/attendance/check-in
 */
export async function checkIn(req, res) {
  try {
    const userId = req.user.userId;

    // 1️⃣ Fetch employee ID safely
    const [[employee]] = await pool.execute(
      `SELECT id FROM employees WHERE user_id = ?`,
      [userId]
    );

    if (!employee) {
      return res.status(400).json({
        message: "Employee profile not found"
      });
    }

    // 2️⃣ Insert attendance
    await pool.execute(
      `
      INSERT INTO attendance (employee_id, attendance_date, check_in, status)
      VALUES (?, CURDATE(), CURTIME(), 'PRESENT')
      `,
      [employee.id]
    );

    res.status(201).json({
      message: "Checked in successfully"
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Already checked in for today"
      });
    }

    console.error("CHECK-IN ERROR:", err);
    res.status(500).json({
      message: "Failed to check in"
    });
  }
}

/**
 * POST /api/v1/attendance/check-out
 */
export async function checkOut(req, res) {
  try {
    const userId = req.user.userId;

    const [[employee]] = await pool.execute(
      `SELECT id FROM employees WHERE user_id = ?`,
      [userId]
    );

    if (!employee) {
      return res.status(400).json({
        message: "Employee profile not found"
      });
    }

    const [result] = await pool.execute(
      `
      UPDATE attendance
      SET check_out = CURTIME()
      WHERE employee_id = ?
        AND attendance_date = CURDATE()
        AND check_out IS NULL
      `,
      [employee.id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "No active check-in found for today"
      });
    }

    res.json({ message: "Checked out successfully" });
  } catch (err) {
    console.error("CHECK-OUT ERROR:", err);
    res.status(500).json({
      message: "Failed to check out"
    });
  }
}

/**
 * GET /api/v1/attendance/me
 */
export async function getMyAttendance(req, res) {
  try {
    const userId = req.user.userId;

    const [rows] = await pool.execute(
      `
      SELECT a.*
      FROM attendance a
      JOIN employees e ON e.id = a.employee_id
      WHERE e.user_id = ?
      ORDER BY a.attendance_date DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("FETCH MY ATTENDANCE ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch attendance"
    });
  }
}

/**
 * GET /api/v1/attendance
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

    res.json(rows);
  } catch (err) {
    console.error("FETCH ALL ATTENDANCE ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch attendance"
    });
  }
}

/**
 * GET /api/v1/attendance/:employeeId
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

    res.json(rows);
  } catch (err) {
    console.error("FETCH EMP ATTENDANCE ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch employee attendance"
    });
  }
}

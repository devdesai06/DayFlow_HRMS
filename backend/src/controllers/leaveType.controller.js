import pool from "../db/mysql.js";

/**
 * GET /api/v1/leave-types
 * Admin / HR / Employee: view all leave types
 */
export async function getLeaveTypes(req, res) {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, is_paid FROM leave_types"
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch leave types"
    });
  }
}

/**
 * POST /api/v1/leave-types
 * Admin / HR: create a new leave type
 */
export async function createLeaveType(req, res) {
  try {
    const { name, is_paid } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Leave type name is required"
      });
    }

    await pool.execute(
      "INSERT INTO leave_types (name, is_paid) VALUES (?, ?)",
      [name, is_paid ?? true]
    );

    return res.status(201).json({
      message: "Leave type created successfully"
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Leave type already exists"
      });
    }

    return res.status(500).json({
      message: "Failed to create leave type"
    });
  }
}

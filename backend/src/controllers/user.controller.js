import pool from "../db/mysql.js";

/**
 * GET /api/v1/users/me
 * Return logged-in user's basic info
 */
export async function getMe(req, res) {
  try {
    const userId = req.user.userId;

    const [rows] = await pool.execute(
      "SELECT id, email, role, is_active, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
}

/**
 * GET /api/v1/users
 * Admin: list all users
 */
export async function getAllUsers(req, res) {
  try {
    const [rows] = await pool.execute(
      "SELECT id, email, role, is_active, created_at FROM users"
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
}

/**
 * PUT /api/v1/users/:id/status
 * Admin: enable/disable a user
 */
export async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        message: "is_active must be boolean"
      });
    }

    await pool.execute(
      "UPDATE users SET is_active = ? WHERE id = ?",
      [is_active, id]
    );

    return res.json({ message: "User status updated" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update user status" });
  }
}

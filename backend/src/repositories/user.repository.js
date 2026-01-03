import pool from "../db/mysql.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    "SELECT id, email, role FROM users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}

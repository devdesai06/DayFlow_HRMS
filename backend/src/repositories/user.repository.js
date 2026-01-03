import pool from "../db/mysql.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ? AND is_active = TRUE",
    [email]
  );
  return rows[0] || null;
}

export async function createUser({ employeeCode, email, passwordHash, role }) {
  const [result] = await pool.execute(
    `INSERT INTO users (employee_code, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [employeeCode, email, passwordHash, role]
  );
  return result.insertId;
}

import pool from "../db/mysql.js";

/**
 * GET /employees/me
 * Employee: get own profile
 */
export async function getMyProfile(req, res) {
  try {
    const userId = req.user.userId;
console.log(req.user); // outside route

    const [rows] = await pool.execute(
      `SELECT e.*
       FROM employees e
       JOIN users u ON u.id = e.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
}

/**
 * GET /employees
 * Admin/HR: get all employees
 */
export async function getAllEmployees(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT e.*, u.email, u.role
       FROM employees e
       JOIN users u ON u.id = e.user_id`
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
}

/**
 * GET /employees/:id
 * Admin/HR: get employee by ID
 */
export async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT e.*, u.email, u.role
       FROM employees e
       JOIN users u ON u.id = e.user_id
       WHERE e.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employee" });
  }
}

/**
 * POST /employees
 * Admin/HR: create employee profile
 */
export async function createEmployee(req, res) {
  try {
    const {
      userId,
      fullName,
      phone,
      address,
      designation,
      department,
      joiningDate
    } = req.body;

    if (!userId || !fullName || !joiningDate) {
      return res.status(400).json({
        message: "userId, fullName and joiningDate are required"
      });
    }

    await pool.execute(
      `INSERT INTO employees
       (user_id, full_name, phone, address, designation, department, joining_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, fullName, phone, address, designation, department, joiningDate]
    );

    res.status(201).json({ message: "Employee created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create employee" });
  }
}

/**
 * PUT /employees/:id
 * Admin: update any | Employee: limited fields
 */
export async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const { phone, address, designation, department } = req.body;

    await pool.execute(
      `UPDATE employees
       SET phone = ?, address = ?, designation = ?, department = ?
       WHERE id = ?`,
      [phone, address, designation, department, id]
    );

    res.json({ message: "Employee updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update employee" });
  }
}

/**
 * DELETE /employees/:id
 * Admin only
 */
export async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;

    await pool.execute(
      "DELETE FROM employees WHERE id = ?",
      [id]
    );

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete employee" });
  }
}

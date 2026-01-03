import pool from "../db/mysql.js";

/**
 * POST /api/v1/payroll
 * Admin / HR: create payroll for employee
 */
export async function createPayroll(req, res) {
  try {
    const {
      employeeId,
      baseSalary,
      allowances = 0,
      deductions = 0,
      effectiveFrom
    } = req.body;

    if (!employeeId || !baseSalary || !effectiveFrom) {
      return res.status(400).json({
        message: "employeeId, baseSalary and effectiveFrom are required"
      });
    }

    const netSalary =
      Number(baseSalary) + Number(allowances) - Number(deductions);

    await pool.execute(
      `
      INSERT INTO payroll
      (employee_id, base_salary, allowances, deductions, net_salary, effective_from)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        employeeId,
        baseSalary,
        allowances,
        deductions,
        netSalary,
        effectiveFrom
      ]
    );

    return res.status(201).json({
      message: "Payroll created successfully"
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create payroll"
    });
  }
}

/**
 * GET /api/v1/payroll/me
 * Employee: view own payroll
 */
export async function getMyPayroll(req, res) {
  try {
    const userId = req.user.userId;

    const [rows] = await pool.execute(
      `
      SELECT 
        p.base_salary,
        p.allowances,
        p.deductions,
        p.net_salary,
        p.effective_from
      FROM payroll p
      JOIN employees e ON e.id = p.employee_id
      WHERE e.user_id = ?
      ORDER BY p.effective_from DESC
      LIMIT 1
      `,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Payroll not found"
      });
    }

    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch payroll"
    });
  }
}

/**
 * GET /api/v1/payroll
 * Admin / HR: view all payroll records
 */
export async function getAllPayroll(req, res) {
  try {
    const [rows] = await pool.execute(
      `
      SELECT 
        p.id,
        e.full_name,
        p.base_salary,
        p.allowances,
        p.deductions,
        p.net_salary,
        p.effective_from
      FROM payroll p
      JOIN employees e ON e.id = p.employee_id
      ORDER BY p.effective_from DESC
      `
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch payroll records"
    });
  }
}

import pool from "../db/mysql.js";

/**
 * Mark attendance as LEAVE for a date range
 */
export async function markLeaveAttendance(
  connection,
  employeeId,
  startDate,
  endDate
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    const date = d.toISOString().slice(0, 10);

    await connection.execute(
      `
      INSERT INTO attendance (employee_id, attendance_date, status)
      VALUES (?, ?, 'LEAVE')
      ON DUPLICATE KEY UPDATE status = 'LEAVE'
      `,
      [employeeId, date]
    );
  }
}

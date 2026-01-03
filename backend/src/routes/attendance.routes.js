import { Router } from "express";
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getEmployeeAttendance
} from "../controllers/attendance.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management APIs
 */

/**
 * @swagger
 * /attendance/check-in:
 *   post:
 *     summary: Employee check-in for today
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Checked in successfully
 *       400:
 *         description: Already checked in for today
 */
router.post(
  "/check-in",
  authenticate,
  authorizeRoles("EMPLOYEE", "ADMIN", "HR"),
  checkIn
);

/**
 * @swagger
 * /attendance/check-out:
 *   post:
 *     summary: Employee check-out for today
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Checked out successfully
 *       400:
 *         description: No check-in found for today
 */
router.post(
  "/check-out",
  authenticate,
  authorizeRoles("EMPLOYEE", "ADMIN", "HR"),
  checkOut
);

/**
 * @swagger
 * /attendance/me:
 *   get:
 *     summary: Get logged-in employee attendance
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance records fetched
 */
router.get(
  "/me",
  authenticate,
  authorizeRoles("EMPLOYEE", "ADMIN", "HR"),
  getMyAttendance
);

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get attendance of all employees
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All attendance records fetched
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  getAllAttendance
);

/**
 * @swagger
 * /attendance/{employeeId}:
 *   get:
 *     summary: Get attendance of a specific employee
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee attendance fetched
 *       404:
 *         description: Employee not found
 */
router.get(
  "/:employeeId",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  getEmployeeAttendance
);

export default router;

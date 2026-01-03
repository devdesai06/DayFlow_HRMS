import { Router } from "express";
import {
  createPayroll,
  getMyPayroll,
  getAllPayroll
} from "../controllers/payroll.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payroll
 *   description: Payroll and salary management APIs
 */

/**
 * @swagger
 * /payroll:
 *   post:
 *     summary: Create payroll for an employee
 *     tags: [Payroll]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - baseSalary
 *               - effectiveFrom
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 2
 *               baseSalary:
 *                 type: number
 *                 example: 30000
 *               allowances:
 *                 type: number
 *                 example: 5000
 *               deductions:
 *                 type: number
 *                 example: 2000
 *               effectiveFrom:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-01
 *     responses:
 *       201:
 *         description: Payroll created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  createPayroll
);

/**
 * @swagger
 * /payroll/me:
 *   get:
 *     summary: Get logged-in employee payroll
 *     tags: [Payroll]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Payroll fetched successfully
 *       404:
 *         description: Payroll not found
 */
router.get(
  "/me",
  authenticate,
  authorizeRoles("EMPLOYEE", "ADMIN", "HR"),
  getMyPayroll
);

/**
 * @swagger
 * /payroll:
 *   get:
 *     summary: Get all payroll records
 *     tags: [Payroll]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Payroll records fetched successfully
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  getAllPayroll
);

export default router;

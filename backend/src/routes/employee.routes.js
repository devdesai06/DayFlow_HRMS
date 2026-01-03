import { Router } from "express";
import {
  getMyProfile,
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employee.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management APIs
 */

/**
 * @swagger
 * /employees/me:
 *   get:
 *     summary: Get logged-in employee profile
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Employee profile fetched successfully
 *       404:
 *         description: Employee profile not found
 */
router.get(
  "/me",
  authenticate,
  authorizeRoles("EMPLOYEE", "ADMIN", "HR"),
  getMyProfile
);

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all employees
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  getAllEmployees
);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee fetched successfully
 *       404:
 *         description: Employee not found
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  getEmployeeById
);

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee profile
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - fullName
 *               - joiningDate
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 2
 *               fullName:
 *                 type: string
 *                 example: Dev Desai
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               designation:
 *                 type: string
 *               department:
 *                 type: string
 *               joiningDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-01
 *     responses:
 *       201:
 *         description: Employee created successfully
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  createEmployee
);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update employee details
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               designation:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 */
router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  updateEmployee
);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete employee
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 */
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  deleteEmployee
);

export default router;

import { Router } from "express";
import {
  getLeaveTypes,
  createLeaveType
} from "../controllers/leaveType.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Leave Types
 *   description: Leave type master data APIs
 */

/**
 * @swagger
 * /leave-types:
 *   get:
 *     summary: Get all leave types
 *     tags: [Leave Types]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave types fetched successfully
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "HR", "EMPLOYEE"),
  getLeaveTypes
);

/**
 * @swagger
 * /leave-types:
 *   post:
 *     summary: Create a new leave type
 *     tags: [Leave Types]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sick Leave
 *               is_paid:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Leave type created successfully
 *       400:
 *         description: Leave type already exists or invalid input
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  createLeaveType
);

export default router;

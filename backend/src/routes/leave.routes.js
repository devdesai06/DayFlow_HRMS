import { Router } from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getLeaveById,
  decideLeave
} from "../controllers/leave.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Leaves
 *   description: Leave management APIs
 */

/**
 * @swagger
 * /leaves:
 *   post:
 *     summary: Apply for leave
 *     tags: [Leaves]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leaveTypeId
 *               - startDate
 *               - endDate
 *             properties:
 *               leaveTypeId:
 *                 type: integer
 *                 example: 1
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-10
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-12
 *               reason:
 *                 type: string
 *                 example: Family function
 *     responses:
 *       201:
 *         description: Leave request submitted successfully
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("EMPLOYEE", "ADMIN", "HR"),
  applyLeave
);

/**
 * @swagger
 * /leaves/me:
 *   get:
 *     summary: Get logged-in employee leave requests
 *     tags: [Leaves]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Employee leave requests fetched
 */
router.get(
  "/me",
  authenticate,
  authorizeRoles("EMPLOYEE", "ADMIN", "HR"),
  getMyLeaves
);

/**
 * @swagger
 * /leaves:
 *   get:
 *     summary: Get all leave requests
 *     tags: [Leaves]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All leave requests fetched
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  getAllLeaves
);

/**
 * @swagger
 * /leaves/{id}:
 *   get:
 *     summary: Get leave request by ID
 *     tags: [Leaves]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Leave request ID
 *     responses:
 *       200:
 *         description: Leave request fetched
 *       404:
 *         description: Leave request not found
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  getLeaveById
);

/**
 * @swagger
 * /leaves/{id}/decision:
 *   put:
 *     summary: Approve or reject leave request
 *     tags: [Leaves]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Leave request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               comment:
 *                 type: string
 *                 example: Approved by HR
 *     responses:
 *       200:
 *         description: Leave decision processed successfully
 *       400:
 *         description: Leave already processed or invalid status
 */
router.put(
  "/:id/decision",
  authenticate,
  authorizeRoles("ADMIN", "HR"),
  decideLeave
);

export default router;

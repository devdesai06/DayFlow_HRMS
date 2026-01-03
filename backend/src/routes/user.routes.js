import { Router } from "express";
import {
  getMe,
  getAllUsers,
  updateUserStatus
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get logged-in user details
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
 */
router.get(
  "/me",
  authenticate,
  getMe
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users fetched successfully
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  getAllUsers
);

/**
 * @swagger
 * /users/{id}/status:
 *   put:
 *     summary: Activate or deactivate a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_active
 *             properties:
 *               is_active:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       404:
 *         description: User not found
 */
router.put(
  "/:id/status",
  authenticate,
  authorizeRoles("ADMIN"),
  updateUserStatus
);

export default router;

import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeCode
 *               - email
 *               - password
 *               - role
 *             properties:
 *               employeeCode:
 *                 type: string
 *                 example: EMP001
 *               email:
 *                 type: string
 *                 example: user@company.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               role:
 *                 type: string
 *                 enum: [ADMIN, HR, EMPLOYEE]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@company.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", login);

export default router;

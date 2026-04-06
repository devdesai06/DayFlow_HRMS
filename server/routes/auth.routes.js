import { Router } from "express";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../schemas/auth.schemas.js";
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";

export const authRoutes = Router();

authRoutes.post("/register", validate({ body: registerSchema }), register);
authRoutes.post("/verify-email", validate({ body: verifyEmailSchema }), verifyEmail);
authRoutes.post("/login", validate({ body: loginSchema }), login);
authRoutes.post("/refresh", validate({ body: refreshSchema }), refresh);
authRoutes.post("/logout", logout);
authRoutes.post(
  "/forgot-password",
  validate({ body: forgotPasswordSchema }),
  forgotPassword
);
authRoutes.post(
  "/reset-password",
  validate({ body: resetPasswordSchema }),
  resetPassword
);
authRoutes.get("/me", authenticate, me);


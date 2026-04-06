import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(72),
});

export const refreshSchema = z.object({});

export const verifyEmailSchema = z.object({
  token: z.string().min(10),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(254),
});

export const resetPasswordSchema = z.object({
  email: z.string().email().max(254),
  otp: z.string().regex(/^\d{6}$/),
  newPassword: z.string().min(8).max(72),
});


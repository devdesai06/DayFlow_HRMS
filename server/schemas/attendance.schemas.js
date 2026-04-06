import { z } from "zod";

export const checkInBody = z.object({
  employeeId: z.string().min(24).max(24).optional(),
});

export const checkOutBody = z.object({
  employeeId: z.string().min(24).max(24).optional(),
});

export const monthlyParams = z.object({
  employeeId: z.string().min(24).max(24),
});

export const monthlyQuery = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

export const adminEditBody = z.object({
  checkInAt: z.string().datetime({ offset: true }).optional().nullable(),
  checkOutAt: z.string().datetime({ offset: true }).optional().nullable(),
  notes: z.string().trim().max(500).optional().default(""),
});


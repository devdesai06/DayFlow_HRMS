import { z } from "zod";

export const leaveIdParams = z.object({
  id: z.string().min(24).max(24),
});

export const leaveListQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
  employeeId: z.string().min(24).max(24).optional(),
  type: z.enum(["SICK", "CASUAL", "PAID", "UNPAID"]).optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
});

export const applyLeaveBody = z.object({
  type: z.enum(["SICK", "CASUAL", "PAID", "UNPAID"]),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }),
  reason: z.string().trim().max(800).optional().default(""),
  attachmentUrl: z.string().url().optional().default(""),
});

export const decisionBody = z.object({
  note: z.string().trim().max(500).optional().default(""),
});


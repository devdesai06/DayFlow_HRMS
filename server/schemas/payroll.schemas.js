import { z } from "zod";

export const payrollRunBody = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  employeeIds: z.array(z.string().min(24).max(24)).min(1).max(500),
  preview: z.coerce.boolean().optional().default(false),
});

export const payrollHistoryQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  employeeId: z.string().min(24).max(24).optional(),
});

export const payrollIdParams = z.object({
  id: z.string().min(24).max(24),
});


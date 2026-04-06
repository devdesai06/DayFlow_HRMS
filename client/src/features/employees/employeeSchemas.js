import { z } from "zod";
import { ROLES } from "../../constants/roles.js";

export const employeeCreateSchema = z.object({
  employeeCode: z.string().trim().min(2).max(24),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().email(),
  phone: z.string().trim().max(32).optional().default(""),
  department: z.string().trim().max(120).optional().default(""),
  role: z.enum([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ONBOARDING", "EXITED"]).optional(),
  joinDate: z.string().trim().optional().default(""),
  salaryAnnual: z.coerce.number().min(0).optional().default(0),
  salaryCurrency: z.string().trim().length(3).optional().default("USD"),
});

export const employeeUpdateSchema = employeeCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "Provide at least one field." }
);


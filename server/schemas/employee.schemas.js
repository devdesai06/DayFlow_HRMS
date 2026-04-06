import { z } from "zod";
import { ROLE_LIST } from "../constants/roles.js";

const dateFromString = z
  .string()
  .datetime({ offset: true })
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
  .transform((v) => new Date(v));

export const employeeIdParams = z.object({
  id: z.string().min(24).max(24),
});

export const employeeListQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(120).optional().default(""),
  department: z.string().trim().max(120).optional().default(""),
  role: z.enum(ROLE_LIST).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ONBOARDING", "EXITED"]).optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  joinFrom: dateFromString.optional(),
  joinTo: dateFromString.optional(),
  sortBy: z
    .enum(["createdAt", "joinDate", "salary.annual", "lastName", "department"])
    .optional()
    .default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const employeeCreateBody = z.object({
  employeeCode: z.string().trim().min(2).max(24),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().email().max(254),
  phone: z.string().trim().max(32).optional().default(""),
  department: z.string().trim().max(120).optional().default(""),
  role: z.enum(ROLE_LIST).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ONBOARDING", "EXITED"]).optional(),
  joinDate: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? new Date(v) : null)),
  avatar: z
    .object({
      url: z.string().url(),
      publicId: z.string().trim().min(1),
    })
    .optional(),
  salary: z
    .object({
      currency: z.string().trim().min(3).max(3).default("USD"),
      annual: z.coerce.number().min(0).default(0),
    })
    .optional(),
  address: z
    .object({
      line1: z.string().trim().max(160).optional().default(""),
      line2: z.string().trim().max(160).optional().default(""),
      city: z.string().trim().max(80).optional().default(""),
      state: z.string().trim().max(80).optional().default(""),
      postalCode: z.string().trim().max(20).optional().default(""),
      country: z.string().trim().max(80).optional().default(""),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().trim().max(120).optional().default(""),
      relation: z.string().trim().max(80).optional().default(""),
      phone: z.string().trim().max(32).optional().default(""),
    })
    .optional(),
});

export const employeeUpdateBody = employeeCreateBody.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field must be provided" }
);

export const employeeBulkDeleteBody = z.object({
  ids: z.array(z.string().min(24).max(24)).min(1).max(200),
});


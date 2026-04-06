import { z } from "zod";

export const updateCompanyBody = z.object({
  companyName: z.string().trim().min(2).max(140).optional(),
  domain: z.string().trim().max(140).optional(),
  address: z.string().trim().max(500).optional(),
});

export const departmentBody = z.object({
  name: z.string().trim().min(2).max(120),
});

export const emailTemplateBody = z.object({
  payslipHtml: z.string().trim().min(5).max(10000),
});

export const leavePolicyBody = z.object({
  SICK: z.coerce.number().int().min(0).max(365),
  CASUAL: z.coerce.number().int().min(0).max(365),
  PAID: z.coerce.number().int().min(0).max(365),
});


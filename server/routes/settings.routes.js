import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { checkRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { ROLES } from "../constants/roles.js";
import {
  departmentBody,
  emailTemplateBody,
  leavePolicyBody,
  updateCompanyBody,
} from "../schemas/settings.schemas.js";
import {
  addDepartment,
  getSettings,
  removeDepartment,
  updateCompany,
  updateEmailTemplates,
  updateLeavePolicy,
} from "../controllers/settings.controller.js";
import { z } from "zod";

export const settingsRoutes = Router();

settingsRoutes.get(
  "/",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  getSettings
);

settingsRoutes.patch(
  "/company",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  validate({ body: updateCompanyBody }),
  updateCompany
);

settingsRoutes.post(
  "/departments",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ body: departmentBody }),
  addDepartment
);

settingsRoutes.delete(
  "/departments/:name",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ params: z.object({ name: z.string().trim().min(2).max(120) }) }),
  removeDepartment
);

settingsRoutes.patch(
  "/leave-policy",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ body: leavePolicyBody }),
  updateLeavePolicy
);

settingsRoutes.patch(
  "/email-templates",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  validate({ body: emailTemplateBody }),
  updateEmailTemplates
);


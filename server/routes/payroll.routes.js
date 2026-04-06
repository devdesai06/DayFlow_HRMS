import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { checkRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { ROLES } from "../constants/roles.js";
import {
  payrollHistoryQuery,
  payrollIdParams,
  payrollRunBody,
} from "../schemas/payroll.schemas.js";
import {
  emailPayslip,
  history,
  payslipPdf,
  runPayroll,
} from "../controllers/payroll.controller.js";

export const payrollRoutes = Router();

payrollRoutes.post(
  "/run",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ body: payrollRunBody }),
  runPayroll
);

payrollRoutes.get(
  "/history",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ query: payrollHistoryQuery }),
  history
);

payrollRoutes.get(
  "/payslip/:id",
  authenticate,
  validate({ params: payrollIdParams }),
  payslipPdf
);

payrollRoutes.post(
  "/payslip/:id/email",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ params: payrollIdParams }),
  emailPayslip
);


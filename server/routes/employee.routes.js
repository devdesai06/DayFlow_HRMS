import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { checkRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { ROLES } from "../constants/roles.js";
import {
  employeeBulkDeleteBody,
  employeeCreateBody,
  employeeIdParams,
  employeeListQuery,
  employeeUpdateBody,
} from "../schemas/employee.schemas.js";
import {
  bulkDeleteEmployees,
  createEmployee,
  deleteEmployee,
  getEmployee,
  listEmployees,
  updateEmployee,
} from "../controllers/employee.controller.js";

export const employeeRoutes = Router();

employeeRoutes.get(
  "/",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ query: employeeListQuery }),
  listEmployees
);

employeeRoutes.post(
  "/",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ body: employeeCreateBody }),
  createEmployee
);

employeeRoutes.post(
  "/bulk-delete",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ body: employeeBulkDeleteBody }),
  bulkDeleteEmployees
);

employeeRoutes.get(
  "/:id",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ params: employeeIdParams }),
  getEmployee
);

employeeRoutes.put(
  "/:id",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ params: employeeIdParams, body: employeeUpdateBody }),
  updateEmployee
);

employeeRoutes.delete(
  "/:id",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ params: employeeIdParams }),
  deleteEmployee
);


import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { checkRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { ROLES } from "../constants/roles.js";
import {
  applyLeaveBody,
  decisionBody,
  leaveIdParams,
  leaveListQuery,
} from "../schemas/leave.schemas.js";
import {
  applyLeave,
  approveLeave,
  getBalance,
  listLeaves,
  rejectLeave,
} from "../controllers/leave.controller.js";

export const leaveRoutes = Router();

leaveRoutes.get(
  "/",
  authenticate,
  validate({ query: leaveListQuery }),
  listLeaves
);

leaveRoutes.post(
  "/",
  authenticate,
  validate({ body: applyLeaveBody }),
  applyLeave
);

leaveRoutes.get("/balance", authenticate, getBalance);

leaveRoutes.patch(
  "/:id/approve",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ params: leaveIdParams, body: decisionBody }),
  approveLeave
);

leaveRoutes.patch(
  "/:id/reject",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ params: leaveIdParams, body: decisionBody }),
  rejectLeave
);


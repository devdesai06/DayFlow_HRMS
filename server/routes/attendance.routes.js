import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";
import {
  adminEditBody,
  checkInBody,
  checkOutBody,
  monthlyParams,
  monthlyQuery,
} from "../schemas/attendance.schemas.js";
import { checkRole } from "../middleware/rbac.js";
import { ROLES } from "../constants/roles.js";
import {
  adminEdit,
  checkIn,
  checkOut,
  monthly,
} from "../controllers/attendance.controller.js";

export const attendanceRoutes = Router();

const adminEditParams = monthlyParams.extend({
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

attendanceRoutes.post(
  "/checkin",
  authenticate,
  validate({ body: checkInBody }),
  checkIn
);

attendanceRoutes.post(
  "/checkout",
  authenticate,
  validate({ body: checkOutBody }),
  checkOut
);

attendanceRoutes.get(
  "/:employeeId/monthly",
  authenticate,
  validate({ params: monthlyParams, query: monthlyQuery }),
  monthly
);

attendanceRoutes.patch(
  "/:employeeId/:dateKey/admin-edit",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({
    params: adminEditParams,
    body: adminEditBody,
  }),
  adminEdit
);


import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { notificationIdParams, notificationListQuery } from "../schemas/notification.schemas.js";
import { listNotifications, markRead } from "../controllers/notification.controller.js";

export const notificationRoutes = Router();

notificationRoutes.get(
  "/",
  authenticate,
  validate({ query: notificationListQuery }),
  listNotifications
);

notificationRoutes.patch(
  "/:id/read",
  authenticate,
  validate({ params: notificationIdParams }),
  markRead
);


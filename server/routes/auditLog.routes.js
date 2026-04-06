import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { checkRole } from "../middleware/rbac.js";
import { listAuditLogs } from "../controllers/auditLog.controller.js";

export const auditLogRoutes = Router();

auditLogRoutes.get("/", authenticate, checkRole(["SUPER_ADMIN", "ADMIN"]), listAuditLogs);

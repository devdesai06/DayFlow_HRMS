import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { adminDash, employeeDash, hrDash } from "../controllers/dashboard.controller.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/admin", authenticate, adminDash);
dashboardRoutes.get("/hr", authenticate, hrDash);
dashboardRoutes.get("/employee", authenticate, employeeDash);


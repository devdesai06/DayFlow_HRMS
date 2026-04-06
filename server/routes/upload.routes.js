import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { checkRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { ROLES } from "../constants/roles.js";
import { cloudinarySignatureBody } from "../schemas/upload.schemas.js";
import { getCloudinarySignature } from "../controllers/upload.controller.js";

export const uploadRoutes = Router();

uploadRoutes.post(
  "/cloudinary/signature",
  authenticate,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]),
  validate({ body: cloudinarySignatureBody }),
  getCloudinarySignature
);


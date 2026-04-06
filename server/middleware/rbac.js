import { ApiError } from "../utils/ApiError.js";

export function checkRole(allowedRoles) {
  const allow = new Set(Array.isArray(allowedRoles) ? allowedRoles : []);
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, "Unauthorized"));
    if (!allow.size) return next();
    if (!allow.has(req.user.role)) {
      return next(new ApiError(403, "Forbidden"));
    }
    next();
  };
}


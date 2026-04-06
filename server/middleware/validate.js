import { ApiError } from "../utils/ApiError.js";

export function validate({ body, params, query } = {}) {
  return (req, res, next) => {
    const errors = [];

    if (body) {
      const r = body.safeParse(req.body);
      if (!r.success) {
        for (const issue of r.error.issues) {
          errors.push({
            field: issue.path?.join(".") || "body",
            message: issue.message,
          });
        }
      } else {
        req.body = r.data;
      }
    }

    if (params) {
      const r = params.safeParse(req.params);
      if (!r.success) {
        for (const issue of r.error.issues) {
          errors.push({
            field: issue.path?.join(".") || "params",
            message: issue.message,
          });
        }
      } else {
        req.params = r.data;
      }
    }

    if (query) {
      const r = query.safeParse(req.query);
      if (!r.success) {
        for (const issue of r.error.issues) {
          errors.push({
            field: issue.path?.join(".") || "query",
            message: issue.message,
          });
        }
      } else {
        req.query = r.data;
      }
    }

    if (errors.length) {
      return next(new ApiError(400, "Validation failed", errors));
    }

    next();
  };
}


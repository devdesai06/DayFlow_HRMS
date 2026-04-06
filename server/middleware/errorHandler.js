import { ApiError } from "../utils/ApiError.js";

export function errorHandler(err, req, res, next) {
  const isApiError = err instanceof ApiError;

  const statusCode = isApiError ? err.statusCode : 500;
  const message =
    isApiError ? err.message : "Something went wrong. Please try again.";

  const errors =
    isApiError && Array.isArray(err.errors) ? err.errors : undefined;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors || [],
  });
}


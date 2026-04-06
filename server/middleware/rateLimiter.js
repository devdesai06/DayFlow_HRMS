import rateLimit from "express-rate-limit";

export function rateLimiter() {
  const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW || 15);
  const max = Number(process.env.RATE_LIMIT_MAX || 200);

  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
      errors: [],
    },
  });
}


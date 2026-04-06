import { z } from "zod";

export const notificationListQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const notificationIdParams = z.object({
  id: z.string().min(24).max(24),
});


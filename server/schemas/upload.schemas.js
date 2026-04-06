import { z } from "zod";

export const cloudinarySignatureBody = z.object({
  publicId: z.string().trim().min(6).max(180),
});


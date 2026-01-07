import { z } from "zod";
export const galleryValidator = z.object({
  name: z
    .string()
    .min(2, "Gallery name must be at least 2 characters long")
    .max(120, "Gallery name must be at most 120 characters long"),
  location: z
    .string()
    .min(2, "Gallery location must be at least 2 characters long")
    .max(120, "Gallery location must be at most 120 characters long"),
  website: z.url("Gallery website must be a valid URL").optional(),
  isPublished: z.boolean().optional(),
});

import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const artCollectionValidator = z.object({
  title: z
    .string()
    .min(2, "Art collection title must be at least 2 characters long")
    .max(120, "Art collection title must be at most 120 characters long"),
  image: z.url("Art collection image must be a valid URL"),
  description: z
    .string()
    .min(5, "Art collection description must be at least 5 characters long")
    .max(
      1000,
      "Art collection description must be at most 1000 characters long"
    )
    .optional(),
  isPublished: z.boolean().optional(),
  translationKey: z
    .string()
    .min(2, "Translation key must be at least 2 characters long")
    .max(100, "Translation key must be at most 100 characters long")
    .optional(),
});

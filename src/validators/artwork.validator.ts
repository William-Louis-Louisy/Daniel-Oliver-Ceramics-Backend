import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const artworkValidator = z.object({
  image: z.url("Artwork image must be a valid URL"),
  artCollection: z
    .string()
    .regex(objectIdRegex, "Invalid artwork collection ID"),
});

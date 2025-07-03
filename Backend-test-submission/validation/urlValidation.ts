import {z} from "zod";

export const urlSchema=z.object({
  url: z.string().url(),
  validity: z.number().int().positive().optional(),
  shortcode: z.string().regex(/^[a-zA-Z0-9]{4,}$/).optional(),
});
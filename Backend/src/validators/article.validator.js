import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string({ required_error: "Article title is required!" }),
  content: z.string({ required_error: "Article needs to have content!" }),
  category: z.optional(z.string()),
  image: z.optional(z.string()),
});

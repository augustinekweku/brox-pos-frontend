import * as z from "zod";

export const CategoryValidation = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  //make logo an optional field
  image: z.string().optional(),
});

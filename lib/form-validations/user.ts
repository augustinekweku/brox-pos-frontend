import * as z from "zod";

export const UserValidation = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  image: z.string().optional(),
  phone: z.string().optional(),
});

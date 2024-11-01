import * as z from "zod";

export const SupplierValidation = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  address: z.string().optional(),

  //make email an optional field
  email: z.string().optional(),
  phone: z.string(),
  //make logo an optional field
  image: z.string().optional(),
});

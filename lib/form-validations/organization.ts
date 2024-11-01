import * as z from "zod";

export const CompanyValidation = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  phone: z.string().min(2, {
    message: "Phone must be at least 2 characters.",
  }),
  //make logo an optional field
  logo: z.string().optional(),

  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  createdById: z.string().min(2, {
    message: "Created by must be at least 2 characters.",
  }),
});

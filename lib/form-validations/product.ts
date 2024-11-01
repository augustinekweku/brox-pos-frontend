import * as z from "zod";

export const ProductValidation = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),

  genericName: z.string().optional(),
  productCode: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  costPrice: z.number().min(1, {
    message: "Cost Price must be at least 1.",
  }),
  sellingPrice: z.number().min(1, {
    message: "Selling Price must be at least 1.",
  }),
  quantity: z.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  dateOfArrival: z.date().optional() || z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  //make logo an optional field
  image: z.string().optional(),
});

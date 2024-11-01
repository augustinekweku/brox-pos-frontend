import * as z from "zod";

export const CashPaymentValidation = z.object({
  customerName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  customerPhone: z.string().min(2, {
    message: "Phone must be at least 2 characters.",
  }),
  cashTendered: z.number().min(1, {
    message: "Cost Price must be at least 1.",
  }),
  note: z.string().optional(),
});

import * as z from "zod";

export const StockValidation = z.object({
  quantity: z.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
});

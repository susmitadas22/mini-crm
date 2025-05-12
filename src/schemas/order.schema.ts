import { z } from "zod";

export const orderSchema = z.object({
  customerEmail: z.string().email(),
  amount: z.number().positive(),
});

export type Order = z.infer<typeof orderSchema>;

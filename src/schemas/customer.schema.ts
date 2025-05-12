import { z } from "zod";

export const customerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

export type Customer = z.infer<typeof customerSchema>;

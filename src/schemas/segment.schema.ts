import { z } from "zod";

export const ruleSchema = z.object({
  field: z.string(),
  operator: z.string(),
  value: z.string(),
});

export const createSegmentSchema = z.object({
  segmentName: z.string().min(1),
  rules: z.array(ruleSchema),
  message: z.string(),
});

export type CreateSegmentSchema = z.infer<typeof createSegmentSchema>;

export type Rules = z.infer<typeof ruleSchema>;

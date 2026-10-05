import z from "zod";

export const createJobSchema = z.object({
  queueId: z.string().uuid(),

  type: z.string().min(1).max(255),

  payload: z.record(z.string(), z.unknown()).default({}),

  status: z
    .enum([
      "QUEUED",
      "RUNNING",
      "COMPLETED",
      "FAILED",
      "RETRYING",
      "DEAD_LETTER",
    ])
    .default("QUEUED"),

  priority: z.enum(["URGENT", "HIGH", "NORMAL", "LOW"]).default("NORMAL"),

  maxAttempts: z.number().int().min(1).default(3),

  scheduledAt: z.coerce.date().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;

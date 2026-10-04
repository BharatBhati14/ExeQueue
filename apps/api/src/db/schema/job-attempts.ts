import {
  pgTable,
  pgEnum,
  uuid,
  integer,
  timestamp,
  text,
  index,
} from "drizzle-orm/pg-core";
import { jobs } from "./jobs.js";
import { workers } from "./workers.js";

export const jobAttemptStatusEnum = pgEnum("job_attempt_status", [
  "RUNNING",
  "COMPLETED",
  "FAILED",
]);

export const jobAttempts = pgTable(
  "job_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id),

    attemptNumber: integer("attempt_number").notNull().default(1),

    workerId: uuid("worker_id").references(() => workers.id),

    status: jobAttemptStatusEnum("status").notNull().default("RUNNING"),

    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),

    completedAt: timestamp("completed_at", { withTimezone: true }),

    error: text("error"),
  },
  (table) => [
    index("job_attempts_job_id_idx").on(table.jobId),
    index("job_attempts_worker_id_idx").on(table.workerId),
  ],
);

export type JobAttempt = typeof jobAttempts.$inferSelect;
export type NewJobAttempt = typeof jobAttempts.$inferInsert;

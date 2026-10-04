import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { jobs } from "./jobs.js";
import { jobAttempts } from "./job-attempts.js";

export const jobLogLevelEnum = pgEnum("job_log_level", [
  "DEBUG",
  "INFO",
  "WARN",
  "ERROR",
]);

export const jobLogs = pgTable(
  "job_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id),

    attemptId: uuid("attempt_id").references(() => jobAttempts.id),

    level: jobLogLevelEnum("level").notNull().default("INFO"),

    message: text("message").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("job_logs_job_id_idx").on(table.jobId),
    index("job_logs_attempt_id_idx").on(table.attemptId),
  ],
);

export type JobLog = typeof jobLogs.$inferSelect;
export type NewJobLog = typeof jobLogs.$inferInsert;

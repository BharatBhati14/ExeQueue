import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { queues } from "./queues.js";

export const jobStatusEnum = pgEnum("job_status", [
  "QUEUED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "RETRYING",
  "DEAD_LETTER",
  "CANCELLED"
]);

export const jobPriorityEnum = pgEnum("job_priority", [
  "URGENT",
  "HIGH",
  "NORMAL",
  "LOW",
]);

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    queueId: uuid("queue_id")
      .notNull()
      .references(() => queues.id),

    type: varchar("type", { length: 255 }).notNull(),

    payload: jsonb("payload").notNull().default({}),

    status: jobStatusEnum("status").notNull().default("QUEUED"),

    priority: jobPriorityEnum("priority").notNull().default("NORMAL"),

    maxAttempts: integer("max_attempts").notNull().default(3),

    attempts: integer("attempts").notNull().default(0),

    scheduledAt: timestamp("scheduled_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    startedAt: timestamp("started_at", { withTimezone: true }),

    completedAt: timestamp("completed_at", { withTimezone: true }),

    failedAt: timestamp("failed_at", { withTimezone: true }),
  },
  (table) => [
    index("jobs_queue_status_idx").on(table.queueId, table.status),
    index("jobs_scheduled_at_idx").on(table.scheduledAt),
    index("jobs_priority_idx").on(table.priority),
  ],
);

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

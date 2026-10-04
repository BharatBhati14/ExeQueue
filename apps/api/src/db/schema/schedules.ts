import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { queues } from "./queues.js";

export const schedules = pgTable(
  "schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    queueId: uuid("queue_id")
      .notNull()
      .references(() => queues.id),

    jobType: varchar("job_type", { length: 255 }).notNull(),

    payload: jsonb("payload").notNull().default({}),

    cronExpression: varchar("cron_expression", { length: 100 }).notNull(),

    enabled: boolean("enabled").notNull().default(true),

    nextRunAt: timestamp("next_run_at", { withTimezone: true }),

    lastRunAt: timestamp("last_run_at", { withTimezone: true }),
  },
  (table) => [
    index("schedules_enabled_next_run_idx").on(table.enabled, table.nextRunAt),
    index("schedules_queue_id_idx").on(table.queueId),
  ],
);

export type Schedule = typeof schedules.$inferSelect;
export type NewSchedule = typeof schedules.$inferInsert;

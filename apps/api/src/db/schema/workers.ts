import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const workerStatusEnum = pgEnum("worker_status", ["ONLINE", "OFFLINE"]);

export const workers = pgTable(
  "workers",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 100 }).notNull().unique(),

    status: workerStatusEnum("status").notNull().default("ONLINE"),

    concurrency: integer("concurrency").notNull().default(1),

    lastHeartbeat: timestamp("last_heartbeat", { withTimezone: true }),

    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("workers_status_idx").on(table.status),
    index("workers_last_heartbeat_idx").on(table.lastHeartbeat),
  ],
);

export type Worker = typeof workers.$inferSelect;
export type NewWorker = typeof workers.$inferInsert;

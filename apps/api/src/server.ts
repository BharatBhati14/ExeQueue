import Fastify from "fastify";
import cors from "@fastify/cors";

import { db, schedules } from "@exequeue/db";
import { eq, sql } from "drizzle-orm";
import { jobRoutes } from "./features/jobs/job.route.js";
import { env } from "@exequeue/config";
import { scheduleRoutes } from "./features/schedules/schedules.route.js";
import { defaultQueue as queue } from "./queue/queues.js";

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: env.NEXT_PUBLIC_API_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

fastify.get("/", (request, reply) => {
  reply.send({
    success: true,
    message: "Welcome to ExeQueue by Fastify App",
  });
});

fastify.get("/healthz", async (_request, reply) => {
  try {
    await db.execute(sql`SELECT 1`);

    return {
      status: "ok",
      service: "api",
      database: "connected",
    };
  } catch (error) {
    fastify.log.error(error);

    return reply.status(503).send({
      status: "error",
      service: "api",
      database: "disconnected",
    });
  }
});

fastify.register(jobRoutes);
fastify.register(scheduleRoutes);

// Function to load and register active schedules on startup
async function initSchedules() {
  const activeSchedules = await db
    .select()
    .from(schedules)
    .where(eq(schedules.enabled, true));

  for (const schedule of activeSchedules) {
    await queue.upsertJobScheduler(
      `scheduler-${schedule.id}`,
      { pattern: schedule.cronExpression },
      {
        name: schedule.jobType,
        data: { jobId: schedule.id, payload: schedule.payload },
      },
    );
    console.log(
      `[Scheduler] Loaded schedule: ${schedule.jobType} (${schedule.cronExpression})`,
    );
  }
}

const start = async () => {
  try {
    await fastify.listen({
      port: 4000,
      host: "127.0.0.1",
    });

    await initSchedules();
  } catch (error) {
    (fastify.log.error(error), process.exit(1));
  }
};

start();

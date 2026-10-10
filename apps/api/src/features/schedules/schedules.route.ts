import type { FastifyInstance } from "fastify";
import { db, schedules } from "@exequeue/db";
import { defaultQueue as queue } from "../../queue/queues.js";

export async function scheduleRoutes(fastify: FastifyInstance) {
  fastify.get("/api/schedules", async (request, reply) => {
    const allSchedules = await db.select().from(schedules);
    return reply.send({ success: true, data: allSchedules });
  });

  // Create a recurring schedule
  fastify.post("/api/schedules", async (request, reply) => {
    const { queueId, name, cron, payload } = request.body as {
      queueId: string;
      name: string;
      cron: string;
      payload: any;
    };

    // Save schedule in PostgreSQL
    const [newSchedule] = await db
      .insert(schedules)
      .values({
        queueId,
        jobType: name,
        payload,
        cronExpression: cron,
        enabled: true,
        lastRunAt: new Date(),
      })
      .returning();

    // Register the repeatable job with BullMQ using upsertJobScheduler
    await queue.upsertJobScheduler(
      `scheduler-${newSchedule.id}`,
      { pattern: cron },
      {
        name,
        data: { jobId: newSchedule.id, payload },
      },
    );

    return reply.status(201).send({
      success: true,
      data: newSchedule,
    });
  });
}

import { and, desc, eq, inArray } from "drizzle-orm";
import { db, jobs } from "@exequeue/db";
import type { CreateJobInput } from "@exequeue/validation";
import { defaultQueue } from "../../queue/queues.js";

export async function createJob(input: CreateJobInput) {
  const [job] = await db
    .insert(jobs)
    .values({
      queueId: input.queueId,
      type: input.type,
      payload: input.payload,
      status: input.status,
      priority: input.priority,
      maxAttempts: input.maxAttempts,
      scheduledAt: input.scheduledAt,
    })
    .returning();

  // const jobInQueue =
  await defaultQueue.add(
    job.type,
    {
      jobId: job.id,
      type: job.type,
      payload: job.payload,
    },
    {
      attempts: job.maxAttempts,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    },
  );

  // console.log("Job added, id = ", jobInQueue);

  return job;
}

export async function listJobs() {
  return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
}

export async function getJobById(id: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);

  return job ?? null;
}

export async function cancelJob(id: string) {
  const [job] = await db
    .update(jobs)
    .set({
      status: "CANCELLED",
    })
    .where(and(eq(jobs.id, id), inArray(jobs.status, ["RUNNING", "QUEUED"])))
    .returning();

  return job ?? null;
}

export async function retryJob(id: string) {
  const [job] = await db
    .update(jobs)
    .set({
      status: "QUEUED",
      failedAt: null,
      startedAt: null,
      completedAt: null,
    })
    .where(
      and(eq(jobs.id, id), inArray(jobs.status, ["FAILED", "DEAD_LETTER"])),
    )
    .returning();

  return job ?? null;
}

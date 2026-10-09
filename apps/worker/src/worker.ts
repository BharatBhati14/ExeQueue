import { Job, Worker } from "bullmq";
import { connection } from "./connection.js";
import { db, jobAttempts, jobLogs, jobs, workers } from "@exequeue/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const workerId = `worker-${randomUUID().slice(0, 8)}`;
let heartbeatInterval: NodeJS.Timeout;

async function registerWorker() {
  console.log(`[Worker] Registering worker node: ${workerId}`);
  await db.insert(workers).values({
    id: workerId,
    name: workerId,
    status: "ONLINE",
    lastHeartbeat: new Date(),
  });

  // Send heartbeat every 10 seconds
  heartbeatInterval = setInterval(async () => {
    try {
      await db
        .update(workers)
        .set({ lastHeartbeat: new Date(), status: "ONLINE" })
        .where(eq(workers.id, workerId));
      console.log(`[Worker] Heartbeat sent for ${workerId}`);
    } catch (err) {
      console.error("[Worker] Failed to send heartbeat:", err);
    }
  }, 10000);
}

async function shutdownWorker() {
  console.log(`[Worker] Shutting down worker node: ${workerId}`);
  clearInterval(heartbeatInterval);
  try {
    await db
      .update(workers)
      .set({ status: "OFFLINE", lastHeartbeat: new Date() })
      .where(eq(workers.id, workerId));
  } catch (err) {
    console.error("[Worker] Error during shutdown update:", err);
  }
  process.exit(0);
}

process.on("SIGINT", shutdownWorker);
process.on("SIGTERM", shutdownWorker);

await registerWorker();

const worker = new Worker(
  "default",
  async (job: Job) => {
    const dbJobId = job.data.jobId;
    const attemptNumber = job.attemptsMade + 1;

    console.log(
      `[Worker] Processing job ${job.id} & (DB ID: ${dbJobId}) of type "${job.name}"...`,
    );

    const [attempt] = await db
      .insert(jobAttempts)
      .values({
        jobId: dbJobId,
        attemptNumber,
        status: "RUNNING",
        startedAt: new Date(),
      })
      .returning();

    await db
      .update(jobs)
      .set({ status: "RUNNING", startedAt: new Date() })
      .where(eq(jobs.id, dbJobId));

    await db.insert(jobLogs).values({
      jobId: dbJobId,
      attemptId: attempt.id,
      level: "INFO",
      message: `[Attempt ${attemptNumber}] Worker started executing job type: ${job.name}`,
    });

    try {
      // simulate worker
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await db
        .update(jobAttempts)
        .set({ status: "COMPLETED", completedAt: new Date() })
        .where(eq(jobAttempts.id, attempt.id));

      // update status to COMPLETED
      await db
        .update(jobs)
        .set({ status: "COMPLETED", completedAt: new Date() })
        .where(eq(jobs.id, dbJobId));

      await db.insert(jobLogs).values({
        jobId: dbJobId,
        level: "INFO",
        message: `[Attempt ${attemptNumber}] Job completed successfully.`,
      });

      console.log(`[Worker] Successfully Completed job ${job.id} & ${dbJobId}`);

      return { success: true };
    } catch (error: any) {
      const isDeadLetter = attemptNumber >= (job.opts.attempts || 3);
      const finalStatus = isDeadLetter ? "DEAD_LETTER" : "FAILED";

      await db
        .update(jobAttempts)
        .set({
          status: "FAILED",
          completedAt: new Date(),
          error: error.message,
        })
        .where(eq(jobAttempts.id, attempt.id));

      // update status to FAILED
      await db
        .update(jobs)
        .set({ status: "FAILED", failedAt: new Date() })
        .where(eq(jobs.id, dbJobId));

      await db.insert(jobLogs).values({
        jobId: dbJobId,
        level: "ERROR",
        message: `[Attempt ${attemptNumber}] Failed with error: ${error.message}`,
      });

      console.error(`[Worker] Job ${dbJobId} failed:`, error.message);
      throw error;
    }
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`BullMQ Job ${job.id} marked as completed`);
});

worker.on("failed", async (job, err) => {
  if (!job) return;
  const dbJobId = job.data.jobId;
  const attemptsMade = job.attemptsMade;
  const maxAttempts = job.opts.attempts || 3;

  console.log(
    `[Worker] Job ${dbJobId} failed attempt ${attemptsMade}/${maxAttempts}: ${err.message}`,
  );

  // if all attempts are exhausted
  if (attemptsMade >= maxAttempts) {
    await db
      .update(jobs)
      .set({ status: "DEAD_LETTER", failedAt: new Date() })
      .where(eq(jobs.id, dbJobId));

    console.log(
      `[Worker] Job ${dbJobId} has exhausted all attempts and moved to DEAD_LETTER.`,
    );
  }
});

console.log("ExeQueue worker is running and listening for jobs...");

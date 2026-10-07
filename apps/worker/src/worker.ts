import { Job, Worker } from "bullmq";
import { connection } from "./connection.js";
import { db, jobs } from "@exequeue/db";
import { eq } from "drizzle-orm";

const worker = new Worker(
  "default",
  async (job: Job) => {
    const dbJobId = job.data.jobId;

    console.log(
      `[Worker] Processing job ${job.id} & (DB ID: ${dbJobId}) of type "${job.name}"...`,
    );

    await db
      .update(jobs)
      .set({ status: "RUNNING", startedAt: new Date() })
      .where(eq(jobs.id, dbJobId));

    try {
      // simulate worker
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // update status to COMPLETED
      await db
        .update(jobs)
        .set({ status: "COMPLETED", completedAt: new Date() })
        .where(eq(jobs.id, dbJobId));

      console.log(`[Worker] Successfully Completed job ${job.id} & ${dbJobId}`);

      return { success: true };
    } catch (error: any) {
      // update status to FAILED
      await db
        .update(jobs)
        .set({ status: "FAILED", failedAt: new Date() })
        .where(eq(jobs.id, dbJobId));

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

import { Job, Worker } from "bullmq";
import { connection } from "./connection.js";

const worker = new Worker(
  "default",
  async (job: Job) => {
    console.log(`[Worker] Processing job ${job.id} of type "${job.name}"...`);

    // simulate worker
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log(`[Worker] Completed job ${job.id}`);

    return { success: true };
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} has successfully completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error ${err.message}`);
});

console.log("ExeQueue worker is running and listening for jobs...");

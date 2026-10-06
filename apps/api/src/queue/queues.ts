import { Queue } from "bullmq";
import { connection } from "./connection.js";

// Create a default BullMQ queue
export const defaultQueue = new Queue("default", { connection });

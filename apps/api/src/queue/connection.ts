import { Redis } from "ioredis";
import { env } from "@exequeue/config";

// Create a reusable Redis connection instance for BullMQ
export const connection = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

import { Redis } from "ioredis";
import { env } from "./lib/env.js";

export const connection = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

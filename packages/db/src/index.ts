import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@exequeue/config/src/index.js";
export * from "./schema/index.js";

const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(databaseUrl);

export const db = drizzle(client);

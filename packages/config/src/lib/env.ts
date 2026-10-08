import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({
  path: resolve(process.cwd(), "../../.env"),
});

const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || `http://localhost:4000`;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const env = {
  DATABASE_URL,
  NODE_ENV,
  REDIS_HOST,
  REDIS_PORT,
  NEXT_PUBLIC_API_URL,
};

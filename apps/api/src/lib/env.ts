import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({
  path: resolve(process.cwd(), "../../.env"),
});

const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const env = {
  DATABASE_URL,
  NODE_ENV,
};

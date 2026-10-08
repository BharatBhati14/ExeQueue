import Fastify from "fastify";
import cors from "@fastify/cors";

import { db } from "@exequeue/db";
import { sql } from "drizzle-orm";
import { jobRoutes } from "./features/jobs/job.route.js";
import { env } from "@exequeue/config";

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: env.NEXT_PUBLIC_API_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

fastify.get("/", (request, reply) => {
  reply.send({
    success: true,
    message: "Welcome to ExeQueue by Fastify App",
  });
});

fastify.get("/healthz", async (_request, reply) => {
  try {
    await db.execute(sql`SELECT 1`);

    return {
      status: "ok",
      service: "api",
      database: "connected",
    };
  } catch (error) {
    fastify.log.error(error);

    return reply.status(503).send({
      status: "error",
      service: "api",
      database: "disconnected",
    });
  }
});

fastify.register(jobRoutes);

const start = async () => {
  try {
    await fastify.listen({
      port: 4000,
      host: "127.0.0.1",
    });
  } catch (error) {
    (fastify.log.error(error), process.exit(1));
  }
};

start();

import Fastify from "fastify";
import { db } from "./db/index.js";
import { sql } from "drizzle-orm";
import { jobRoutes } from "./features/jobs/job.route.js";

const fastify = Fastify({
  logger: true,
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

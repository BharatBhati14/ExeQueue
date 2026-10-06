import { createJobSchema } from "@exequeue/validation";
import type { FastifyInstance } from "fastify";
import {
  cancelJob,
  createJob,
  getJobById,
  listJobs,
  retryJob,
} from "./job.service.js";

export async function jobRoutes(app: FastifyInstance) {
  /**
   * POST /api/jobs        Create a job
   */
  app.post("/api/jobs", async (request, reply) => {
    const result = createJobSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Invalid request",
        details: result.error.flatten(),
      });
    }

    const job = await createJob(result.data);

    return reply.status(201).send({
      data: job,
    });
  });

  /**
   * GET /api/jobs      List all jobs
   */

  app.get("/api/jobs", async (request, reply) => {
    const jobs = await listJobs();

    return reply.status(200).send({
      data: jobs,
    });
  });

  /**
   * GET /api/jobs/:id    Get job by ID
   */
  app.get("/api/jobs/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const job = await getJobById(id);

    if (!job) {
      return reply.status(404).send({
        error: "Job not found",
      });
    }

    return reply.status(200).send({
      data: job,
    });
  });

  /**
   * POST /api/jobs/:id/cancel
   */

  app.post("/api/jobs/:id/cancel", async (request, reply) => {
    const { id } = request.params as { id: string };

    const job = await cancelJob(id);

    if (!job) {
      return reply.status(404).send({
        error: "Job not found or cannot be cancelled",
      });
    }

    return reply.status(200).send({ data: job });
  });

  /**
   * POST /api/jobs/:id/retry
   */
  app.post("/api/jobs/:id/retry", async (request, reply) => {
    const { id } = request.params as { id: string };

    const job = await retryJob(id);

    if (!job) {
      return reply.status(404).send({
        error: "Job not found or cannot be retried",
      });
    }

    return reply.status(200).send({ data: job });
  });
}

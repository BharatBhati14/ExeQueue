import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", (request, reply) => {
  reply.send({
    success: true,
    message: "Welcome to Fastify App by ExeQueue",
  });
});

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

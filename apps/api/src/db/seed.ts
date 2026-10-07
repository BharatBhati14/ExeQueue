import { db, queues } from "@exequeue/db";

async function seed() {
  const [queue] = await db
    .insert(queues)
    .values({
      name: "default",
      description: "Default ExeQueue job queue",
      concurrency: 1,
    })
    .onConflictDoNothing({ target: queues.name })
    .returning();

  if (queue) {
    console.log("Created queue:", queue);
  } else {
    console.log("Default queue already exists.");
  }
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });

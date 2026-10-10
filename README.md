# ExeQueue
## Distributed Job Queue & Background Processing Platform

ExeQueue is a self-hosted, production-grade, distributed background job queue system built with a high-performance monorepo architecture. It provides reliable asynchronous task execution, real-time audit logging, worker registry monitoring, and cron-style recurring scheduling.

## Architecture & Tech Stack

ExeQueue is structured as a **monorepo** containing robust backend services and a modern control center frontend:

- **Database & ORM (`packages/db`)**: PostgreSQL backed by **Drizzle ORM** for type-safe relational modeling and durable storage.

- **Job Broker (`apps/api` & `apps/worker`)**: **BullMQ** running on top of **Redis** for high-throughput asynchronous job execution, rate-limiting, and automatic exponential backoff retries.

- **API Layer (`apps/api`)**: **Fastify** providing lightning-fast HTTP endpoints for job dispatch, worker management, and recurring schedules.

- **Worker Engine (`apps/worker`)**: Independent background worker daemon supporting concurrency, real-time heartbeats, and stdout/stderr log capture.

- **Control Center (`apps/web`)**: **Next.js** dashboard featuring a live job feed, interactive creation forms, slide-over audit drawers, and a dedicated schedule management interface.

## 📦 Core Domain Model (The Entities)

ExeQueue fully implements 7 core database entities for complete observability:

1. **`queues`**: Logical groupings for classifying workloads.

2. **`jobs`**: Individual background task records tracking status (`QUEUED`, `RUNNING`, `COMPLETED`, `FAILED`, `DEAD_LETTER`).

3. **`job_attempts`**: Granular retry attempt timelines and failure reasons.

4. **`job_logs`**: Captured stdout/stderr audit logs per execution.

5. **`workers`**: Active node registry tracking live status and health heartbeats.

6. **`schedules`**: Cron-style repeatable task configurations managed via BullMQ job schedulers.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher

- **Package Manager**: `pnpm`

- **Database**: PostgreSQL (v14+)

- **In-Memory Store**: Redis (v6+)

### Installation

1. **Clone the repository and install dependencies:**

   ```
   git clone https://github.com/BharatBhati14/exequeue.git
   cd exequeue
   pnpm install

   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory:

   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/exequeue
   REDIS_HOST=localhost
   REDIS_PORT=6379
   PORT=4000
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Push Database Schema:**

   ```
   pnpm --filter @exequeue/db push
   OR: npx drizzle-kit push
   ```

## 💻 Running the Services

You can start each service individually during development:

- **Fastify API Server:**

  ```
  pnpm --filter api dev

  ```

- **Background Worker Engine:**

  ```
  pnpm --filter worker dev

  ```

- **Next.js Control Center Dashboard:**

  ```
  pnpm --filter web dev

  ```

Open **`http://localhost:3000`** in your browser to access the ExeQueue control dashboard.

## 🔌 API Reference Highlights

| Method | Endpoint                | Description                                       |
| ------ | ----------------------- | ------------------------------------------------- |
| `POST` | `/api/jobs`             | Dispatch a new background job into the queue      |
| `GET`  | `/api/jobs`             | List recent background jobs across queues         |
| `GET`  | `/api/jobs/:id/details` | Fetch execution attempt timelines and stdout logs |
| `POST` | `/api/schedules`        | Register a new cron-style recurring schedule      |
| `GET`  | `/api/schedules`        | Retrieve all active cron schedule registrations   |

## 📄 License

This project is licensed under the MIT License. Built for production-grade distributed background processing.

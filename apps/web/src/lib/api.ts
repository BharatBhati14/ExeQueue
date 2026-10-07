// import { env } from "@exequeue/config/src/lib/env";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchJobs() {
  const res = await fetch(`${API_URL}/api/jobs`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  const data = await res.json();
  return data.data;
}

export async function createJob(data: any) {
  const res = await fetch(`${API_URL}/api/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create job");
  return res.json();
}

export async function getJobById(id: string) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch the job");
  const data = await res.json();
  return data.data;
}

export async function cancelJob(id: string) {
  const res = await fetch(`${API_URL}/api/jobs/${id}/cancel`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to cancel job");
  return res.json();
}

export async function retryJob(id: string) {
  const res = await fetch(`${API_URL}/api/jobs/${id}/retry`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to retry job");
  return res.json();
}

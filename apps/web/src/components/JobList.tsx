"use client";

import { cancelJob, retryJob } from "@/lib/api";
import JobDetailDrawer from "./JobDetailDrawer";
import { useState } from "react";

const statusColors: Record<string, string> = {
  QUEUED: "bg-yellow-100 text-yellow-800",
  RUNNING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  DEAD_LETTER: "bg-purple-100 text-purple-800",
};

export default function JobList({
  jobs,
  onRefresh,
}: {
  jobs: any[];
  onRefresh: () => void;
}) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    try {
      await cancelJob(id);
      onRefresh();
    } catch (err) {
      alert("Cannot cancel this job");
    }
  };

  const handleRetry = async (id: string) => {
    try {
      await retryJob(id);
      onRefresh();
    } catch (err) {
      alert("Cannot retry this job");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden mb-20">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Job Queue Feed</h2>
        <button
          onClick={onRefresh}
          className="text-sm text-blue-600 hover:underline"
        >
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
              <th className="p-3">ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Attempts</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {jobs.map((job) => (
              <tr
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-200 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                  {job.id.slice(0, 8)}...
                </td>
                <td className="px-4 py-3 text-gray-800">{job.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[job.status]}`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="p-3 text-gray-600">
                  {job.attempts + 1} / {job.maxAttempts}
                </td>
                <td className="p-3 space-x-2">
                  {job.status === "QUEUED" && (
                    <button
                      onClick={() => handleCancel(job.id)}
                      className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-200 hover:bg-red-100"
                    >
                      Cancel
                    </button>
                  )}
                  {(job.status === "FAILED" ||
                    job.status === "DEAD_LETTER") && (
                    <button
                      onClick={() => handleRetry(job.id)}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100"
                    >
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No jobs found. Dispatch one using the form!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <JobDetailDrawer
        jobId={selectedJobId}
        onClose={() => setSelectedJobId(null)}
      />
    </div>
  );
}

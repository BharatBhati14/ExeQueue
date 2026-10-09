"use client";

import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";

export default function JobDetailDrawer({
  jobId,
  onClose,
}: {
  jobId: string | null;
  onClose: () => void;
}) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    fetch(`${API_URL}/api/jobs/${jobId}/details`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDetails(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [jobId]);

  if (!jobId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold">Job Execution Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black dark:hover:text-white text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading audit trail...</p>
          ) : details ? (
            <div className="space-y-6">
              {/* Job Info */}
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg space-y-2">
                <p>
                  <strong>ID:</strong> {details.job.id}
                </p>
                <p>
                  <strong>Type:</strong> {details.job.type}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                    {details.job.status}
                  </span>
                </p>
                <p>
                  <strong>Attempts Made:</strong> {details.job.attempts}
                </p>
              </div>

              {/* Attempts Timeline */}
              <div>
                <h3 className="font-semibold mb-2">Execution Attempts</h3>
                <div className="space-y-2">
                  {details.attempts.map((att: any) => (
                    <div
                      key={att.id}
                      className="border p-3 rounded text-sm dark:border-zinc-700"
                    >
                      <div className="flex justify-between font-medium">
                        <span>Attempt #{att.attemptNumber}</span>
                        <span
                          className={
                            att.status === "COMPLETED"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {att.status}
                        </span>
                      </div>
                      {att.error && (
                        <p className="text-red-500 mt-1 text-xs">
                          Error: {att.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Logs */}
              <div>
                <h3 className="font-semibold mb-2">Stdout / Logs</h3>
                <div className="bg-black text-green-400 font-mono text-xs p-4 rounded h-48 overflow-y-auto space-y-1">
                  {details.logs.map((log: any) => (
                    <div key={log.id}>
                      <span className="text-gray-500">
                        [{new Date(log.createdAt).toLocaleTimeString()}]
                      </span>{" "}
                      [{log.level}] {log.message}
                    </div>
                  ))}
                  {details.logs.length === 0 && (
                    <span className="text-gray-500">No logs recorded yet.</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-500">Failed to load details.</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-200 dark:bg-zinc-800 py-2 rounded font-medium hover:bg-gray-300"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
}

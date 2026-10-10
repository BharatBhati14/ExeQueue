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
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex justify-end z-50 transition-opacity">
      <div className="w-full max-w-xl bg-white h-full p-6 shadow-xl border-l border-slate-200 overflow-y-auto flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Job Execution Audit
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                ID: {jobId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="flex items-center space-x-2 text-slate-500 text-sm py-8">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
              <span>Loading audit trail...</span>
            </div>
          ) : details ? (
            <div className="space-y-6">
              {/* Job Metadata Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Job Type
                  </span>
                  <span className="font-semibold text-slate-900">
                    {details.job.type}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      details.job.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : details.job.status === "FAILED" ||
                            details.job.status === "DEAD_LETTER"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {details.job.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Attempts
                  </span>
                  <span className="font-mono text-xs font-medium text-slate-700">
                    {details.job.attempts}
                  </span>
                </div>
              </div>

              {/* Execution Attempts Timeline */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Execution Attempts History
                </h3>
                {details.attempts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No attempts recorded yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {details.attempts.map((att: any) => (
                      <div
                        key={att.id}
                        className="border border-slate-200 rounded-lg p-3 text-sm bg-white shadow-sm"
                      >
                        <div className="flex justify-between items-center font-medium">
                          <span className="text-xs text-slate-700 font-semibold">
                            Attempt #{att.attemptNumber}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              att.status === "COMPLETED"
                                ? "text-emerald-600"
                                : "text-rose-600"
                            }`}
                          >
                            {att.status}
                          </span>
                        </div>
                        {att.error && (
                          <div className="mt-2 text-xs font-mono bg-rose-50 text-rose-700 p-2 rounded border border-rose-200">
                            Error: {att.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Execution Logs Terminal */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Execution Output / Stdout
                </h3>
                <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl h-52 overflow-y-auto space-y-1.5 shadow-inner">
                  {details.logs.map((log: any) => (
                    <div key={log.id} className="leading-relaxed">
                      <span className="text-slate-500 select-none">
                        [{new Date(log.createdAt).toLocaleTimeString()}]
                      </span>{" "}
                      <span className="text-sky-400">[{log.level}]</span>{" "}
                      <span className="text-slate-200">{log.message}</span>
                    </div>
                  ))}
                  {details.logs.length === 0 && (
                    <span className="text-slate-500 italic">
                      No console output captured yet.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
              Failed to load audit trail details.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 mt-6">
          <button
            onClick={onClose}
            className="w-full bg-slate-300 hover:bg-slate-400 text-slate-800 text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { API_URL } from "@/lib/api";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [queueId, setQueueId] = useState("");
  const [name, setName] = useState("");
  const [cron, setCron] = useState("");
  const [payload, setPayload] = useState('{"target": "all"}');

  const fetchSchedules = async () => {
    try {
      const data = await fetch(`${API_URL}/api/schedules`).then((r) =>
        r.json(),
      );
      if (data.success) setSchedules(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedPayload = JSON.parse(payload);
      const res = await fetch(`${API_URL}/api/schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queueId, name, cron, payload: parsedPayload }),
      });
      const data = await res.json();
      if (data.success) {
        setQueueId("");
        setName("");
        setCron("");
        fetchSchedules();
      }
    } catch (err) {
      alert("Invalid JSON payload or server error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Recurring Schedules
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure cron-style repeatable background jobs using BullMQ
            schedulers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Schedule Form */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-fit">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              New Cron Schedule
            </h2>
            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Queue ID (UUID)
                </label>
                <input
                  type="text"
                  required
                  value={queueId}
                  onChange={(e) => setQueueId(e.target.value)}
                  placeholder="e.g. 123e4567-e89b..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Job Type / Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. nightly_cleanup"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Cron Expression
                </label>
                <input
                  type="text"
                  required
                  value={cron}
                  onChange={(e) => setCron(e.target.value)}
                  placeholder="e.g. 0 * * * * (for every hour)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Payload (JSON)
                </label>
                <input
                  type="text"
                  required
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm"
              >
                Register Schedule
              </button>
            </form>
          </div>

          {/* Schedules Table */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Registrations
              </h2>
            </div>
            {loading ? (
              <p className="p-6 text-slate-500 text-sm">Loading schedules...</p>
            ) : schedules.length === 0 ? (
              <p className="p-6 text-slate-500 text-sm">
                No recurring schedules found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-6 py-3">Job Type</th>
                      <th className="px-6 py-3">Cron Expression</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedules.map((sch) => (
                      <tr
                        key={sch.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {sch.jobType}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-blue-600 font-semibold">
                          {sch.cronExpression}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                              sch.enabled
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {sch.enabled ? "ACTIVE" : "DISABLED"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                            {new Date(sch.lastRunAt).toLocaleString()}
                          {/* {new Date(sch.createdAt).toLocaleString()} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

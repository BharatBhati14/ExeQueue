"use client";

import { useState } from "react";
import { createJob } from "@/lib/api";

export default function CreateJobForm({
  onJobCreated,
}: {
  onJobCreated: () => void;
}) {
  const [queueId, setQueueId] = useState<string>("");
  const [type, setType] = useState<string>("generate_report");
  const [priority, setPriority] = useState("NORMAL");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createJob({
        queueId,
        type,
        payload: { timestamp: new Date().toISOString() },
        priority,
        maxAttempts: 3,
      });
      setQueueId("");
      onJobCreated();
    } catch (err) {
      alert("Error creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-lg shadow border space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">Dispatch New Job</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Queue ID
        </label>
        <input
          type="text"
          value={queueId}
          onChange={(e) => setQueueId(e.target.value)}
          placeholder="Paste seeded queue UUID"
          required
          className="mt-1 w-full p-2 border rounded text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Job Type
        </label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 w-full p-2 border rounded text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 w-full p-2 border rounded text-black"
        >
          <option value="LOW">LOW</option>
          <option value="NORMAL">NORMAL</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Enqueuing..." : "Enqueue Job"}
      </button>
    </form>
  );
}

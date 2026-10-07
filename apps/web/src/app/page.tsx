"use client";

import { useEffect, useState } from "react";
import CreateJobForm from "@/components/CreateJobForm";
import JobList from "@/components/JobList";
import { fetchJobs } from "@/lib/api";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 5000); // Polling every 5s for live updates
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            ExeQueue Dashboard
          </h1>
          <span className="text-sm text-green-600 font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            System Online
          </span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <CreateJobForm onJobCreated={loadJobs} />
          </div>
          <div className="md:col-span-2">
            <JobList jobs={jobs} onRefresh={loadJobs} />
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import CreateJobForm from "@/components/CreateJobForm";
import JobList from "@/components/JobList";
import Navbar from "@/components/Navbar";
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
    const interval = setInterval(loadJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Job Orchestration
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor, execute, and debug asynchronous background tasks in
            real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CreateJobForm onJobCreated={loadJobs} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <JobList jobs={jobs} onRefresh={loadJobs} />
          </div>
        </div>
      </main>
    </div>
  );
}

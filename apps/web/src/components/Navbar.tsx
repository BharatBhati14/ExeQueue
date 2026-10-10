"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 text-xl font-semibold">ExeQueue</div>
          <nav className="flex space-x-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-slate-100 text-blue-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Jobs Feed
            </Link>
            <Link
              href="/schedules"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/schedules"
                  ? "bg-slate-100 text-blue-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Schedules
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Active</span>
        </div>
      </div>
    </header>
  );
}

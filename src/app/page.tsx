"use client";

import { useState } from "react";
import { ActivityFeed } from "@/components/ActivityFeed";
import { CalendarView } from "@/components/CalendarView";
import { GlobalSearch } from "@/components/GlobalSearch";
import {
  Activity,
  Calendar,
  Search,
  Zap,
  Menu,
  X,
} from "lucide-react";

type Tab = "activity" | "calendar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("activity");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mission Control</h1>
                <p className="text-xs text-gray-400">AI Assistant Dashboard</p>
              </div>
            </div>

            <div className="flex-1 max-w-xl mx-4">
              <GlobalSearch />
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "activity"
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            Activity Feed
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "calendar"
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Today's Actions</p>
            <p className="text-2xl font-bold text-white">--</p>
          </div>
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Scheduled Tasks</p>
            <p className="text-2xl font-bold text-white">--</p>
          </div>
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Documents</p>
            <p className="text-2xl font-bold text-white">--</p>
          </div>
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Uptime</p>
            <p className="text-2xl font-bold text-green-400">99.9%</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
          {activeTab === "activity" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Recent Activity
                </h2>
                <select className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500">
                  <option value="">All Categories</option>
                  <option value="task">Tasks</option>
                  <option value="message">Messages</option>
                  <option value="file">Files</option>
                  <option value="cron">Cron Jobs</option>
                  <option value="system">System</option>
                </select>
              </div>
              <ActivityFeed />
            </div>
          )}

          {activeTab === "calendar" && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                Scheduled Tasks
              </h2>
              <CalendarView />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 mt-8 border-t border-gray-800">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>Mission Control v1.0</p>
          <p>Powered by OpenClaw</p>
        </div>
      </footer>
    </div>
  );
}

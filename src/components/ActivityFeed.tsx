"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format, formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  FileText,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  Settings,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  task: <CheckCircle className="w-4 h-4" />,
  message: <MessageSquare className="w-4 h-4" />,
  file: <FileText className="w-4 h-4" />,
  search: <Search className="w-4 h-4" />,
  cron: <Clock className="w-4 h-4" />,
  system: <Settings className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  completed: "text-green-400 bg-green-400/10",
  pending: "text-yellow-400 bg-yellow-400/10",
  failed: "text-red-400 bg-red-400/10",
};

const categoryColors: Record<string, string> = {
  task: "border-blue-500/30 bg-blue-500/5",
  message: "border-purple-500/30 bg-purple-500/5",
  file: "border-orange-500/30 bg-orange-500/5",
  search: "border-cyan-500/30 bg-cyan-500/5",
  cron: "border-yellow-500/30 bg-yellow-500/5",
  system: "border-gray-500/30 bg-gray-500/5",
};

interface ActivityFeedProps {
  limit?: number;
  category?: string;
}

export function ActivityFeed({ limit = 50, category }: ActivityFeedProps) {
  const activities = useQuery(api.activities.list, { limit, category });

  if (activities === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Zap className="w-8 h-8 mb-2 opacity-50" />
        <p>No activities yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity._id}
          className={`p-4 rounded-lg border ${categoryColors[activity.category] || "border-gray-700 bg-gray-800/50"}`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-800">
              {categoryIcons[activity.category] || <Zap className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white truncate">
                  {activity.action}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${statusColors[activity.status]}`}
                >
                  {activity.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })} ·{" "}
                {format(activity.timestamp, "MMM d, HH:mm")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

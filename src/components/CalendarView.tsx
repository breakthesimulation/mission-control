"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Calendar,
} from "lucide-react";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const tasks = useQuery(api.scheduledTasks.getUpcoming, { days: 14 });

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getTasksForDay = (date: Date) => {
    if (!tasks) return [];
    return tasks.filter((task) => isSameDay(new Date(task.nextRunAt), date));
  };

  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const goToToday = () => setCurrentDate(new Date());

  if (tasks === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {format(weekStart, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={prevWeek}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextWeek}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[140px] rounded-lg border p-2 ${
                isCurrentDay
                  ? "border-blue-500/50 bg-blue-500/10"
                  : "border-gray-700 bg-gray-800/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-medium ${
                    isCurrentDay ? "text-blue-400" : "text-gray-500"
                  }`}
                >
                  {format(day, "EEE")}
                </span>
                <span
                  className={`text-lg font-bold ${
                    isCurrentDay ? "text-blue-400" : "text-white"
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-1">
                {dayTasks.length === 0 ? (
                  <p className="text-xs text-gray-600 italic">No tasks</p>
                ) : (
                  dayTasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-1.5 rounded bg-gray-700/50 border border-gray-600/50"
                    >
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {format(new Date(task.nextRunAt), "HH:mm")}
                        </span>
                      </div>
                      <p className="text-xs text-white truncate mt-0.5">
                        {task.name}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task List */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-400 mb-3">
          Upcoming Tasks ({tasks.length})
        </h4>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Calendar className="w-8 h-8 mb-2 opacity-50" />
            <p>No scheduled tasks</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 10).map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                <div className="p-2 rounded-lg bg-gray-700">
                  <Clock className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{task.name}</p>
                  <p className="text-sm text-gray-400">{task.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">
                    {format(new Date(task.nextRunAt), "MMM d")}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(task.nextRunAt), "HH:mm")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

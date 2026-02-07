"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  FileText,
  Clock,
  Zap,
  X,
  Loader2,
  MessageSquare,
} from "lucide-react";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchResults = useQuery(
    api.search.searchAll,
    query.length >= 2 ? { query } : "skip"
  );

  const hasResults =
    searchResults &&
    (searchResults.documents.length > 0 ||
      searchResults.activities.length > 0 ||
      searchResults.tasks.length > 0);

  const totalResults = searchResults
    ? searchResults.documents.length +
      searchResults.activities.length +
      searchResults.tasks.length
    : 0;

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search memories, documents, tasks..."
          className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-[70vh] overflow-auto">
          {searchResults === undefined ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : !hasResults ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Search className="w-6 h-6 mb-2 opacity-50" />
              <p>No results found</p>
            </div>
          ) : (
            <div className="p-2">
              <p className="px-3 py-2 text-xs text-gray-500">
                {totalResults} result{totalResults !== 1 ? "s" : ""} found
              </p>

              {/* Documents */}
              {searchResults.documents.length > 0 && (
                <div className="mb-4">
                  <p className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">
                    Documents
                  </p>
                  {searchResults.documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-start gap-3 p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-orange-400 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {doc.title}
                        </p>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {doc.content.slice(0, 150)}...
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{doc.path}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Activities */}
              {searchResults.activities.length > 0 && (
                <div className="mb-4">
                  <p className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">
                    Activities
                  </p>
                  {searchResults.activities.map((activity) => (
                    <div
                      key={activity._id}
                      className="flex items-start gap-3 p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(activity.timestamp, "MMM d, yyyy HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {searchResults.tasks.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">
                    Scheduled Tasks
                  </p>
                  {searchResults.tasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-start gap-3 p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {task.name}
                        </p>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {task.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Next: {format(new Date(task.nextRunAt), "MMM d, HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && query.length >= 2 && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

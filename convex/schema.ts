import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    action: v.string(),
    description: v.string(),
    category: v.string(), // "task", "message", "file", "search", "cron", "system"
    status: v.string(), // "completed", "pending", "failed"
    metadata: v.optional(v.any()),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"])
    .index("by_category", ["category"]),

  scheduledTasks: defineTable({
    name: v.string(),
    description: v.string(),
    cronExpression: v.optional(v.string()),
    nextRunAt: v.number(),
    lastRunAt: v.optional(v.number()),
    status: v.string(), // "active", "paused", "completed"
    payload: v.optional(v.any()),
  }).index("by_nextRun", ["nextRunAt"])
    .index("by_status", ["status"]),

  documents: defineTable({
    title: v.string(),
    content: v.string(),
    path: v.string(),
    type: v.string(), // "memory", "note", "config", "article"
    tags: v.array(v.string()),
    lastModified: v.number(),
  }).searchIndex("search_content", {
    searchField: "content",
    filterFields: ["type"],
  }).searchIndex("search_title", {
    searchField: "title",
  }),
});

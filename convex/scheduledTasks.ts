import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      const status = args.status;
      return await ctx.db
        .query("scheduledTasks")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    }
    return await ctx.db.query("scheduledTasks").collect();
  },
});

export const getUpcoming = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 7;
    const now = Date.now();
    const endDate = now + days * 24 * 60 * 60 * 1000;
    
    return await ctx.db
      .query("scheduledTasks")
      .withIndex("by_nextRun")
      .filter((q) =>
        q.and(
          q.gte(q.field("nextRunAt"), now),
          q.lte(q.field("nextRunAt"), endDate)
        )
      )
      .collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    cronExpression: v.optional(v.string()),
    nextRunAt: v.number(),
    status: v.string(),
    payload: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("scheduledTasks", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("scheduledTasks"),
    status: v.optional(v.string()),
    nextRunAt: v.optional(v.number()),
    lastRunAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

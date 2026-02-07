import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    if (args.category) {
      const category = args.category;
      const q = ctx.db.query("activities")
        .withIndex("by_category", (q) => q.eq("category", category))
        .order("desc");
      return await q.take(limit);
    }
    
    const q = ctx.db.query("activities").order("desc");
    return await q.take(limit);
  },
});

export const add = mutation({
  args: {
    action: v.string(),
    description: v.string(),
    category: v.string(),
    status: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_timestamp")
      .filter((q) => 
        q.and(
          q.gte(q.field("timestamp"), args.startDate),
          q.lte(q.field("timestamp"), args.endDate)
        )
      )
      .collect();
    
    return activities;
  },
});

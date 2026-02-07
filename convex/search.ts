import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const searchAll = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.query || args.query.length < 2) {
      return { documents: [], activities: [], tasks: [] };
    }

    const searchTerm = args.query.toLowerCase();

    // Search documents
    const documents = await ctx.db
      .query("documents")
      .withSearchIndex("search_content", (q) => q.search("content", args.query))
      .take(20);

    // Search activities (manual filter since no search index)
    const allActivities = await ctx.db.query("activities").order("desc").take(100);
    const activities = allActivities.filter(
      (a) =>
        a.action.toLowerCase().includes(searchTerm) ||
        a.description.toLowerCase().includes(searchTerm)
    );

    // Search tasks
    const allTasks = await ctx.db.query("scheduledTasks").collect();
    const tasks = allTasks.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTerm) ||
        t.description.toLowerCase().includes(searchTerm)
    );

    return { documents, activities: activities.slice(0, 20), tasks };
  },
});

export const addDocument = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    path: v.string(),
    type: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", {
      ...args,
      lastModified: Date.now(),
    });
  },
});

export const syncDocument = mutation({
  args: {
    path: v.string(),
    title: v.string(),
    content: v.string(),
    type: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if document exists
    const existing = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("path"), args.path))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        type: args.type,
        tags: args.tags,
        lastModified: Date.now(),
      });
    } else {
      return await ctx.db.insert("documents", {
        ...args,
        lastModified: Date.now(),
      });
    }
  },
});

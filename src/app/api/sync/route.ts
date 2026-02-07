import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { NextRequest, NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documents, tasks } = body;

    const results = {
      documents: [] as string[],
      tasks: [] as string[],
    };

    // Sync documents
    if (documents && Array.isArray(documents)) {
      for (const doc of documents) {
        const result = await convex.mutation(api.search.syncDocument, {
          path: doc.path,
          title: doc.title,
          content: doc.content,
          type: doc.type || "note",
          tags: doc.tags || [],
        });
        results.documents.push(doc.path);
      }
    }

    // Sync tasks (from cron jobs)
    if (tasks && Array.isArray(tasks)) {
      for (const task of tasks) {
        const result = await convex.mutation(api.scheduledTasks.add, {
          name: task.name,
          description: task.description,
          cronExpression: task.cronExpression,
          nextRunAt: task.nextRunAt,
          status: task.status || "active",
          payload: task.payload,
        });
        results.tasks.push(task.name);
      }
    }

    return NextResponse.json({ success: true, synced: results });
  } catch (error) {
    console.error("Error syncing data:", error);
    return NextResponse.json(
      { error: "Failed to sync data" },
      { status: 500 }
    );
  }
}

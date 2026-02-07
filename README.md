# Mission Control

Your AI assistant command center — track every action, view scheduled tasks, and search across all your documents.

## Features

- **Activity Feed**: Real-time log of every action and task completed
- **Calendar View**: Weekly view of all scheduled tasks and cron jobs
- **Global Search**: Search across memories, documents, and tasks

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Convex

Create a Convex account at [convex.dev](https://convex.dev) if you haven't already.

```bash
npx convex dev
```

This will:
- Create a new Convex project (or link to existing)
- Generate the `convex/_generated` directory
- Give you your deployment URL

### 3. Configure environment

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Add your Convex URL to `.env.local`:

```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## API Endpoints

### Log Activity

```bash
POST /api/activity
{
  "action": "Sent message",
  "description": "Replied to Seb about the article draft",
  "category": "message",
  "status": "completed",
  "metadata": { "channel": "telegram" }
}
```

### Sync Documents & Tasks

```bash
POST /api/sync
{
  "documents": [
    {
      "path": "/memory/2026-02-07.md",
      "title": "Daily Notes - Feb 7",
      "content": "...",
      "type": "memory",
      "tags": ["daily", "notes"]
    }
  ],
  "tasks": [
    {
      "name": "Trading Caller Monitor",
      "description": "Check Railway deployment status",
      "nextRunAt": 1770424716492,
      "status": "active"
    }
  ]
}
```

## Categories

Activities are categorized as:
- `task` - Completed tasks
- `message` - Sent/received messages
- `file` - File operations
- `search` - Search queries
- `cron` - Scheduled job executions
- `system` - System events

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Convex
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

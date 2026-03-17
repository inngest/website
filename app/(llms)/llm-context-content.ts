export const llmContextContent = `# Inngest Integration Guide

After provisioning, your \`access_configuration\` contains the credentials needed to integrate Inngest into your application.

## Environment Variables

Add these to your \`.env\` file (or your platform's environment configuration):

\`\`\`
INNGEST_SIGNING_KEY=<your signing key from access_configuration>
INNGEST_EVENT_KEY=<your event key from access_configuration>
\`\`\`

The signing key authenticates communication between your app and Inngest. The event key is used to send events that trigger functions.

## SDK Installation

### TypeScript / JavaScript
\`\`\`bash
npm install inngest
\`\`\`

### Python
\`\`\`bash
pip install inngest
\`\`\`

## Creating the Inngest Client

### TypeScript
\`\`\`typescript
import { Inngest } from "inngest";

const inngest = new Inngest({ id: "my-app" });
\`\`\`

### Python
\`\`\`python
import inngest

client = inngest.Inngest(app_id="my-app")
\`\`\`

## Writing Functions

Functions are the core building block. Each function is triggered by an event or a cron schedule.

### Event-triggered function (TypeScript)
\`\`\`typescript
const processUpload = inngest.createFunction(
  { id: "process-upload" },
  { event: "app/file.uploaded" },
  async ({ event, step }) => {
    const result = await step.run("process", async () => {
      return await processFile(event.data.fileUrl);
    });

    await step.run("notify", async () => {
      await sendNotification(event.data.userId, result);
    });

    return { success: true };
  }
);
\`\`\`

### Cron function (TypeScript)
\`\`\`typescript
const dailyCleanup = inngest.createFunction(
  { id: "daily-cleanup" },
  { cron: "0 0 * * *" },
  async ({ step }) => {
    await step.run("cleanup", async () => {
      return await cleanupOldRecords();
    });
  }
);
\`\`\`

### Event-triggered function (Python)
\`\`\`python
@client.create_function(
    fn_id="process-upload",
    trigger=inngest.TriggerEvent(event="app/file.uploaded"),
)
async def process_upload(ctx: inngest.Context, step: inngest.Step):
    async def process():
        return await process_file(ctx.event.data["file_url"])

    result = await step.run("process", process)

    async def notify():
        await send_notification(ctx.event.data["user_id"], result)

    await step.run("notify", notify)
    return {"success": True}
\`\`\`

### Cron function (Python)
\`\`\`python
@client.create_function(
    fn_id="daily-cleanup",
    trigger=inngest.TriggerCron(cron="0 0 * * *"),
)
async def daily_cleanup(ctx: inngest.Context, step: inngest.Step):
    async def cleanup():
        return await cleanup_old_records()

    await step.run("cleanup", cleanup)
\`\`\`

## Serving Functions

Use the \`serve()\` handler to expose your functions via an HTTP endpoint. Inngest calls this endpoint to discover and invoke your functions.

### Next.js (App Router)
\`\`\`typescript
// app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processUpload, dailyCleanup } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processUpload, dailyCleanup],
});
\`\`\`

### Express
\`\`\`typescript
import express from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client";
import { processUpload, dailyCleanup } from "./inngest/functions";

const app = express();

app.use("/api/inngest", serve({
  client: inngest,
  functions: [processUpload, dailyCleanup],
}));

app.listen(3000);
\`\`\`

### FastAPI (Python)
\`\`\`python
import inngest
import inngest.fast_api
from fastapi import FastAPI

app = FastAPI()
client = inngest.Inngest(app_id="my-app")

inngest.fast_api.serve(app, client, [process_upload, daily_cleanup])
\`\`\`

## Sending Events

Trigger functions by sending events from anywhere in your application.

### TypeScript
\`\`\`typescript
await inngest.send({
  name: "app/file.uploaded",
  data: {
    fileUrl: "https://example.com/file.pdf",
    userId: "user_123",
  },
});
\`\`\`

### Python
\`\`\`python
await client.send(
    inngest.Event(
        name="app/file.uploaded",
        data={
            "file_url": "https://example.com/file.pdf",
            "user_id": "user_123",
        },
    )
)
\`\`\`

### REST API
\`\`\`bash
curl -X POST https://inn.gs/e/<INNGEST_EVENT_KEY> \\
  -H "Content-Type: application/json" \\
  -d '{"name": "app/file.uploaded", "data": {"fileUrl": "https://example.com/file.pdf"}}'
\`\`\`

## Deployment

After deploying your application, Inngest needs to discover your functions by calling your serve endpoint.

1. Deploy your app with the serve endpoint accessible at a public URL
2. Inngest automatically syncs when your app starts, or you can trigger a sync from the dashboard
3. You can also sync manually via the REST API:
\`\`\`bash
curl -X PUT "https://api.inngest.com/v1/syncs" \\
  -H "Authorization: Bearer <INNGEST_SIGNING_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://your-app.com/api/inngest"}'
\`\`\`

## REST API v2

Inngest provides a REST API for managing your account and resources programmatically.

**Authentication**: Include your signing key as a Bearer token:
\`\`\`
Authorization: Bearer <INNGEST_SIGNING_KEY>
\`\`\`

To target a specific environment, include the optional header:
\`\`\`
X-Inngest-Env: <environment-id>
\`\`\`

### Available Endpoints

- \`GET https://api.inngest.com/v2/account\` -- Fetch account information
- \`GET https://api.inngest.com/v2/envs\` -- List environments (workspaces)
- \`POST https://api.inngest.com/v2/envs\` -- Create a new environment
- \`GET https://api.inngest.com/v2/keys/signing\` -- List signing keys
- \`GET https://api.inngest.com/v2/keys/events\` -- List event keys

## Dashboard

Access your Inngest dashboard using the \`dashboard_url\` from your \`access_configuration\` to view function runs, manage environments, and monitor your workflows.

## Further Documentation

For comprehensive documentation including advanced features like concurrency control, throttling, batching, fan-out patterns, and more, see the full documentation index at https://www.inngest.com/llms.txt
`;

export const llmContextHeaders = {
  "Content-Type": "text/markdown;charset=UTF-8",
  "Cache-Control": "s-maxage=360, stale-while-revalidate",
};

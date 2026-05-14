# Patterns Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the `/patterns/` page: refresh the 10 pattern MDX files for v4 SDK syntax and Diataxis-Explanation framing, redirect 2 obsolete pages to existing guides, rename two docs nav sections, add a featured-pattern hero, and add a Humans/Agents view toggle with `/md` raw-markdown routes.

**Architecture:** Three independent tracks on top of the existing Pages-Router site. (1) Content edits to MDX files under `pages/patterns/_patterns/` plus 2 redirects in `next.config.mjs`. (2) Nav rename in `shared/Docs/navigationStructure.ts`. (3) New UI features — Featured component mounted on `/patterns/` index, plus a fixed-position view toggle that flips between rendered HTML and raw markdown served from API routes at `/patterns/md` and `/patterns/{slug}/md` (URL-rewritten to `/api/patterns/...`).

**Tech Stack:** Next.js 14+ (Pages Router), TypeScript, MDX via `next-mdx-remote` with `gray-matter` frontmatter, Tailwind for existing UI, plain CSS files for new components (matches design handoff).

**Conventions:**
- No test framework installed in this repo. Verification is via `pnpm tsc --noEmit` and manual browser inspection.
- Use `pnpm` for installs/scripts (existing convention).
- Commit after each task. Use Conventional Commits style (`feat:`, `fix:`, `refactor:`, `docs:`).
- Run `pnpm tsc --noEmit -p tsconfig.json` after any TS-touching task; expected: clean (one pre-existing stale `.next/types/validator.ts` warning is acceptable until next build regenerates).

---

## Phase 1: Content Refresh

### Task 1: Redirect 2 obsolete patterns to existing guides

These two patterns are feature-usage pages, not real patterns (per the Diataxis audit in conversation). Their content already exists at `/docs/guides/`. Redirect rather than rewrite.

**Files:**
- Modify: `next.config.mjs` (append to `permanentRedirects` tuple array at line 11)
- Delete: `pages/patterns/_patterns/cancelling-scheduled-functions.mdx`
- Delete: `pages/patterns/_patterns/running-code-on-a-schedule.mdx`

- [ ] **Step 1: Add the 2 redirects to `next.config.mjs`**

Find the closing `];` of the `permanentRedirects` array (around line 178 — search for `["/docs/sdk/migration",`). Insert these two entries just before the closing bracket:

```js
  ["/patterns/cancelling-scheduled-functions", "/docs/guides/cancel-running-functions"],
  ["/patterns/running-code-on-a-schedule", "/docs/guides/scheduled-functions"],
```

- [ ] **Step 2: Delete the two MDX files**

```bash
rm pages/patterns/_patterns/cancelling-scheduled-functions.mdx pages/patterns/_patterns/running-code-on-a-schedule.mdx
```

- [ ] **Step 3: Verify typecheck still passes**

```bash
pnpm tsc --noEmit -p tsconfig.json
```

Expected: clean (other than the pre-existing stale `.next/types/validator.ts` warning if it exists — ignore).

- [ ] **Step 4: Verify the patterns index renders with 8 patterns instead of 10**

Start dev server and visit `/patterns`. The hero stat should read "8 Patterns / 5 Primitives". The events section should now contain 2 patterns (not 4). Stop the dev server.

```bash
pnpm dev
# visit http://localhost:3000/patterns in browser, verify counts
```

- [ ] **Step 5: Commit**

```bash
git add next.config.mjs pages/patterns/_patterns/
git commit -m "refactor(patterns): drop 2 feature-usage pages and redirect to guides

cancelling-scheduled-functions and running-code-on-a-schedule were
recipes for primitives (cancelOn, cron triggers), not Diataxis-shape
patterns. Both have existing guide pages that cover the same ground.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Mechanical conversion rules (used by tasks 2–9)

Each of the following tasks modernizes one pattern MDX file. The same mechanical rules apply to every file; per-task instructions only call out file-specific differences.

**Rule A — v4 SDK function signature.** Convert every `createFunction` call from the 3-argument legacy form to the 2-argument v4 form:

Old:
```ts
inngest.createFunction(
  { id: "fn-id" },
  { event: "x/y.z" },
  async ({ event, step }) => { /* ... */ }
);
```

New:
```ts
inngest.createFunction(
  { id: "fn-id", triggers: [{ event: "x/y.z" }] },
  async ({ event, step }) => { /* ... */ }
);
```

For cron triggers, the legacy form is `{ cron: "0 9 * * MON" }` as the second argument; the v4 form moves it inside `triggers: [{ cron: "0 9 * * MON" }]`.

**Rule B — Inngest constructor.** Convert any string-arg constructor to the object form:

Old: `new Inngest("API")`
New: `new Inngest({ id: "API" })`

**Rule C — section headers (Diataxis fix).** Rename the following headers wherever they appear:

| Old | New |
|---|---|
| `## How to implement this pattern` | `## How this works` |
| `## How to implement with Inngest` | `## With Inngest` |

Use the `Edit` tool with `replace_all: true` for these — they're safe global swaps within each file.

---

### Task 2: Modernize `flash-sales-and-bursty-workflows.mdx`

This is the canonical pattern. It already uses v4 syntax and doesn't have the "How to implement" headers. Verify and skip rewrites; just confirm no changes needed.

**Files:**
- Verify: `pages/patterns/_patterns/flash-sales-and-bursty-workflows.mdx`

- [ ] **Step 1: Confirm no changes needed**

```bash
grep -n "createFunction\|## How to implement\|new Inngest" pages/patterns/_patterns/flash-sales-and-bursty-workflows.mdx
```

Expected: `createFunction` lines all use `triggers: [...]`. No `## How to implement` matches. No string-arg `new Inngest`. If any of these match, apply Rules A/B/C above.

- [ ] **Step 2: No commit needed for this task** (verification only)

---

### Task 3: Modernize `event-coordination-for-lost-customers.mdx`

Apply Rules A and C. The file has 2 `createFunction` calls (cart-abandonment-flow, generateAndPublish).

**Files:**
- Modify: `pages/patterns/_patterns/event-coordination-for-lost-customers.mdx`

- [ ] **Step 1: Apply v4 SDK conversion to cart-abandonment-flow function**

Find this block (around line 23–35):

```ts
export default inngest.createFunction(
  {
    id: "cart-abandonment-flow",
    // Cancel this instance whenever the user adds another product.
    // A new instance starts, resetting the 24-hour window.
    cancelOn: {
      event: "cart/product.added",
      timeout: "24h",
      match: "data.cart_id",
    },
  },
  { event: "cart/product.added" },
  async ({ event, step }) => {
```

Replace with:

```ts
export default inngest.createFunction(
  {
    id: "cart-abandonment-flow",
    triggers: [{ event: "cart/product.added" }],
    // Cancel this instance whenever the user adds another product.
    // A new instance starts, resetting the 24-hour window.
    cancelOn: {
      event: "cart/product.added",
      timeout: "24h",
      match: "data.cart_id",
    },
  },
  async ({ event, step }) => {
```

- [ ] **Step 2: Apply v4 SDK conversion to generateAndPublish function**

Find:

```ts
export const generateAndPublish = inngest.createFunction(
  { id: "generate-and-publish" },
  { event: "content/generation.requested" },
  async ({ event, step }) => {
```

Replace with:

```ts
export const generateAndPublish = inngest.createFunction(
  { id: "generate-and-publish", triggers: [{ event: "content/generation.requested" }] },
  async ({ event, step }) => {
```

- [ ] **Step 3: Rename "How to implement" header**

Find: `## How to implement this pattern`
Replace with: `## How this works`

(Use Edit with `replace_all: true`.)

- [ ] **Step 4: Verify typecheck**

```bash
pnpm tsc --noEmit -p tsconfig.json
```

Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add pages/patterns/_patterns/event-coordination-for-lost-customers.mdx
git commit -m "refactor(patterns): modernize event-coordination-for-lost-customers

- Convert createFunction to v4 triggers[] syntax
- Rename 'How to implement' section to 'How this works' (Diataxis)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Modernize `reliably-run-critical-workflows.mdx`

Apply Rules A and C. Has 1 `createFunction` call. Already has a strong "Alternative approaches" section — no content additions needed.

**Files:**
- Modify: `pages/patterns/_patterns/reliably-run-critical-workflows.mdx`

- [ ] **Step 1: Apply v4 SDK conversion**

Find:

```ts
export const processDocument = inngest.createFunction(
  { id: "process-uploaded-document" },
  { event: "api/document.uploaded" },
  async ({ event, step }) => {
```

Replace with:

```ts
export const processDocument = inngest.createFunction(
  { id: "process-uploaded-document", triggers: [{ event: "api/document.uploaded" }] },
  async ({ event, step }) => {
```

- [ ] **Step 2: Rename section header**

Find: `## How to implement with Inngest`
Replace with: `## With Inngest`

- [ ] **Step 3: Verify typecheck and commit**

```bash
pnpm tsc --noEmit -p tsconfig.json
git add pages/patterns/_patterns/reliably-run-critical-workflows.mdx
git commit -m "refactor(patterns): modernize reliably-run-critical-workflows

- Convert createFunction to v4 triggers[] syntax
- Rename 'How to implement with Inngest' to 'With Inngest' (Diataxis)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Modernize `running-functions-in-parallel.mdx`

Apply Rules A and C. Has 3 `createFunction` calls (summarize, classify, extractEntities). Existing "Alternative event-driven systems" section is good — keep it.

**Files:**
- Modify: `pages/patterns/_patterns/running-functions-in-parallel.mdx`

- [ ] **Step 1: Convert all 3 createFunction calls**

Apply this transformation to each (the `id` strings differ but the shape is identical):

Old:
```ts
inngest.createFunction(
  { id: "summarize-content" },
  { event: "document/uploaded" },
  async ({ event, step }) => {
```

New:
```ts
inngest.createFunction(
  { id: "summarize-content", triggers: [{ event: "document/uploaded" }] },
  async ({ event, step }) => {
```

Repeat for `classify-document` and `extract-entities` (same event trigger `document/uploaded` for all three).

- [ ] **Step 2: Rename section header**

Find: `## How to implement this pattern`
Replace with: `## How this works`

- [ ] **Step 3: Rename the "Alternative event-driven systems" subsection**

Current text uses `**Alternative event-driven systems**` (bold inline, not a header). Promote to a proper heading for IA consistency. Find:

```
**Alternative event-driven systems**

You can build an event-driven system using NATS, Redis, or Kafka,
```

Replace with:

```
## Alternative approaches

You can build an event-driven system using NATS, Redis, or Kafka,
```

- [ ] **Step 4: Verify typecheck and commit**

```bash
pnpm tsc --noEmit -p tsconfig.json
git add pages/patterns/_patterns/running-functions-in-parallel.mdx
git commit -m "refactor(patterns): modernize running-functions-in-parallel

- Convert 3 createFunction calls to v4 triggers[] syntax
- Rename 'How to implement' to 'How this works'
- Promote 'Alternative event-driven systems' to a proper section heading

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Modernize `reliable-scheduling-systems.mdx`

Apply Rules A, B, and C. Add an "Alternative approaches" section (currently missing). Sharpen the distinction from `running-functions-in-parallel` (this pattern is *time-driven* fan-out, the other is *event-driven*).

**Files:**
- Modify: `pages/patterns/_patterns/reliable-scheduling-systems.mdx`

- [ ] **Step 1: Apply v4 SDK conversion to slackCron**

Find:

```ts
const slackCron = inngest.createFunction(
  { id: "slack-notification-cron" },
  { cron: "0 9,12 * * MON,FRI" },
  async () => {
```

Replace with:

```ts
const slackCron = inngest.createFunction(
  { id: "slack-notification-cron", triggers: [{ cron: "0 9,12 * * MON,FRI" }] },
  async () => {
```

- [ ] **Step 2: Apply v4 SDK conversion to postSlackNotification**

Find:

```ts
const postSlackNotification = inngest.createFunction(
  { id: "send-slack-notification" },
  { event: "app/notification.dispatched" },
  async ({ event }) => {
```

Replace with:

```ts
const postSlackNotification = inngest.createFunction(
  { id: "send-slack-notification", triggers: [{ event: "app/notification.dispatched" }] },
  async ({ event }) => {
```

- [ ] **Step 3: Fix the duplicate Inngest constructor**

The file has both `import { inngest } from "./client";` and `const inngest = new Inngest({ id: "scheduling-backend" });` — that's a re-declaration that shouldn't be in example code. Remove the redundant line:

Find:
```ts
import { inngest } from "./client";

const inngest = new Inngest({ id: "scheduling-backend" });

// A scheduled function uses the current time to find notifications to send
```

Replace with:
```ts
import { inngest } from "./client";

// A scheduled function uses the current time to find notifications to send
```

- [ ] **Step 4: Rename section headers**

- `## How to implement this pattern` → `## How this works`
- `## How to implement with Inngest` → `## With Inngest`

- [ ] **Step 5: Add "Alternative approaches" section**

Find the existing "## Additional Resources" line. Insert a new section just *before* it:

```markdown
## Alternative approaches

You can wire cron-driven fan-out yourself, but each component carries its own failure modes:

- **Cron + queue (SQS, BullMQ, Sidekiq):** the cron enqueues jobs, workers consume them. Workable, but you own the worker fleet, the queue's dead-letter routing, and the observability story across both halves.
- **Cron + serverless function:** simpler to run, but most serverless platforms cap function duration at 5–15 minutes. A single cron that fans out across 10,000 tenants can't finish before the platform kills it.
- **All-in-one in the cron:** what people start with. Works at 100 tenants, breaks at 10,000 when the cron itself runs longer than its interval and starts lapping itself.

The Inngest version above keeps the cron lightweight — it only loads IDs and sends events. Each tenant's work runs as an independently-retried function with its own logs, retries, and concurrency budget.

```

(Note the trailing blank line — leave it so the next heading is properly separated.)

- [ ] **Step 6: Verify typecheck and commit**

```bash
pnpm tsc --noEmit -p tsconfig.json
git add pages/patterns/_patterns/reliable-scheduling-systems.mdx
git commit -m "refactor(patterns): modernize reliable-scheduling-systems

- Convert createFunction to v4 triggers[] syntax (cron + event)
- Remove redundant Inngest constructor in example code
- Rename 'How to implement' headings (Diataxis)
- Add 'Alternative approaches' section comparing cron+queue, cron+serverless, and all-in-one

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Modernize `build-reliable-webhooks.mdx`

Apply Rules A and C. Cut the numbered build-your-own-queue recipe (Diataxis how-to drift). Replace it with a paragraph on the failure modes. Add an "Alternative approaches" section.

**Files:**
- Modify: `pages/patterns/_patterns/build-reliable-webhooks.mdx`

- [ ] **Step 1: Apply v4 SDK conversion to handlePaymentFailed**

Find:

```ts
export const handlePaymentFailed = inngest.createFunction(
  { id: "handle-payment-failed" },
  { event: "stripe/invoice.payment_failed" },
  async ({ event, step }) => {
```

Replace with:

```ts
export const handlePaymentFailed = inngest.createFunction(
  { id: "handle-payment-failed", triggers: [{ event: "stripe/invoice.payment_failed" }] },
  async ({ event, step }) => {
```

- [ ] **Step 2: Apply v4 SDK conversion to handleModelCallback**

Find:

```ts
export const handleModelCallback = inngest.createFunction(
  { id: "handle-model-result" },
  { event: "ai/inference.completed" },
  async ({ event, step }) => {
```

Replace with:

```ts
export const handleModelCallback = inngest.createFunction(
  { id: "handle-model-result", triggers: [{ event: "ai/inference.completed" }] },
  async ({ event, step }) => {
```

- [ ] **Step 3: Replace the build-your-own recipe section**

Find the section starting `## How to implement this pattern` and running through `For replays, you'll also need to write code...idempotent so that running it multiple times produces the same result.` (the entire build-your-own-queue recipe, including the numbered list).

Replace the entire section (header included) with:

```markdown
## What reliable webhook handling requires

Whatever you build, you need to cover four things:

- **Fast acknowledgement.** Most providers retry after 3–10 seconds. Your endpoint must respond well under that — usually by handing the payload off before doing any real work.
- **Signature verification.** Verify the provider's signature before you trust the payload. Stripe, GitHub, and Shopify all sign deliveries differently, and a missed verification is a security issue, not a reliability one.
- **At-least-once delivery handling.** Most providers retry on transient failures. Your handler has to be idempotent on the natural key the provider supplies (event ID, delivery ID).
- **Replay.** When you ship a bug and 10,000 events failed silently in production, you need to replay them against the new code without asking the provider to resend.

In a hand-rolled system, that's a webhook handler, a queue (Redis/SQS/RabbitMQ), a worker process, a dead-letter queue, a log archive, and a replay job. Each adds its own operational surface.
```

- [ ] **Step 4: Rename remaining section header**

Find: `## How to implement with Inngest`
Replace with: `## With Inngest`

- [ ] **Step 5: Add "Alternative approaches" section before "Additional Resources"**

Find the line `## Additional Resources`. Insert just before it:

```markdown
## Alternative approaches

- **AWS API Gateway + SQS + Lambda.** Works, but you're now wiring three services together and writing your own retry/dead-letter routing. Replay means querying CloudWatch logs and re-publishing manually.
- **Hosted webhook gateways (Hookdeck, Svix).** Closer to what Inngest does for webhook *ingestion* — but they hand off to your own job runner, so you still need a durable execution layer downstream.
- **Direct in your API.** Skipping the queue entirely. Fine until your endpoint stalls for 30 seconds during an LLM call and the provider stops delivering.

```

- [ ] **Step 6: Verify typecheck and commit**

```bash
pnpm tsc --noEmit -p tsconfig.json
git add pages/patterns/_patterns/build-reliable-webhooks.mdx
git commit -m "refactor(patterns): modernize build-reliable-webhooks

- Convert createFunction to v4 triggers[] syntax (Stripe + AI callback)
- Cut the build-your-own-queue numbered recipe (Diataxis how-to drift)
- Add 'What reliable webhook handling requires' conceptual section
- Add 'Alternative approaches' comparing API Gateway, hosted webhook gateways, and inline handling

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Modernize `keeping-your-api-fast.mdx`

Apply Rules A and C. Cut the 7-step queue-infra recipe (heavy how-to drift). Replace with a paragraph on the responsibilities. Add an "Alternative approaches" section.

**Files:**
- Modify: `pages/patterns/_patterns/keeping-your-api-fast.mdx`

- [ ] **Step 1: Apply v4 SDK conversion to processDocument**

Find:

```ts
export const processDocument = inngest.createFunction(
  { id: "process-document" },
  { event: "api/document.uploaded" },
  async ({ event, step }) => {
```

Replace with:

```ts
export const processDocument = inngest.createFunction(
  { id: "process-document", triggers: [{ event: "api/document.uploaded" }] },
  async ({ event, step }) => {
```

(The inline `app.post(...)` API handler in this file uses `new Inngest({ id: "my-app" })` — already v4. No change.)

- [ ] **Step 2: Replace the 7-step queue recipe**

Find the section starting `## How to implement this pattern` and running through the bullet list ending with `Define how you'll re-route messages from your dead-letter queue`.

Replace with:

```markdown
## What this requires

A request handler that finishes in under a second has to push every non-essential piece of work elsewhere:

- **A transport** to hand the work off — a queue, an event bus, or an HTTP call to another service.
- **A worker** that picks it up — long-running process, container, or serverless function — and a way to deploy and observe it.
- **Retry semantics** when the worker fails. At-least-once delivery, dead-letter routing, and a way to inspect what's stuck.
- **Idempotency** so that retries don't double-charge, double-send, or double-create.

In a hand-rolled system, each of these is a separate concern with separate operational tooling. Most teams build it incrementally and end up with a system that no single person on the team fully understands.
```

- [ ] **Step 3: Rename remaining section header**

Find: `## How to implement with Inngest`
Replace with: `## With Inngest`

- [ ] **Step 4: Add "Alternative approaches" section before "Additional Resources"**

Find the line `## Additional Resources`. Insert just before it:

```markdown
## Alternative approaches

- **Redis + BullMQ / Celery / Sidekiq.** Mature, well-understood. You own the Redis instance, the worker fleet, and the observability layer that ties them together.
- **AWS SQS + Lambda.** Serverless workers solve the hosting problem but introduce SQS-specific behaviors (visibility timeouts, batching, redrive policies) you now have to learn and operate.
- **Inline in the request.** No queue, no worker — fine for sub-100ms tasks. Becomes a problem the first time someone adds an LLM call.

```

- [ ] **Step 5: Verify typecheck and commit**

```bash
pnpm tsc --noEmit -p tsconfig.json
git add pages/patterns/_patterns/keeping-your-api-fast.mdx
git commit -m "refactor(patterns): modernize keeping-your-api-fast

- Convert createFunction to v4 triggers[] syntax
- Cut the 7-step queue-infrastructure recipe (Diataxis how-to drift)
- Add 'What this requires' conceptual section
- Add 'Alternative approaches' comparing Redis-based, SQS+Lambda, and inline

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Modernize `running-at-specific-times.mdx`

Apply Rules A, B, and C. Replace the v1 string-arg Inngest constructor. Add an "Alternative approaches" section.

**Files:**
- Modify: `pages/patterns/_patterns/running-at-specific-times.mdx`

- [ ] **Step 1: Fix the v1 Inngest constructor (Rule B)**

Find:

```ts
import { Inngest } from "inngest";

// Create a new client
const inngest = new Inngest("API");
```

Replace with:

```ts
import { Inngest } from "inngest";

// Create a new client
const inngest = new Inngest({ id: "API" });
```

- [ ] **Step 2: Apply v4 SDK conversion to the delayed function**

Find:

```ts
const delayed = inngest.createFunction(
  { id: "schedule-post" },
  { event: "blog/post.scheduled" },
  async ({ event, step }) => {
```

Replace with:

```ts
const delayed = inngest.createFunction(
  { id: "schedule-post", triggers: [{ event: "blog/post.scheduled" }] },
  async ({ event, step }) => {
```

- [ ] **Step 3: Rename section header**

Find: `## How to implement this pattern`
Replace with: `## How this works`

- [ ] **Step 4: Add "Alternative approaches" section before "Additional Resources"**

Find the line `## Additional Resources`. Insert just before it:

```markdown
## Alternative approaches

- **Scheduled queue jobs.** Most job queues (BullMQ, Sidekiq, SQS with delay queues) accept a `runAt` or delay parameter when enqueueing. Works for delays under ~15 minutes; provider-specific limits kick in beyond that, and your jobs hold queue resources the whole time they wait.
- **Cron + a database table.** Run a sweeper cron that polls a `scheduled_jobs` table for due work. Simple, but the cron is now the bottleneck (see [Reliable scheduling systems](/patterns/reliable-scheduling-systems)) and "due" is rounded to the cron interval.
- **Inline `setTimeout`.** Works locally; gets erased the moment your server restarts. Don't.

The pattern above — emit an event with a future timestamp, then `sleepUntil` inside a durable function — keeps the wait state in Inngest rather than your queue, and survives deploys without re-architecting anything.

```

- [ ] **Step 5: Verify typecheck and commit**

```bash
pnpm tsc --noEmit -p tsconfig.json
git add pages/patterns/_patterns/running-at-specific-times.mdx
git commit -m "refactor(patterns): modernize running-at-specific-times

- Replace v1 string-arg Inngest constructor with v4 object form
- Convert createFunction to v4 triggers[] syntax
- Rename 'How to implement' to 'How this works'
- Add 'Alternative approaches' comparing scheduled queues, cron+table, and setTimeout

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 2: Nav Reorg

### Task 10: Rename "AI Patterns" → "Agents" in docs nav

The nav currently labels the section "AI Patterns" with paths under `/docs/ai-patterns/`. Per the conversation: rename heading only; leave paths alone. (Path migration would force redirects on three guides without product benefit right now.)

**Files:**
- Modify: `shared/Docs/navigationStructure.ts:951`

- [ ] **Step 1: Rename the section title**

Find (around line 951):

```ts
      {
        title: "AI Patterns",
        links: [
```

Replace with:

```ts
      {
        title: "Agents",
        links: [
```

- [ ] **Step 2: Verify typecheck and commit**

```bash
pnpm tsc --noEmit -p tsconfig.json
git add shared/Docs/navigationStructure.ts
git commit -m "refactor(docs): rename 'AI Patterns' nav heading to 'Agents'

The contents (agent-tool-loops, human-in-the-loop, sub-agent-delegation)
are guides for building agentic systems, not Diataxis pattern pages.
'Agents' reads more accurately. Paths under /docs/ai-patterns/ are
unchanged to avoid unnecessary redirects.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Rename guides subgroup "Patterns" → "Events and Triggers"

The Guides nav has a subgroup currently labeled "Patterns" containing 10 *guides* (fan-out, delayed-functions, scheduled-functions, background-jobs, multiple-triggers, etc.) plus the Workflow Kit reference. The name is misleading. Dan's suggestion is "Events and Triggers."

**Files:**
- Modify: `shared/Docs/navigationStructure.ts:881`

- [ ] **Step 1: Rename the subgroup title**

Find (around line 881):

```ts
      {
        title: "Patterns",
        links: [
          {
            title: "Parallel steps",
            href: "/docs/guides/step-parallelism",
          },
```

Replace just the `title:` line (`"Patterns"` → `"Events and Triggers"`):

```ts
      {
        title: "Events and Triggers",
        links: [
          {
            title: "Parallel steps",
            href: "/docs/guides/step-parallelism",
          },
```

- [ ] **Step 2: Verify typecheck and commit**

```bash
pnpm tsc --noEmit -p tsconfig.json
git add shared/Docs/navigationStructure.ts
git commit -m "refactor(docs): rename Guides 'Patterns' subgroup to 'Events and Triggers'

The previous label competed with the marketing /patterns/ page and
mislabeled the contents — fan-out, delayed-functions, scheduled-functions,
background-jobs, multiple-triggers are guides, not Diataxis patterns.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 3: Featured Pattern Component

### Task 12: Add featured-pattern config + types

Add a small editorial config that promotes one existing pattern. Per the user's instruction, feature `flash-sales-and-bursty-workflows`.

**Files:**
- Create: `shared/Patterns/featured.ts`

- [ ] **Step 1: Create the featured config**

Write `shared/Patterns/featured.ts`:

```ts
// Editorial config for the promoted "featured" pattern shown on /patterns/.
// Swap the slug + copy when promoting a different pattern.

export type FeaturedPattern = {
  /** Frontmatter `pattern` value of the surviving section. */
  sectionId: string;
  /** MDX file slug (filename without extension). */
  slug: string;
  /** Eyebrow text shown above the title. */
  label: string;
  /** Editorial pitch (2–3 sentences). Distinct from the pattern's own subtitle. */
  excerpt: string;
  /** Bullets shown in the featured card. Keep to 3–4. */
  highlights: string[];
  /** ISO date used for the "Published" row. */
  publishedAt: string;
  /** Pre-formatted read time string. */
  readTime: string;
};

export const FEATURED_PATTERN: FeaturedPattern = {
  sectionId: "flow",
  slug: "flash-sales-and-bursty-workflows",
  label: "Featured pattern",
  excerpt:
    "When traffic spikes, webhooks fire twice, or third-party APIs push back, four primitives keep your pipeline upright: throttle, concurrency, debounce, and idempotency. This pattern shows when to reach for each — and how they compose on one function.",
  highlights: [
    "Throttle vs concurrency — when each matters",
    "Debounce noisy webhooks without losing the last update",
    "Idempotency keys for at-least-once delivery",
    "Compose all four on one function",
  ],
  publishedAt: "2026-05-12",
  readTime: "8 min read",
};
```

- [ ] **Step 2: Verify typecheck**

```bash
pnpm tsc --noEmit -p tsconfig.json
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add shared/Patterns/featured.ts
git commit -m "feat(patterns): add featured-pattern config

Editorial config for promoting one pattern on the /patterns/ index.
Initial promotion: flash-sales-and-bursty-workflows.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Build the Featured component

Adapt the design handoff component to Pages-Router + Tailwind-friendly. The handoff used custom CSS — we keep that approach (import a plain CSS file) since translating to Tailwind would balloon the work and we want to match the design closely.

**Files:**
- Create: `shared/Patterns/Featured.tsx`
- Create: `shared/Patterns/featured.css`

- [ ] **Step 1: Write the Featured component**

Write `shared/Patterns/Featured.tsx`:

```tsx
import Link from "next/link";
import type { FeaturedPattern } from "./featured";
import type { PatternItem, PatternSection } from "./patternsData";

import "./featured.css";

type Props = {
  featured: FeaturedPattern;
  section: PatternSection;
  pattern: PatternItem;
};

export default function Featured({ featured, section, pattern }: Props) {
  const date = new Date(featured.publishedAt + "T00:00:00Z");
  const dateStr = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const positionInSection =
    section.patterns.findIndex((p) => p.slug === pattern.slug) + 1;

  return (
    <section className={`featured ${section.accent.text}`}>
      <div className="featured-rule">
        <span className="featured-rule-tag">
          <span className="featured-rule-dot" aria-hidden />
          {featured.label}
        </span>
        <span className="featured-rule-line" />
        <span className="featured-rule-meta">
          {dateStr.toUpperCase()} · {featured.readTime.toUpperCase()}
        </span>
      </div>

      <div className="featured-card">
        <div className="featured-card-body">
          <div className="featured-card-tag">
            <span className="featured-card-tag-num">{section.number}</span>
            <span className="featured-card-tag-name">{section.name}</span>
          </div>

          <h2 className="featured-card-title">{pattern.title}</h2>
          <p className="featured-card-excerpt">{featured.excerpt}</p>

          {featured.highlights.length > 0 && (
            <ul className="featured-card-highlights">
              {featured.highlights.map((h, i) => (
                <li key={i}>
                  <span className="featured-card-highlight-marker" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="featured-card-cta-row">
            <Link href={`/patterns/${pattern.slug}`} className="featured-card-cta">
              <span>Read the pattern</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7 L11 7 M7 3 L11 7 L7 11"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </Link>
            <Link
              href={`/patterns#${section.id}`}
              className="featured-card-cta-secondary"
            >
              More in {section.name}
            </Link>
          </div>
        </div>

        <div className="featured-card-side">
          <div className="featured-card-side-meta">
            <Row label="Section" value={section.name} />
            <Row
              label="Pattern"
              value={`${String(positionInSection).padStart(2, "0")} / ${String(
                section.patterns.length
              ).padStart(2, "0")}`}
            />
            <Row label="Published" value={dateStr} />
            <Row label="Read" value={featured.readTime} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="featured-card-side-row">
      <span className="featured-card-side-label">{label}</span>
      <span className="featured-card-side-value">{value}</span>
    </div>
  );
}
```

Differences from the handoff: flat URLs (`/patterns/${slug}` not `/patterns/${sectionId}/${slug}`); secondary CTA goes to `/patterns#${section.id}` (anchor on the index); section visualization (`<Viz>`) is dropped — the handoff assumed a per-section viz component which doesn't exist in this repo. Add later if/when section vizzes are designed.

- [ ] **Step 2: Write the CSS**

Write `shared/Patterns/featured.css`. Tokens use Tailwind color names from this repo's `tailwind.config.js` resolved at build time — but for hand-authored CSS we use raw CSS variables. The closest existing globals are `--color-canvas-base`, `--color-subtle`, `--color-basis`, `--color-cta`. Verify these exist; if not, swap to literal hex from the design handoff.

```css
.featured {
  --featured-accent: var(--color-cta, #cbb26a);
  --featured-accent-soft: rgba(203, 178, 106, 0.18);
  --featured-accent-softer: rgba(203, 178, 106, 0.06);
  max-width: 1240px;
  margin: 0 auto 24px;
  padding: 0 56px;
}

.featured-rule {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 24px;
  align-items: center;
  padding: 16px 0 24px;
}
.featured-rule-tag {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: "Geist Mono", "CircularXXMono", ui-monospace, monospace;
  font-size: 11px;
  color: var(--featured-accent);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.featured-rule-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--featured-accent);
  box-shadow: 0 0 0 4px var(--featured-accent-soft);
  animation: featured-pulse 2.4s ease-in-out infinite;
}
@keyframes featured-pulse {
  0%, 100% { box-shadow: 0 0 0 4px var(--featured-accent-soft); }
  50%      { box-shadow: 0 0 0 7px var(--featured-accent-softer); }
}
.featured-rule-line {
  height: 1px;
  background: linear-gradient(to right, var(--featured-accent), transparent 70%);
  opacity: 0.45;
}
.featured-rule-meta {
  font-family: "Geist Mono", ui-monospace, monospace;
  font-size: 11px;
  color: var(--color-subtle, rgb(140, 140, 140));
  letter-spacing: 0.14em;
}

.featured-card {
  position: relative;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  border: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08));
  border-radius: 8px;
  background:
    radial-gradient(circle at 0% 0%, var(--featured-accent-soft), transparent 50%),
    linear-gradient(180deg, var(--color-canvas-base, #0a0a0a) 0%, #050505 100%);
  overflow: hidden;
}
.featured-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--featured-accent);
  opacity: 0.85;
}

.featured-card-body {
  padding: 48px 48px 48px 56px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.featured-card-tag {
  display: inline-flex;
  align-items: baseline;
  gap: 12px;
  font-family: "Geist Mono", ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.featured-card-tag-num { color: var(--featured-accent); }
.featured-card-tag-name { color: var(--color-subtle, rgb(140, 140, 140)); }

.featured-card-title {
  font-size: clamp(40px, 5vw, 64px);
  line-height: 1;
  letter-spacing: -0.03em;
  font-weight: 500;
  color: var(--color-basis, #f5f5f5);
  margin: 0;
  text-wrap: balance;
}
.featured-card-excerpt {
  font-size: 17px;
  line-height: 1.55;
  color: var(--color-subtle, rgb(180, 180, 180));
  margin: 0;
  max-width: 540px;
  text-wrap: pretty;
}

.featured-card-highlights {
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
  display: grid;
  gap: 10px;
}
.featured-card-highlights li {
  display: flex;
  align-items: baseline;
  gap: 14px;
  font-size: 14px;
  color: var(--color-subtle, rgb(180, 180, 180));
}
.featured-card-highlight-marker {
  font-family: "Geist Mono", ui-monospace, monospace;
  font-size: 10px;
  color: var(--featured-accent);
  letter-spacing: 0.1em;
  min-width: 20px;
}

.featured-card-cta-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.featured-card-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--featured-accent);
  color: #050505;
  padding: 12px 22px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.005em;
  transition: filter 0.15s ease, transform 0.1s ease;
  white-space: nowrap;
}
.featured-card-cta:hover { filter: brightness(1.1); }
.featured-card-cta:active { transform: scale(0.98); }
.featured-card-cta-secondary {
  font-size: 13px;
  color: var(--color-subtle, rgb(180, 180, 180));
  letter-spacing: -0.005em;
  border-bottom: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.18));
  padding-bottom: 2px;
  transition: color 0.15s ease, border-color 0.15s ease;
  white-space: nowrap;
}
.featured-card-cta-secondary:hover {
  color: var(--featured-accent);
  border-color: var(--featured-accent);
}

.featured-card-side {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  border-left: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08));
}
.featured-card-side-meta {
  padding: 32px 32px 24px;
  display: grid;
  gap: 14px;
}
.featured-card-side-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 14px;
  align-items: baseline;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--color-border-subtle, rgba(255, 255, 255, 0.08));
}
.featured-card-side-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}
.featured-card-side-label {
  font-family: "Geist Mono", ui-monospace, monospace;
  font-size: 10px;
  color: var(--color-subtle, rgb(140, 140, 140));
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.featured-card-side-value {
  font-size: 13px;
  color: var(--color-basis, #f5f5f5);
  letter-spacing: -0.005em;
}

@media (max-width: 960px) {
  .featured { padding: 0 24px; }
  .featured-card { grid-template-columns: 1fr; }
  .featured-card-body { padding: 32px 28px 32px 32px; }
  .featured-card-side {
    border-left: 0;
    border-top: 1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08));
  }
}
```

- [ ] **Step 3: Verify typecheck and commit**

```bash
pnpm tsc --noEmit -p tsconfig.json
git add shared/Patterns/Featured.tsx shared/Patterns/featured.css
git commit -m "feat(patterns): add Featured component for the patterns index

Editorial hero card adapted from the design handoff for Pages Router.
Drops the per-section visualization (handoff assumed components we
don't have yet) and uses flat /patterns/{slug} URLs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Mount Featured in `/patterns/` index

**Files:**
- Modify: `pages/patterns/index.tsx`

- [ ] **Step 1: Import the Featured component and config**

In `pages/patterns/index.tsx`, after the existing import line `import PATTERNS_DATA, { type PatternSection } from "../../shared/Patterns/patternsData";`, add:

```tsx
import Featured from "../../shared/Patterns/Featured";
import { FEATURED_PATTERN } from "../../shared/Patterns/featured";
```

- [ ] **Step 2: Resolve the featured pattern in `getStaticProps`**

In `getStaticProps`, after the `const sections: PatternSection[] = PATTERN_SECTIONS.flatMap(...)` block, add resolution and a defensive null fallback (so a stale slug never crashes the build):

```ts
  const featuredSection = sections.find((s) => s.id === FEATURED_PATTERN.sectionId);
  const featuredPattern = featuredSection?.patterns.find(
    (p) => p.slug === FEATURED_PATTERN.slug
  );
  const featuredPayload =
    featuredSection && featuredPattern
      ? {
          featured: FEATURED_PATTERN,
          section: featuredSection,
          pattern: featuredPattern,
        }
      : null;
```

Then update the returned `props` to include it:

```ts
  return {
    props: {
      sections,
      featuredPayload,
      designVersion: "2",
      meta: {
        title: "Patterns — How to build with Inngest",
        description:
          "Production-tested patterns for AI agents, durable workflows, and the event-driven systems they live in.",
        image: "/assets/patterns/og-image-patterns.jpg",
      },
    },
  };
```

- [ ] **Step 3: Render Featured between hero and sections**

Update the `Patterns` component signature and render. Find:

```tsx
export default function Patterns({ sections }: { sections: PatternSection[] }) {
```

Replace with:

```tsx
type FeaturedPayload = {
  featured: typeof FEATURED_PATTERN;
  section: PatternSection;
  pattern: PatternSection["patterns"][number];
};

export default function Patterns({
  sections,
  featuredPayload,
}: {
  sections: PatternSection[];
  featuredPayload: FeaturedPayload | null;
}) {
```

Then between the closing `</Container>` of the hero and the `{/* Sections */}` comment, insert:

```tsx
      {/* Featured pattern */}
      {featuredPayload && (
        <Featured
          featured={featuredPayload.featured}
          section={featuredPayload.section}
          pattern={featuredPayload.pattern}
        />
      )}
```

- [ ] **Step 4: Verify typecheck**

```bash
pnpm tsc --noEmit -p tsconfig.json
```

Expected: clean.

- [ ] **Step 5: Verify in browser**

```bash
pnpm dev
# Visit http://localhost:3000/patterns
# Confirm: Featured card appears between hero and the first section.
# Confirm: "Read the pattern" link goes to /patterns/flash-sales-and-bursty-workflows
# Confirm: "More in Flow Control" link scrolls to the #flow anchor.
```

Stop the dev server when verified.

- [ ] **Step 6: Commit**

```bash
git add pages/patterns/index.tsx
git commit -m "feat(patterns): mount Featured component on /patterns/ index

Promotes flash-sales-and-bursty-workflows. Gracefully renders nothing
if the configured slug doesn't match an existing pattern.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 4: Humans/Agents Toggle + /md Routes

### Task 15: Build markdown generators

Pure functions that build LLM-friendly markdown for the index page and individual pattern pages.

**Files:**
- Create: `shared/Patterns/markdown.ts`

- [ ] **Step 1: Write the generators**

Write `shared/Patterns/markdown.ts`:

```ts
import type { FeaturedPattern } from "./featured";
import type { PatternSection } from "./patternsData";

/**
 * Build the markdown view of /patterns/ index.
 * Includes the featured pattern at the top so agents pulling fresh
 * context see the newest material first.
 */
export function indexMarkdown(
  sections: PatternSection[],
  featured?: FeaturedPattern
): string {
  const lines: string[] = [];
  lines.push("# Inngest Patterns", "");
  lines.push(
    "> Production-tested patterns for AI agents, durable workflows, and the event-driven systems they live in. Each pattern is built on Inngest primitives — steps, events, throttling, schedules, channels — and the guarantees they provide.",
    ""
  );
  lines.push("URL: https://www.inngest.com/patterns");
  lines.push(`Sections: ${sections.length}`);
  const total = sections.reduce((acc, s) => acc + s.patterns.length, 0);
  lines.push(`Total patterns: ${total}`, "");

  if (featured) {
    const section = sections.find((s) => s.id === featured.sectionId);
    const pattern = section?.patterns.find((p) => p.slug === featured.slug);
    if (section && pattern) {
      lines.push("---", "");
      lines.push(`## ⭐ ${featured.label}: ${pattern.title}`, "");
      lines.push(
        `*${section.number} · ${section.name} — published ${featured.publishedAt} · ${featured.readTime}*`,
        ""
      );
      lines.push(featured.excerpt, "");
      if (featured.highlights.length > 0) {
        featured.highlights.forEach((h) => lines.push(`- ${h}`));
        lines.push("");
      }
      lines.push(`Read: \`/patterns/${pattern.slug}\``, "");
    }
  }

  lines.push("---", "", "## Table of contents", "");
  sections.forEach((s) => {
    lines.push(
      `- **${s.number} · ${s.name}** — ${s.kicker} (${s.patterns.length} patterns)`
    );
  });
  lines.push("", "---", "");

  sections.forEach((s) => {
    lines.push(`## ${s.number} · ${s.name}`, "", `*${s.kicker}*`, "");
    lines.push(s.description, "");
    lines.push("### Patterns", "");
    s.patterns.forEach((p) => {
      lines.push(`- **[${p.title}](/patterns/${p.slug})** — ${p.subtitle}`);
    });
    lines.push("");
  });

  return lines.join("\n");
}

/**
 * Build the markdown view of a single pattern page.
 * Composes the frontmatter into a header and appends the raw MDX body.
 */
export function patternMarkdown(
  title: string,
  subtitle: string,
  slug: string,
  tags: string[],
  body: string
): string {
  const lines: string[] = [];
  lines.push(`# ${title}`, "");
  if (subtitle) lines.push(`> ${subtitle}`, "");
  lines.push(`URL: https://www.inngest.com/patterns/${slug}`);
  if (tags.length > 0) lines.push(`Tags: ${tags.join(", ")}`);
  lines.push("", "---", "");
  lines.push(body.trim());
  return lines.join("\n") + "\n";
}
```

- [ ] **Step 2: Verify typecheck**

```bash
pnpm tsc --noEmit -p tsconfig.json
```

Expected: clean.

- [ ] **Step 3: Manually exercise the generators**

Since there's no test runner in this repo, run a one-off Node check via `tsx` (already in devDependencies if not, ad-hoc — fall back to `node --experimental-strip-types` for TS):

```bash
pnpm exec tsx -e "
import PATTERN_SECTIONS from './shared/Patterns/patternsData';
import { FEATURED_PATTERN } from './shared/Patterns/featured';
import { indexMarkdown, patternMarkdown } from './shared/Patterns/markdown';

// indexMarkdown — sections without patterns attached should produce empty section blocks.
// Test with a hand-built minimal section list:
const minimal = [{ ...PATTERN_SECTIONS[0], patterns: [{ slug: 'x', title: 'X', subtitle: 'About X.' }] }];
console.log(indexMarkdown(minimal, FEATURED_PATTERN).slice(0, 400));
console.log('---');
console.log(patternMarkdown('Test', 'About test.', 'test', ['A', 'B'], 'Body content here.'));
"
```

Expected output:
- First chunk starts with `# Inngest Patterns`, includes the featured block conditional only if the featured slug matches a pattern in the passed sections (in this minimal case it won't, so no featured block — that's correct).
- Second chunk starts with `# Test` and ends with `Body content here.`.

If output looks malformed, re-read the generators and fix.

- [ ] **Step 4: Commit**

```bash
git add shared/Patterns/markdown.ts
git commit -m "feat(patterns): add markdown generators for LLM-friendly views

Produces clean markdown for /patterns/md (index) and per-pattern markdown
(used by Humans/Agents view toggle).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 16: Add `/md` routes via API routes + rewrites

In Pages Router, the cleanest way to serve `Content-Type: text/markdown` from `/patterns/md` and `/patterns/{slug}/md` is API routes under `/api/patterns/...` with URL rewrites mapping the public URLs to them.

**Files:**
- Create: `pages/api/patterns/md.ts`
- Create: `pages/api/patterns/[pattern]/md.ts`
- Modify: `next.config.mjs:435` (append to the `rewrites()` return array)

- [ ] **Step 1: Create the index API route**

Write `pages/api/patterns/md.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import { loadMarkdownFilesMetadata } from "../../../utils/markdown";
import PATTERN_SECTIONS, {
  type PatternItem,
  type PatternSection,
} from "../../../shared/Patterns/patternsData";
import { FEATURED_PATTERN } from "../../../shared/Patterns/featured";
import { indexMarkdown } from "../../../shared/Patterns/markdown";

type PatternFrontmatter = {
  title?: string;
  subtitle?: string;
  pattern?: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const entries = await loadMarkdownFilesMetadata<PatternFrontmatter>(
    "pages/patterns/_patterns"
  );

  const bySection = new Map<string, PatternItem[]>();
  for (const entry of entries) {
    if (!entry.pattern || !entry.title || !entry.subtitle) continue;
    const list = bySection.get(entry.pattern) ?? [];
    list.push({
      slug: entry.slug,
      title: entry.title,
      subtitle: entry.subtitle,
    });
    bySection.set(entry.pattern, list);
  }
  bySection.forEach((list) =>
    list.sort((a, b) => a.title.localeCompare(b.title))
  );

  const sections: PatternSection[] = PATTERN_SECTIONS.flatMap((meta) => {
    const patterns = bySection.get(meta.id);
    if (!patterns || patterns.length === 0) return [];
    return [{ ...meta, patterns }];
  });

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
  res.status(200).send(indexMarkdown(sections, FEATURED_PATTERN));
}
```

- [ ] **Step 2: Create the per-pattern API route**

Write `pages/api/patterns/[pattern]/md.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import { loadMarkdownFile } from "../../../../utils/markdown";
import { patternMarkdown } from "../../../../shared/Patterns/markdown";

type PatternFrontmatter = {
  title?: string;
  subtitle?: string;
  tags?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = Array.isArray(req.query.pattern)
    ? req.query.pattern[0]
    : req.query.pattern;
  if (!slug) {
    res.status(404).send("Not found");
    return;
  }

  try {
    const data = await loadMarkdownFile("pages/patterns/_patterns", slug);
    const metadata = (data.metadata ?? {}) as PatternFrontmatter;
    const body = (data as { content: string }).content;
    const markdown = patternMarkdown(
      metadata.title ?? slug,
      metadata.subtitle ?? "",
      slug,
      metadata.tags ?? [],
      body
    );
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
    res.status(200).send(markdown);
  } catch {
    res.status(404).send("Pattern not found");
  }
}
```

- [ ] **Step 3: Add URL rewrites**

In `next.config.mjs`, find the `rewrites()` function (around line 434):

```js
async function rewrites() {
  return [
    // Versionless subpaths (excludes /v3/ and /v4/ prefixed paths)
    {
      source: "/docs/reference/typescript/:path((?!v3|v4).+)",
      destination: `/docs/reference/typescript/${TS_STABLE_VERSION}/:path`,
    },
    {
      source: "/docs-markdown/reference/typescript/:path((?!v3|v4).+)",
      destination: `/docs-markdown/reference/typescript/${TS_STABLE_VERSION}/:path`,
    },
  ];
}
```

Add two entries inside the returned array (after the existing two):

```js
    {
      source: "/patterns/md",
      destination: "/api/patterns/md",
    },
    {
      source: "/patterns/:pattern/md",
      destination: "/api/patterns/:pattern/md",
    },
```

- [ ] **Step 4: Verify typecheck**

```bash
pnpm tsc --noEmit -p tsconfig.json
```

Expected: clean.

- [ ] **Step 5: Manually verify both routes**

```bash
pnpm dev
# In another terminal:
curl -s -H "Accept: text/markdown" http://localhost:3000/patterns/md | head -40
curl -s http://localhost:3000/patterns/flash-sales-and-bursty-workflows/md | head -30
```

Expected:
- First curl: clean markdown starting with `# Inngest Patterns`, includes the `⭐ Featured pattern` block.
- Second curl: starts with `# Flash sales and bursty workflows`, includes the body of the MDX file.
- Both responses have `Content-Type: text/markdown; charset=utf-8` (check with `curl -I`).

Stop the dev server when verified.

- [ ] **Step 6: Commit**

```bash
git add pages/api/patterns/ next.config.mjs
git commit -m "feat(patterns): add /md routes for raw markdown views

/patterns/md and /patterns/{slug}/md serve LLM-friendly markdown.
Pages-Router URLs rewritten to /api/patterns/... handlers so the
public URL contract matches what agents expect.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 17: Build the presentational ViewToggle component

A floating pill at bottom-right with two states. Adapted directly from the handoff — no Pages-Router-specific concerns yet (just the visual + accessibility shell).

**Files:**
- Create: `shared/Patterns/ViewToggle.tsx`
- Create: `shared/Patterns/viewToggle.css`

- [ ] **Step 1: Write the component**

Write `shared/Patterns/ViewToggle.tsx`:

```tsx
import "./viewToggle.css";

type Props = {
  agent: boolean;
  onChange: (view: "human" | "agent") => void;
};

export default function ViewToggle({ agent, onChange }: Props) {
  return (
    <div className="view-toggle" role="radiogroup" aria-label="View mode">
      <span
        className="view-toggle-rail"
        aria-hidden
        data-pos={agent ? "r" : "l"}
      />
      <button
        type="button"
        className={`view-toggle-btn ${!agent ? "is-active" : ""}`}
        onClick={() => onChange("human")}
        role="radio"
        aria-checked={!agent}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <circle cx="6" cy="4" r="2.2" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M2 11 C2 8.5, 4 7.5, 6 7.5 C8 7.5, 10 8.5, 10 11"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <span>Humans</span>
      </button>
      <button
        type="button"
        className={`view-toggle-btn ${agent ? "is-active" : ""}`}
        onClick={() => onChange("agent")}
        role="radio"
        aria-checked={agent}
        title="View raw markdown — for LLMs and agents"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <rect
            x="1.5"
            y="2.5"
            width="9"
            height="7"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="4.5" cy="6" r="0.7" fill="currentColor" />
          <circle cx="7.5" cy="6" r="0.7" fill="currentColor" />
          <line
            x1="6"
            y1="1"
            x2="6"
            y2="2.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
        <span>Agents</span>
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Write the CSS**

Write `shared/Patterns/viewToggle.css`:

```css
.view-toggle {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  padding: 4px;
  background: rgba(15, 15, 15, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  gap: 2px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 10px 30px -10px rgba(0, 0, 0, 0.6),
    0 2px 8px -2px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.view-toggle:hover {
  transform: translateY(-1px);
  border-color: var(--color-cta, #cbb26a);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 14px 40px -10px rgba(0, 0, 0, 0.7),
    0 0 0 4px rgba(203, 178, 106, 0.06);
}

.view-toggle-rail {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: calc(50% - 4px);
  background: #050505;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.view-toggle-rail[data-pos="l"] { transform: translateX(0); }
.view-toggle-rail[data-pos="r"] { transform: translateX(100%); }

.view-toggle-btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 0;
  padding: 7px 14px;
  font-family: inherit;
  font-size: 12.5px;
  color: rgb(140, 140, 140);
  border-radius: 999px;
  cursor: pointer;
  letter-spacing: -0.005em;
  transition: color 0.15s ease;
  white-space: nowrap;
}
.view-toggle-btn:hover { color: rgb(220, 220, 220); }
.view-toggle-btn.is-active { color: var(--color-cta, #cbb26a); }

@media (max-width: 600px) {
  .view-toggle { right: 12px; bottom: 12px; }
  .view-toggle-btn { padding: 6px 10px; font-size: 12px; }
}
```

- [ ] **Step 3: Verify typecheck and commit**

```bash
pnpm tsc --noEmit -p tsconfig.json
git add shared/Patterns/ViewToggle.tsx shared/Patterns/viewToggle.css
git commit -m "feat(patterns): add ViewToggle presentational component

Floating pill toggle at bottom-right with Humans/Agents states.
Behavior wiring (router push to /md) lives in a separate wrapper.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 18: Build `PatternsViewToggle` wrapper

Wraps the presentational ViewToggle with Pages-Router `useRouter` to flip between `/patterns(/[slug])` and `/patterns(/[slug])/md`. Includes the H/M keyboard shortcuts from the handoff.

**Files:**
- Create: `shared/Patterns/PatternsViewToggle.tsx`

- [ ] **Step 1: Write the wrapper**

Write `shared/Patterns/PatternsViewToggle.tsx`:

```tsx
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import ViewToggle from "./ViewToggle";

export default function PatternsViewToggle() {
  const router = useRouter();
  const path = router.asPath.split("?")[0].split("#")[0];
  const agent = path.endsWith("/md");

  const setView = useCallback(
    (view: "human" | "agent") => {
      if (view === "agent" && !agent) {
        const next = (path.replace(/\/$/, "") || "/patterns") + "/md";
        router.push(next);
      } else if (view === "human" && agent) {
        const next = path.replace(/\/md$/, "") || "/patterns";
        router.push(next);
      }
    },
    [agent, path, router]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      if ((e.key === "h" || e.key === "H") && agent) setView("human");
      else if ((e.key === "m" || e.key === "M") && !agent) setView("agent");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [agent, setView]);

  return <ViewToggle agent={agent} onChange={setView} />;
}
```

- [ ] **Step 2: Verify typecheck and commit**

```bash
pnpm tsc --noEmit -p tsconfig.json
git add shared/Patterns/PatternsViewToggle.tsx
git commit -m "feat(patterns): add PatternsViewToggle router-aware wrapper

Pushes to /md or back via Next.js Pages-Router useRouter.
H/M keyboard shortcuts flip the view (handoff feature).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 19: Mount the toggle conditionally in `_app.tsx`

Render the toggle only on `/patterns` and `/patterns/*` routes (rendered HTML view — when the URL ends with `/md`, the markdown API route returns plain text and `_app.tsx` doesn't run at all, so the toggle is intentionally absent on the raw-markdown view).

**Files:**
- Modify: `pages/_app.tsx`

- [ ] **Step 1: Add the import**

Near the top of `pages/_app.tsx`, after the existing layout imports (around line 25), add:

```tsx
import PatternsViewToggle from "../shared/Patterns/PatternsViewToggle";
```

- [ ] **Step 2: Add a derived flag inside `MyApp`**

Just after the existing `const isDocs = ...` and `const isCaseStudy = ...` lines (around lines 46–47), add:

```tsx
  const isPatterns = !is404 && router.asPath.startsWith("/patterns");
```

- [ ] **Step 3: Render the toggle inside the returned tree**

Find the existing `</Layout>` (closing the layout component, around line 162):

```tsx
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
```

Replace with:

```tsx
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>

      {isPatterns && <PatternsViewToggle />}
```

- [ ] **Step 4: Verify typecheck**

```bash
pnpm tsc --noEmit -p tsconfig.json
```

Expected: clean.

- [ ] **Step 5: Verify end-to-end in browser**

```bash
pnpm dev
# Visit http://localhost:3000/patterns
# - Confirm: toggle appears bottom-right
# - Click Agents → URL becomes /patterns/md, raw markdown shown (toggle disappears because the /md response is plain text)
# - Hit back, confirm you return to /patterns and the toggle reappears
# - Visit /patterns/flash-sales-and-bursty-workflows, confirm toggle appears
# - Click Agents on that page → URL becomes /patterns/flash-sales-and-bursty-workflows/md
# - Press 'H' on a /md page → confirm it switches back (only fires on /md by design)
# - Visit /docs/getting-started, confirm toggle does NOT appear (route-scoped)
```

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add pages/_app.tsx
git commit -m "feat(patterns): mount Humans/Agents toggle on /patterns/* routes

Scoped to /patterns routes by asPath check. The /md raw-markdown views
intentionally don't render the toggle since they're plain-text API
responses, not React pages.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Out of scope (flagged for follow-up)

These came up in conversation but are not part of this plan:

- **`/docs/guides/mergent-migration` deprecation** (Dan: "doesn't matter anymore, duplicate, not even a pattern")
- **`/docs/guides/user-defined-workflows` decision** (Workflow-Kit-focused; "not necessarily supporting")
- **New pattern: "Taking HTTP off the hot path with realtime"** (Linell's candidate)
- **Repo-wide SDK syntax modernization.** The `/docs/guides/` files still use the legacy 3-arg `createFunction` form. Worth a separate pass.
- **`<link rel="alternate" type="text/markdown" href="/patterns/md" />`** in the page `<head>` for crawler discoverability. Tiny addition; defer until the markdown views are in production.
- **`/patterns/llms.txt` index.** Mentioned in the handoff as an optional nice-to-have.

---

## Self-Review

**Spec coverage:**
- 10 pattern modernizations → tasks 2–9 + 2 redirects in task 1 ✓
- Nav rename "AI Patterns" → "Agents" → task 10 ✓
- Nav rename guides "Patterns" → "Events and Triggers" → task 11 ✓
- Featured pattern component → tasks 12–14 ✓
- Featured = flash-sales-and-bursty-workflows → task 12 ✓
- Humans/Agents toggle → tasks 17–19 ✓
- /md routes → task 16 ✓
- Flat URLs preserved → tasks 13, 16 reference `/patterns/{slug}` not `/patterns/{section}/{slug}` ✓
- Adapt for Pages Router → task 16 uses API routes + rewrites instead of App Router route handlers; task 18 uses `next/router` not `next/navigation` ✓
- Permanent redirects in next.config.mjs → task 1 ✓

**Placeholder scan:** No "TBD," "implement later," "appropriate error handling" — every step has the actual code or command.

**Type consistency:**
- `FeaturedPattern` type defined in task 12, imported in tasks 13, 15, 16 ✓
- `PatternSection` / `PatternItem` types defined earlier in patternsData.ts, imported consistently across tasks 13, 14, 16 ✓
- `PatternsViewToggle` default-exported in task 18, imported in task 19 ✓
- `ViewToggle` default-exported in task 17, imported in task 18 ✓

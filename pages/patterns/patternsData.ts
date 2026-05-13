// Pattern data for the Inngest patterns hub.
// Each section maps to an Inngest primitive with its brand accent color.
// Tailwind color classes reference tokens defined in tailwind.config.js.

export interface PatternItem {
  slug: string;
  title: string;
  subtitle: string;
}

export interface PatternSection {
  id: string;
  number: string;
  name: string;
  kicker: string;
  description: string;
  accent: {
    text: string;      // Tailwind text color class
    border: string;    // Tailwind border color class
    bg: string;        // Tailwind bg tint class
    gradient: string;  // CSS gradient for rule line
  };
  patterns: PatternItem[];
}

export const PATTERNS_DATA: PatternSection[] = [
  {
    id: "ai",
    number: "00",
    name: "AI",
    kicker: "Agentic systems",
    description:
      "Build agentic systems that don't fall over in production. Orchestrate tool loops, multi-agent delegation, and human approvals — with retries, observability, and rapid iteration baked in.",
    accent: {
      text: "text-cta",
      border: "border-cta",
      bg: "bg-cta/[0.08]",
      gradient: "from-cta to-transparent",
    },
    patterns: [
      {
        slug: "agent-tool-loops",
        title: "Agent tool loops",
        subtitle: "Iterate over tool calls with automatic retries and full execution traces.",
      },
      {
        slug: "sub-agent-delegation",
        title: "Sub-agent delegation",
        subtitle: "Compose workflows by invoking child agents — blocking, fire-and-forget, or scheduled.",
      },
      {
        slug: "human-in-the-loop",
        title: "Human in the loop",
        subtitle: "Pause execution for an approval; resume the instant a person responds.",
      },
      {
        slug: "wrap-any-ai-sdk",
        title: "Wrap any AI SDK",
        subtitle: "step.ai.wrap turns any provider call into a durable, observable step.",
      },
      {
        slug: "streaming-responses",
        title: "Stream tokens to the UI",
        subtitle: "Push LLM output to the browser through realtime channels as it arrives.",
      },
      {
        slug: "evals-and-scoring",
        title: "Evals & scoring pipelines",
        subtitle: "Run evaluations as parallel steps; gate releases on score thresholds.",
      },
    ],
  },
  {
    id: "durable",
    number: "01",
    name: "Durable Workflows",
    kicker: "Steps that don't lose state",
    description:
      "Multi-step business logic that survives crashes, deploys, and minute-long LLM calls. Each step is independently retried and persisted — no glue code, no external queues to babysit.",
    accent: {
      text: "text-matcha-500",
      border: "border-matcha-500",
      bg: "bg-matcha-500/[0.08]",
      gradient: "from-matcha-500 to-transparent",
    },
    patterns: [
      {
        slug: "steps-as-save-points",
        title: "Steps as save points",
        subtitle: "Break long workflows into idempotent steps; each one is a checkpoint.",
      },
      {
        slug: "long-running-jobs",
        title: "Long-running jobs",
        subtitle: "Workflows that span hours, days, or weeks without holding compute.",
      },
      {
        slug: "sagas-and-compensation",
        title: "Sagas & compensation",
        subtitle: "Roll back side effects gracefully when a downstream step fails.",
      },
      {
        slug: "replay-and-inspect",
        title: "Replay & inspect runs",
        subtitle: "Re-run any historical execution against new code for fearless debugging.",
      },
      {
        slug: "versioned-workflows",
        title: "Versioned workflows",
        subtitle: "Ship breaking changes without breaking in-flight runs already in progress.",
      },
    ],
  },
  {
    id: "flow",
    number: "02",
    name: "Flow Control",
    kicker: "Spike-proof the boring stuff",
    description:
      "Throttle, debounce, rate-limit, and cap concurrency — declaratively, per-tenant or globally. Survive flash sales, runaway LLM bills, and noisy webhook providers.",
    accent: {
      text: "text-honey-500",
      border: "border-honey-500",
      bg: "bg-honey-500/[0.07]",
      gradient: "from-honey-500 to-transparent",
    },
    patterns: [
      {
        slug: "throttle-external-apis",
        title: "Throttle external APIs",
        subtitle: "Cap requests per second to providers like OpenAI, Stripe, or Twilio.",
      },
      {
        slug: "per-user-concurrency",
        title: "Per-user concurrency",
        subtitle: "One run per customer at a time — no more, no fewer. No global locks.",
      },
      {
        slug: "debounce-noisy-events",
        title: "Debounce noisy events",
        subtitle: "Collapse bursts of input into one execution after a settling period.",
      },
      {
        slug: "singleton-functions",
        title: "Singleton functions",
        subtitle: "Guarantee only one instance of a workflow runs at any given time.",
      },
      {
        slug: "priority-lanes",
        title: "Priority lanes",
        subtitle: "Move paying customers ahead of free-tier work — no separate queues required.",
      },
      {
        slug: "idempotency-keys",
        title: "Idempotency keys",
        subtitle: "Dedupe duplicate triggers from retried webhooks and at-least-once delivery.",
      },
    ],
  },
  {
    id: "events",
    number: "03",
    name: "Event Coordination",
    kicker: "Choreograph the chaos",
    description:
      "Wait for events, correlate signals across time, and cancel in-flight work based on what users do. The substrate underneath approvals, sagas, and abandonment flows.",
    accent: {
      text: "text-breeze-500",
      border: "border-breeze-500",
      bg: "bg-breeze-500/[0.08]",
      gradient: "from-breeze-500 to-transparent",
    },
    patterns: [
      {
        slug: "wait-for-event",
        title: "waitForEvent",
        subtitle: "Pause a run until a matching event arrives — or a timeout elapses.",
      },
      {
        slug: "fan-out",
        title: "Fan-out from one event",
        subtitle: "One trigger lights up many functions in parallel, each with its own retry.",
      },
      {
        slug: "invoke-workflow",
        title: "Invoke another workflow",
        subtitle: "Call a function inline and get its result back — typed, durable, traced.",
      },
      {
        slug: "event-correlation",
        title: "Event correlation",
        subtitle: "Match arriving events to the run that's been waiting on them by key.",
      },
      {
        slug: "cancel-on-event",
        title: "Cancel on event",
        subtitle: "Kill an in-flight run the instant the user changes their mind.",
      },
    ],
  },
  {
    id: "schedule",
    number: "04",
    name: "Scheduling",
    kicker: "Time as a first-class input",
    description:
      "Cron, sleep, and sleepUntil — durable across deploys and process restarts. Schedule work for tomorrow, next quarter, or whenever a user picks a date.",
    accent: {
      text: "text-purplehaze-500",
      border: "border-purplehaze-500",
      bg: "bg-purplehaze-500/[0.08]",
      gradient: "from-purplehaze-500 to-transparent",
    },
    patterns: [
      {
        slug: "crons-that-survive-deploys",
        title: "Crons that survive deploys",
        subtitle: "Schedule recurring functions with the durability of regular runs.",
      },
      {
        slug: "sleep-until",
        title: "sleep & sleepUntil",
        subtitle: "Wait days inside a workflow without holding compute or memory.",
      },
      {
        slug: "delayed-reminders",
        title: "Delayed reminders",
        subtitle: "Send a follow-up 24 hours after signup — durably, no scheduler infra.",
      },
      {
        slug: "maintenance-windows",
        title: "Maintenance windows",
        subtitle: "Coordinate periodic cleanup, exports, or migrations across services.",
      },
      {
        slug: "exponential-backoff",
        title: "Exponential backoff",
        subtitle: "Retry flaky external services with custom waits between attempts.",
      },
    ],
  },
  {
    id: "realtime",
    number: "05",
    name: "Realtime",
    kicker: "Push state to the browser",
    description:
      "Channels and subscriptions for streaming run status, LLM tokens, and per-user updates directly to the UI — without polling, websocket boilerplate, or a separate pubsub.",
    accent: {
      text: "text-ruby-500",
      border: "border-ruby-500",
      bg: "bg-ruby-500/[0.08]",
      gradient: "from-ruby-500 to-transparent",
    },
    patterns: [
      {
        slug: "stream-llm-tokens",
        title: "Stream LLM tokens",
        subtitle: "Push tokens to the browser the instant they arrive from the model.",
      },
      {
        slug: "live-run-status",
        title: "Live run status",
        subtitle: "Subscribe to a function's execution and render its state in real time.",
      },
      {
        slug: "per-user-channels",
        title: "Per-user channels",
        subtitle: "Scope updates to a single tenant or session, with no broadcast leakage.",
      },
      {
        slug: "reactive-dashboards",
        title: "Reactive dashboards",
        subtitle: "Update metrics and counts as new events stream through the system.",
      },
    ],
  },
  {
    id: "jobs",
    number: "06",
    name: "Background Jobs",
    kicker: "Off the request path",
    description:
      "Heavy work — image processing, email, exports, webhook ingestion — belongs in the background where retries and concurrency control live. Get it out of your API responses.",
    accent: {
      text: "text-blush-500",
      border: "border-blush-500",
      bg: "bg-blush-500/[0.08]",
      gradient: "from-blush-500 to-transparent",
    },
    patterns: [
      {
        slug: "offload-heavy-work",
        title: "Offload heavy work",
        subtitle: "Move LLM calls, transcoding, and data processing off the request path.",
      },
      {
        slug: "reliable-webhooks",
        title: "Reliable webhooks",
        subtitle: "Ingest provider callbacks at scale with retries, dedupe, and replay.",
      },
      {
        slug: "email-pipelines",
        title: "Email & notification pipelines",
        subtitle: "Send transactional mail with retries and per-provider rate limits built in.",
      },
      {
        slug: "file-and-media-processing",
        title: "File & media processing",
        subtitle: "Transcode, resize, and analyze user uploads asynchronously.",
      },
      {
        slug: "periodic-exports",
        title: "Periodic exports",
        subtitle: "Generate reports and CSVs on a schedule without blocking users.",
      },
    ],
  },
];

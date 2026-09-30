import type React from "react";
import { RiBox3Line } from "@remixicon/react";
import IconWave from "../Icons/Wave";

export type DocsRefreshPage = {
  title: string;
  href?: string;
  monospace?: boolean;
  /**
   * Render as an always-open sidebar section with an icon header, instead of
   * a collapsible group.
   */
  section?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  /**
   * Open this group by default when the current page isn't inside any other
   * collapsible group (for example, on the docs home).
   */
  openWhenIdle?: boolean;
  children?: DocsRefreshPage[];
};

export const docsRefreshOutline: DocsRefreshPage[] = [
  {
    title: "Introduction",
    href: "/docs",
    section: true,
    icon: IconWave,
    children: [
      {
        title: "What is Inngest?",
        href: "/docs/platform-overview",
      },
      {
        title: "Local development",
        href: "/docs/local-development",
        children: [
          {
            title: "Using Docker",
            href: "/docs/local-development/docker",
          },
          {
            title: "AI and MCP",
            href: "/docs/ai-dev-tools",
            children: [
              {
                title: "Inngest MCP",
                href: "/docs/ai-dev-tools/mcp",
              },
              {
                title: "Agent plugins and skills",
                href: "/docs/ai-dev-tools/agent-skills",
              },
              {
                title: "CLI for coding agents",
                href: "/docs/ai-patterns/cli-for-coding-agents",
              },
            ],
          },
        ],
      },
      {
        title: "Get started",
        href: "/docs/getting-started",
        children: [
          {
            title: "Next.js",
            href: "/docs/getting-started/nextjs-quick-start",
          },
          {
            title: "Express",
            href: "/docs/getting-started/express-quick-start",
          },
          {
            title: "Astro",
            href: "/docs/getting-started/astro-quick-start",
          },
          {
            title: "NestJS",
            href: "/docs/getting-started/nestjs-quick-start",
          },
          {
            title: "H3",
            href: "/docs/getting-started/h3-quick-start",
          },
          {
            title: "TanStack Start",
            href: "/docs/getting-started/tanstack-start-quick-start",
          },
        ],
      },
    ],
  },
  {
    title: "Platform",
    section: true,
    icon: RiBox3Line,
    children: [
      {
        title: "Durable Execution",
        href: "/docs/durable-execution",
        openWhenIdle: true,
        children: [
          {
            title: "Durable workflows",
            href: "/docs/durable-execution/durable-workflows",
          },
          {
            title: "Durable endpoints",
            href: "/docs/durable-execution/durable-endpoints",
            children: [
              {
                title: "Streaming",
                href: "/docs/durable-execution/durable-endpoints/streaming",
              },
            ],
          },
          {
            title: "Concepts",
            href: "/docs/durable-execution/concepts",
          },
          {
            title: "Quick start",
            href: "/docs/durable-execution/quick-start",
            children: [
              {
                title: "TypeScript quick start",
                href: "/docs/durable-execution/quick-start/typescript-quick-start",
              },
              {
                title: "Go quick start",
                href: "/docs/durable-execution/quick-start/go-quick-start",
              },
              {
                title: "Python quick start",
                href: "/docs/durable-execution/quick-start/python-quick-start",
              },
            ],
          },
          {
            title: "Primitives and steps",
            href: "/docs/durable-execution/primitives",
            children: [
              {
                title: "step.run",
                href: "/docs/durable-execution/primitives/step-run",
                monospace: true,
              },
              {
                title: "step.sleep",
                href: "/docs/durable-execution/primitives/step-sleep",
                monospace: true,
              },
              {
                title: "step.sleepUntil",
                href: "/docs/durable-execution/primitives/step-sleepuntil",
                monospace: true,
              },
              {
                title: "step.waitForEvent",
                href: "/docs/durable-execution/primitives/step-waitforevent",
                monospace: true,
              },
              {
                title: "step.waitForSignal",
                href: "/docs/durable-execution/primitives/step-waitforsignal",
                monospace: true,
              },
              {
                title: "step.invoke",
                href: "/docs/durable-execution/primitives/step-invoke",
                monospace: true,
              },
              {
                title: "step.sendEvent",
                href: "/docs/durable-execution/primitives/step-sendevent",
                monospace: true,
              },
              {
                title: "defer",
                href: "/docs/durable-execution/primitives/defer",
                monospace: true,
              },
              {
                title: "group.parallel",
                href: "/docs/durable-execution/primitives/group-parallel",
                monospace: true,
              },
              {
                title: "group.experiment",
                href: "/docs/durable-execution/primitives/group-experiment",
                monospace: true,
              },
              {
                title: "Metadata",
                href: "/docs/durable-execution/primitives/metadata",
              },
            ],
          },
          {
            title: "Flow control",
            href: "/docs/durable-execution/flow-control",
            children: [
              {
                title: "Step concurrency",
                href: "/docs/durable-execution/flow-control/concurrency",
              },
              {
                title: "Throttling",
                href: "/docs/durable-execution/flow-control/throttling",
              },
              {
                title: "Rate limiting",
                href: "/docs/durable-execution/flow-control/rate-limiting",
              },
              {
                title: "Batching",
                href: "/docs/durable-execution/flow-control/batching",
              },
              {
                title: "Singleton",
                href: "/docs/durable-execution/flow-control/singleton",
              },
              {
                title: "Debounce",
                href: "/docs/durable-execution/flow-control/debounce",
              },
              {
                title: "Priority",
                href: "/docs/durable-execution/flow-control/priority",
              },
              {
                title: "Multi-tenancy",
                href: "/docs/durable-execution/flow-control/multi-tenancy",
              },
              {
                title: "Simulator",
                href: "/docs/durable-execution/flow-control/simulator",
              },
            ],
          },
          {
            title: "Events and triggers",
            href: "/docs/durable-execution/guides-and-advanced/events-and-triggers",
            children: [
              {
                title: "Event and trigger concepts",
                href: "/docs/durable-execution/guides-and-advanced/events-and-triggers/event-and-trigger-concepts",
              },
              {
                title: "Event payloads and schemas",
                href: "/docs/durable-execution/guides-and-advanced/events-and-triggers/event-payloads-and-schemas",
              },
              {
                title: "Send events",
                href: "/docs/durable-execution/guides-and-advanced/events-and-triggers/send-events",
              },
              {
                title: "Receive webhook events",
                href: "/docs/durable-execution/guides-and-advanced/events-and-triggers/receive-webhook-events",
              },
              {
                title: "Schedules and delayed starts",
                href: "/docs/durable-execution/guides-and-advanced/events-and-triggers/schedules-and-delayed-starts",
              },
            ],
          },
          {
            title: "Error handling",
            href: "/docs/durable-execution/guides-and-advanced/error-handling",
            children: [
              {
                title: "Retries",
                href: "/docs/durable-execution/guides-and-advanced/error-handling/retries",
              },
              {
                title: "Non-retriable errors",
                href: "/docs/durable-execution/guides-and-advanced/error-handling/non-retriable-errors",
              },
              {
                title: "Rollbacks",
                href: "/docs/durable-execution/guides-and-advanced/error-handling/rollbacks",
              },
              {
                title: "Failure handlers",
                href: "/docs/durable-execution/guides-and-advanced/error-handling/failure-handlers",
              },
              {
                title: "Inngest errors",
                href: "/docs/durable-execution/guides-and-advanced/error-handling/inngest-errors",
              },
            ],
          },
          {
            title: "Cancellation",
            href: "/docs/durable-execution/guides-and-advanced/cancellation",
            children: [
              {
                title: "Timeouts",
                href: "/docs/durable-execution/guides-and-advanced/cancellation/timeouts",
              },
              {
                title: "Cancelling via events",
                href: "/docs/durable-execution/guides-and-advanced/cancellation/events",
              },
            ],
          },
          {
            title: "Deploying functions",
            href: "/docs/durable-execution/deploying-functions",
            children: [
              {
                title: "Serve",
                href: "/docs/durable-execution/deploying-functions/serve",
              },
              {
                title: "Connect",
                href: "/docs/durable-execution/deploying-functions/connect",
              },
              {
                title: "Platforms",
                href: "/docs/durable-execution/deploying-functions/platforms",
                children: [
                  {
                    title: "Vercel",
                    href: "/docs/durable-execution/deploying-functions/platforms/vercel",
                  },
                  {
                    title: "Netlify",
                    href: "/docs/durable-execution/deploying-functions/platforms/netlify",
                  },
                  {
                    title: "Cloudflare Pages",
                    href: "/docs/durable-execution/deploying-functions/platforms/cloudflare",
                  },
                  {
                    title: "Render",
                    href: "/docs/durable-execution/deploying-functions/platforms/render",
                  },
                  {
                    title: "DigitalOcean",
                    href: "/docs/durable-execution/deploying-functions/platforms/digital-ocean",
                  },
                  {
                    title: "Provider limits",
                    href: "/docs/durable-execution/deploying-functions/platforms/provider-limits",
                  },
                ],
              },
            ],
          },
          {
            title: "Advanced",
            href: "/docs/durable-execution/guides-and-advanced",
            children: [
              {
                title: "Idempotency",
                href: "/docs/durable-execution/guides-and-advanced/idempotency",
              },
              {
                title: "Versioning",
                href: "/docs/durable-execution/guides-and-advanced/versioning",
              },
              {
                title: "Testing",
                href: "/docs/durable-execution/guides-and-advanced/testing",
              },
              {
                title: "Patterns",
                href: "/docs/durable-execution/guides-and-advanced/patterns",
                children: [
                  {
                    title: "Fan-out",
                    href: "/docs/durable-execution/guides-and-advanced/patterns/fan-out",
                  },
                  {
                    title: "Working with loops",
                    href: "/docs/durable-execution/guides-and-advanced/patterns/working-with-loops",
                  },
                  {
                    title: "Agent tool loops",
                    href: "/docs/durable-execution/guides-and-advanced/patterns/agent-tool-loops",
                  },
                  {
                    title: "Human-in-the-loop",
                    href: "/docs/durable-execution/guides-and-advanced/patterns/human-in-the-loop",
                  },
                  {
                    title: "Sub-agent delegation",
                    href: "/docs/durable-execution/guides-and-advanced/patterns/sub-agent-delegation",
                  },
                ],
              },
              {
                title: "Middleware",
                href: "/docs/durable-execution/guides-and-advanced/middleware",
                children: [
                  {
                    title: "Creating middleware",
                    href: "/docs/durable-execution/guides-and-advanced/middleware/creating-middleware",
                  },
                  {
                    title: "Dependency injection",
                    href: "/docs/durable-execution/guides-and-advanced/middleware/dependency-injection",
                  },
                  {
                    title: "Encryption middleware",
                    href: "/docs/durable-execution/guides-and-advanced/middleware/encryption-middleware",
                  },
                  {
                    title: "Sentry middleware",
                    href: "/docs/durable-execution/guides-and-advanced/middleware/sentry-middleware",
                  },
                ],
              },
              {
                title: "Logging",
                href: "/docs/durable-execution/guides-and-advanced/logging",
              },
              {
                title: "Checkpointing",
                href: "/docs/durable-execution/guides-and-advanced/checkpointing",
              },
              {
                title: "Writing expressions",
                href: "/docs/durable-execution/guides-and-advanced/writing-expressions",
              },
            ],
          },
          {
            title: "Limits",
            href: "/docs/durable-execution/limits",
          },
          {
            title: "Best practices",
            href: "/docs/durable-execution/best-practices",
            children: [
              {
                title: "Performance",
                href: "/docs/durable-execution/best-practices/performance",
              },
            ],
          },
        ],
      },
      {
        title: "Sandboxes",
        href: "/docs/sandboxes",
        children: [
          {
            title: "Overview",
            href: "/docs/sandboxes/overview",
          },
          {
            title: "Quick start",
            href: "/docs/sandboxes/quick-start",
          },
          {
            title: "Features",
            href: "/docs/sandboxes/features",
            children: [
              {
                title: "Base images",
                href: "/docs/sandboxes/features/base-images",
              },
              {
                title: "Pause and resume",
                href: "/docs/sandboxes/features/pause-and-resume",
              },
              {
                title: "Snapshots and restore",
                href: "/docs/sandboxes/features/snapshots-and-restore",
              },
              {
                title: "Cloning",
                href: "/docs/sandboxes/features/cloning",
              },
              {
                title: "Durable filesystems",
                href: "/docs/sandboxes/features/durable-filesystems",
              },
              {
                title: "SSH",
                href: "/docs/sandboxes/features/ssh",
              },
              {
                title: "Secrets",
                href: "/docs/sandboxes/features/secrets",
              },
              {
                title: "Managed lifecycle",
                href: "/docs/sandboxes/features/managed-lifecycle",
              },
              {
                title: "Isolation and security",
                href: "/docs/sandboxes/features/isolation-and-security",
              },
              {
                title: "Traces",
                href: "/docs/sandboxes/features/traces",
              },
            ],
          },
          {
            title: "Guides",
            href: "/docs/sandboxes/guides",
          },
          {
            title: "Reference",
            href: "/docs/sandboxes/reference",
          },
          {
            title: "Limits",
            href: "/docs/sandboxes/limits",
          },
          {
            title: "Best practices",
            href: "/docs/sandboxes/best-practices",
          },
        ],
      },
      {
        title: "Agent Evals",
        href: "/docs/agent-evals",
        children: [
          {
            title: "Overview",
            href: "/docs/agent-evals/overview",
          },
          {
            title: "Quick start",
            href: "/docs/agent-evals/quick-start",
          },
          {
            title: "Scores",
            href: "/docs/agent-evals/scores",
          },
          {
            title: "Deferred scoring",
            href: "/docs/agent-evals/deferred-scoring",
          },
          {
            title: "Experiments",
            href: "/docs/agent-evals/experiments",
          },
          {
            title: "Sessions",
            href: "/docs/agent-evals/sessions",
          },
          {
            title: "Guides",
            href: "/docs/agent-evals/guides",
            children: [
              {
                title: "Score with an LLM judge",
                href: "/docs/agent-evals/guides/llm-judge",
              },
              {
                title: "Score user feedback",
                href: "/docs/agent-evals/guides/user-feedback",
              },
              {
                title: "Compare models and prompts",
                href: "/docs/agent-evals/guides/compare-models-and-prompts",
              },
              {
                title: "Roll out a workflow rewrite",
                href: "/docs/agent-evals/guides/workflow-rewrite",
              },
              {
                title: "Read results and roll out",
                href: "/docs/agent-evals/guides/interpreting-results",
              },
              {
                title: "Manage eval costs",
                href: "/docs/agent-evals/guides/cost-management",
              },
            ],
          },
          {
            title: "Reference",
            href: "/docs/agent-evals/reference",
          },
          {
            title: "Limits",
            href: "/docs/agent-evals/limits",
          },
          {
            title: "Best practices",
            href: "/docs/agent-evals/best-practices",
          },
          {
            title: "Troubleshooting",
            href: "/docs/agent-evals/troubleshooting",
          },
        ],
      },
      {
        title: "Realtime",
        href: "/docs/realtime",
        children: [
          {
            title: "Overview",
            href: "/docs/realtime/overview",
          },
          {
            title: "Quick start",
            href: "/docs/realtime/quick-start",
          },
          {
            title: "Channels and topics",
            href: "/docs/realtime/channels-and-topics",
          },
          {
            title: "Guides",
            href: "/docs/realtime/guides",
            children: [
              {
                title: "Subscription tokens",
                href: "/docs/realtime/guides/subscription-tokens",
              },
              {
                title: "React hooks",
                href: "/docs/realtime/guides/react-hooks",
              },
              {
                title: "Stream AI responses",
                href: "/docs/realtime/guides/stream-ai-responses",
              },
              {
                title: "Server-side subscriptions",
                href: "/docs/realtime/guides/server-side-subscriptions",
              },
            ],
          },
          {
            title: "Reference",
            href: "/docs/realtime/reference",
          },
          {
            title: "Limits",
            href: "/docs/realtime/limits",
          },
          {
            title: "Troubleshooting",
            href: "/docs/realtime/troubleshooting",
          },
        ],
      },
      {
        title: "SDKs & APIs",
        href: "/docs/sdks",
      },
      {
        title: "Platform & operations",
        href: "/docs/platform-and-operations",
        children: [
          {
            title: "Observability",
            href: "/docs/platform-and-operations/observability",
            children: [
              {
                title: "Inspect events and runs",
                href: "/docs/platform-and-operations/inspect-events-and-runs",
              },
              {
                title: "Traces",
                href: "/docs/platform-and-operations/traces",
              },
              {
                title: "Metrics",
                href: "/docs/platform-and-operations/metrics",
              },
              {
                title: "Insights",
                href: "/docs/platform-and-operations/insights",
              },
            ],
          },
          {
            title: "Manage and recover",
            href: "/docs/platform-and-operations/manage-and-recover",
            children: [
              {
                title: "Rerun a run",
                href: "/docs/platform-and-operations/rerun-a-run",
              },
              {
                title: "Replay runs in bulk",
                href: "/docs/platform-and-operations/replay-runs-in-bulk",
              },
              {
                title: "Bulk cancellation",
                href: "/docs/durable-execution/guides-and-advanced/cancellation/bulk-cancellation",
              },
              {
                title: "Pause and resume functions",
                href: "/docs/platform-and-operations/pause-and-resume-functions",
              },
              {
                title: "Rotate event and signing keys",
                href: "/docs/platform-and-operations/rotate-event-and-signing-keys",
              },
              {
                title: "Keys and access",
                href: "/docs/platform-and-operations/keys-and-access",
              },
            ],
          },
          {
            title: "Integrations",
            href: "/docs/platform-and-operations/integrations",
            children: [
              {
                title: "Neon",
                href: "/docs/platform-and-operations/integrations/neon",
              },
              {
                title: "Datadog",
                href: "/docs/platform-and-operations/integrations/datadog",
              },
              {
                title: "Prometheus",
                href: "/docs/platform-and-operations/integrations/prometheus",
              },
            ],
          },
          {
            title: "Apps and syncs",
            href: "/docs/platform-and-operations/apps-and-syncs",
          },
          {
            title: "Environments and branch deploys",
            href: "/docs/platform-and-operations/environments-and-branch-deploys",
          },
          {
            title: "Cloud architecture and security",
            href: "/docs/platform-and-operations/cloud-architecture-and-security",
          },
          {
            title: "Self-host Inngest",
            href: "/docs/platform-and-operations/self-host-inngest",
          },
        ],
      },
    ],
  },
];

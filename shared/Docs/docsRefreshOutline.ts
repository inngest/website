export type DocsRefreshPage = {
  title: string;
  href: string;
  monospace?: boolean;
  children?: DocsRefreshPage[];
};

export const docsRefreshOutline: DocsRefreshPage[] = [
  {
    title: "Introduction",
    href: "/docs",
    children: [
      {
        title: "Platform",
        href: "/docs/platform-overview",
      },
      {
        title: "Local Development",
        href: "/docs/local-development",
        children: [
          {
            title: "Using Docker",
            href: "/docs/local-development/docker",
          },
        ],
      },
      {
        title: "Get started",
        href: "/docs/getting-started",
      },
    ],
  },
  {
    title: "Durable Execution",
    href: "/docs/durable-execution",
    children: [
      {
        title: "Durable workflows",
        href: "/docs/durable-execution/durable-workflows",
      },
      {
        title: "Durable endpoints",
        href: "/docs/durable-execution/durable-endpoints",
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
        ],
      },
      {
        title: "Advanced",
        href: "/docs/durable-execution/guides-and-advanced",
        children: [
          {
            title: "Deploying functions",
            href: "/docs/durable-execution/guides-and-advanced/deploying-functions",
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
            ],
          },
          {
            title: "Middleware",
            href: "/docs/durable-execution/guides-and-advanced/middleware",
            children: [
              {
                title: "Overview",
                href: "/docs/durable-execution/guides-and-advanced/middleware/overview",
              },
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
            title: "Error handling",
            href: "/docs/durable-execution/guides-and-advanced/error-handling",
            children: [
              {
                title: "Overview",
                href: "/docs/durable-execution/guides-and-advanced/error-handling/overview",
              },
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
              {
                title: "Bulk cancellation",
                href: "/docs/durable-execution/guides-and-advanced/cancellation/bulk-cancellation",
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
            title: "Idempotency",
            href: "/docs/durable-execution/guides-and-advanced/idempotency",
          },
          {
            title: "Versioning",
            href: "/docs/durable-execution/guides-and-advanced/versioning",
          },
          {
            title: "Logging",
            href: "/docs/durable-execution/guides-and-advanced/logging",
          },
          {
            title: "Testing",
            href: "/docs/durable-execution/guides-and-advanced/testing",
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
      }
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
    title: "Online Evals",
    href: "/docs/online-evals",
    children: [
      {
        title: "Overview",
        href: "/docs/online-evals/overview",
      },
      {
        title: "Quick start",
        href: "/docs/online-evals/quick-start",
      },
      {
        title: "Sessions",
        href: "/docs/online-evals/sessions",
      },
      {
        title: "Outcomes and scoring",
        href: "/docs/online-evals/outcomes-and-scoring",
      },
      {
        title: "A/B testing",
        href: "/docs/online-evals/a-b-testing",
      },
      {
        title: "Interpreting results",
        href: "/docs/online-evals/interpreting-results",
      },
      {
        title: "Cost management",
        href: "/docs/online-evals/cost-management",
      },
      {
        title: "Guides",
        href: "/docs/online-evals/guides",
      },
      {
        title: "Reference",
        href: "/docs/online-evals/reference",
      },
      {
        title: "Limits",
        href: "/docs/online-evals/limits",
      },
      {
        title: "Best practices",
        href: "/docs/online-evals/best-practices",
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
            href: "/docs/features/realtime/subscription-tokens",
          },
          {
            title: "React hooks",
            href: "/docs/features/realtime/react-hooks",
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
    ],
  },
  {
    title: "SDKs & APIs",
    href: "/docs/sdk/overview",
    children: [
      {
        title: "Reference",
        href: "/docs/sdk/overview/reference",
      },
    ],
  },
  {
    title: "Platform & operations",
    href: "/docs/platform-and-operations",
    children: [
      {
        title: "Apps and syncs",
        href: "/docs/platform-and-operations/apps-and-syncs",
      },
      {
        title: "Environments and branch deploys",
        href: "/docs/platform-and-operations/environments-and-branch-deploys",
      },
      {
        title: "Keys and access",
        href: "/docs/platform-and-operations/keys-and-access",
      },
      {
        title: "Rotate event and signing keys",
        href: "/docs/platform-and-operations/rotate-event-and-signing-keys",
      },
      {
        title: "Cloud architecture and security",
        href: "/docs/platform-and-operations/cloud-architecture-and-security",
      },
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
      {
        title: "Rerun a run",
        href: "/docs/platform-and-operations/rerun-a-run",
      },
      {
        title: "Replay runs in bulk",
        href: "/docs/platform-and-operations/replay-runs-in-bulk",
      },
      {
        title: "Pause and resume functions",
        href: "/docs/platform-and-operations/pause-and-resume-functions",
      },
      {
        title: "Self-host Inngest",
        href: "/docs/platform-and-operations/self-host-inngest",
      },
    ],
  },
  {
    title: "Examples",
    href: "/docs/examples",
  },
];

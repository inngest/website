import {
  HomeIcon,
  PlayIcon,
  LightBulbIcon,
  BookOpenIcon,
  CodeBracketIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { parse } from "node:path";
import { TS_STABLE, type TSVersion } from "./LanguageStore";
import PATTERN_SECTIONS, { PATTERNS } from "../Patterns/patternsData";

function tsRef(version: TSVersion, path: string): string {
  return `/docs/reference/typescript/${version}/${path}`;
}

export type NavLink = {
  title: string;
  href: string;
  className?: string;
  tag?: string;
  target?: string;
  unreleased?: string;
};

export type NavLinkGroup = {
  title: string;
  className?: string;
};

export type NavGroup = {
  title: string;
  href?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  links: (NavGroup | NavLink | NavSection | NavLinkGroup)[];
  defaultOpen?: boolean;
  tag?: string;
  target?: string;
  unreleased?: string;
};

export type NavSection = NavLink & {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  matcher?: RegExp | Function;
  tag?: string;
  target?: string;
  unreleased?: string;
  sectionLinks: {
    title: string;
    links: NavLink[];
  }[];
};

const sectionReference: (NavGroup | NavLink)[] = [
  {
    title: "TypeScript SDK v3",
    links: [
      { title: "Introduction", href: tsRef("v3", "intro") },
      { title: "Create the client", href: tsRef("v3", "client/create") },
      { title: "Create a function", href: tsRef("v3", "functions/create") },
      { title: "Send events", href: tsRef("v3", "events/send") },
      {
        title: "Errors",
        href: `/docs/features/inngest-functions/error-retries/inngest-errors`,
      },
      {
        title: "Handling failures",
        href: tsRef("v3", "functions/handling-failures"),
      },
      { title: "Cancel on", href: tsRef("v3", "functions/cancel-on") },
      { title: "Concurrency", href: `/docs/functions/concurrency` },
      { title: "Rate limit", href: tsRef("v3", "functions/rate-limit") },
      { title: "Singleton", href: tsRef("v3", "functions/singleton") },
      { title: "Debounce", href: tsRef("v3", "functions/debounce") },
      {
        title: "Function run priority",
        href: tsRef("v3", "functions/run-priority"),
      },
      { title: "Extended Traces", href: tsRef("v3", "extended-traces") },
      { title: "Referencing functions", href: `/docs/functions/references` },
      { title: "Testing", href: tsRef("v3", "testing") },
      { title: "Durable Endpoints", href: tsRef("v3", "durable-endpoints") },
      {
        title: "Steps",
        links: [
          {
            title: "step.run()",
            href: tsRef("v3", "functions/step-run"),
            className: "font-mono",
          },
          {
            title: "step.sleep()",
            href: tsRef("v3", "functions/step-sleep"),
            className: "font-mono",
          },
          {
            title: "step.sleepUntil()",
            href: tsRef("v3", "functions/step-sleep-until"),
            className: "font-mono",
          },
          {
            title: "step.invoke()",
            href: tsRef("v3", "functions/step-invoke"),
            className: "font-mono",
          },
          {
            title: "step.waitForEvent()",
            href: tsRef("v3", "functions/step-wait-for-event"),
            className: "font-mono",
          },
          {
            title: "step.waitForSignal()",
            href: tsRef("v3", "functions/step-wait-for-signal"),
            className: "font-mono",
          },
          {
            title: "step.sendEvent()",
            href: tsRef("v3", "functions/step-send-event"),
            className: "font-mono",
          },
        ],
      },
      {
        title: "Serve",
        links: [
          {
            title: "Framework handlers",
            href: `/docs/learn/serving-inngest-functions`,
          },
          { title: "Configuration", href: tsRef("v3", "serve") },
          { title: "Streaming", href: `/docs/streaming` },
        ],
      },
      {
        title: "Realtime",
        tag: "deprecated",
        links: [
          { title: "Overview", href: tsRef("v3", "realtime") },
          {
            title: "React hooks / Next.js",
            href: tsRef("v3", "realtime/react-hooks"),
          },
        ],
      },
      {
        title: "Middleware",
        links: [
          { title: "Lifecycle", href: tsRef("v3", "middleware/lifecycle") },
          { title: "Examples", href: tsRef("v3", "middleware/examples") },
          {
            title: "TypeScript",
            href: `/docs/features/middleware/dependency-injection?guide=typescript`,
          },
        ],
      },
      {
        title: "Using the SDK",
        links: [
          {
            title: "Environment variables",
            href: `/docs/sdk/environment-variables`,
          },
          { title: "Using TypeScript", href: `/docs/typescript` },
          { title: "ESLint plugin", href: `/docs/sdk/eslint` },
          {
            title: "Upgrading to v3",
            href: tsRef("v3", "migrations/v2-to-v3"),
          },
        ],
      },
    ],
  },
  {
    title: "TypeScript SDK v4",
    tag: "new",
    links: [
      { title: "Introduction", href: tsRef("v4", "intro") },
      { title: "Create the client", href: tsRef("v4", "client/create") },
      { title: "Create a function", href: tsRef("v4", "functions/create") },
      { title: "Trigger helpers", href: tsRef("v4", "functions/triggers") },
      { title: "Send events", href: tsRef("v4", "events/send") },
      {
        title: "Errors",
        href: `/docs/features/inngest-functions/error-retries/inngest-errors`,
      },
      {
        title: "Handling failures",
        href: tsRef("v4", "functions/handling-failures"),
      },
      { title: "Cancel on", href: tsRef("v4", "functions/cancel-on") },
      { title: "Concurrency", href: tsRef("v4", "functions/concurrency") },
      { title: "Rate limit", href: tsRef("v4", "functions/rate-limit") },
      { title: "Singleton", href: tsRef("v4", "functions/singleton") },
      { title: "Debounce", href: tsRef("v4", "functions/debounce") },
      {
        title: "Function run priority",
        href: tsRef("v4", "functions/run-priority"),
      },
      { title: "Logging", href: tsRef("v4", "logging") },
      { title: "Extended Traces", href: tsRef("v4", "extended-traces") },
      {
        title: "Referencing functions",
        href: tsRef("v4", "functions/references"),
      },
      { title: "Testing", href: tsRef("v4", "testing") },
      { title: "Durable Endpoints", href: tsRef("v4", "durable-endpoints") },
      {
        title: "Deferred Functions",
        href: tsRef("v4", "functions/deferred-functions"),
        tag: "beta",
      },
      { title: "Scoring", href: tsRef("v4", "functions/scoring"), tag: "beta" },
      // Connect is already reference material in everything but name and URL.
      // The nav slot lands here now; the move off /docs/setup/connect is
      // Phase 2a (DEV-473).
      { title: "Connect", href: `/docs/setup/connect`, tag: "beta" },
      // Identical across every SDK and a reference, not a guide. Moving it off
      // /docs/guides/writing-expressions is Phase 2a (DEV-473).
      { title: "Expressions", href: `/docs/guides/writing-expressions` },
      // Sandbox SDK methods are documented in Phase 2b (DEV-481).
      // { title: "Sandboxes", href: tsRef("v4", "sandboxes") },
      {
        title: "Group",
        links: [
          {
            title: "group.experiment()",
            href: tsRef("v4", "functions/group-experiment"),
            className: "font-mono",
            tag: "beta",
          },
        ],
      },
      {
        title: "Steps",
        links: [
          {
            title: "step.run()",
            href: tsRef("v4", "functions/step-run"),
            className: "font-mono",
          },
          {
            title: "step.sleep()",
            href: tsRef("v4", "functions/step-sleep"),
            className: "font-mono",
          },
          {
            title: "step.sleepUntil()",
            href: tsRef("v4", "functions/step-sleep-until"),
            className: "font-mono",
          },
          {
            title: "step.invoke()",
            href: tsRef("v4", "functions/step-invoke"),
            className: "font-mono",
          },
          {
            title: "step.waitForEvent()",
            href: tsRef("v4", "functions/step-wait-for-event"),
            className: "font-mono",
          },
          {
            title: "step.waitForSignal()",
            href: tsRef("v4", "functions/step-wait-for-signal"),
            className: "font-mono",
          },
          {
            title: "step.sendEvent()",
            href: tsRef("v4", "functions/step-send-event"),
            className: "font-mono",
          },
          {
            title: "step.fetch()",
            href: tsRef("v4", "functions/fetch"),
            className: "font-mono",
          },
        ],
      },
      {
        title: "Serve",
        links: [
          {
            // Keeps its URL deliberately — the page carries search equity, so
            // it is relabelled and re-introduced as a reference here while the
            // fresh guide is written separately (DEV-473).
            title: "Serve framework adapters",
            href: `/docs/learn/serving-inngest-functions`,
          },
          { title: "Configuration", href: tsRef("v4", "serve") },
          { title: "Streaming", href: tsRef("v4", "serve/streaming") },
        ],
      },
      {
        title: "Realtime",
        links: [
          { title: "Overview", href: tsRef("v4", "realtime") },
          {
            title: "Channels & topics",
            href: tsRef("v4", "realtime/channels"),
          },
          { title: "Publishing", href: tsRef("v4", "realtime/publishing") },
          {
            title: "useRealtime",
            href: tsRef("v4", "realtime/use-realtime"),
            className: "font-mono",
          },
          { title: "Subscribing", href: tsRef("v4", "realtime/subscribing") },
        ],
      },
      {
        title: "Middleware",
        links: [
          { title: "Lifecycle", href: tsRef("v4", "middleware/lifecycle") },
          { title: "Examples", href: tsRef("v4", "middleware/examples") },
          {
            title: "Custom serialization",
            href: tsRef("v4", "middleware/serialization"),
          },
          { title: "Encryption", href: tsRef("v4", "middleware/encryption") },
          { title: "Sentry", href: tsRef("v4", "middleware/sentry") },
        ],
      },
      {
        title: "Migrations",
        links: [
          { title: "v3 to v4", href: tsRef("v4", "migrations/v3-to-v4") },
        ],
      },
      {
        title: "Using the SDK",
        links: [
          {
            title: "Environment variables",
            href: `/docs/sdk/environment-variables`,
          },
          { title: "Using TypeScript", href: `/docs/typescript` },
          { title: "ESLint plugin", href: `/docs/sdk/eslint` },
        ],
      },
    ],
  },
  {
    title: "Python SDK",
    links: [
      { title: "Introduction", href: `/docs/reference/python` },
      {
        title: "Quick start",
        href: `/docs/getting-started/python-quick-start`,
      },
      {
        title: "Inngest Client",
        href: `/docs/reference/python/client/overview`,
      },
      {
        title: "Create function",
        href: `/docs/reference/python/functions/create`,
      },
      { title: "Send events", href: `/docs/reference/python/client/send` },
      {
        title: "Environment variables",
        href: `/docs/reference/python/overview/env-vars`,
      },
      {
        title: "Production mode",
        href: `/docs/reference/python/overview/prod-mode`,
      },
      {
        title: "Steps",
        links: [
          { title: "invoke", href: `/docs/reference/python/steps/invoke` },
          {
            title: "invoke_by_id",
            href: `/docs/reference/python/steps/invoke_by_id`,
          },
          { title: "parallel", href: `/docs/reference/python/steps/parallel` },
          { title: "run", href: `/docs/reference/python/steps/run` },
          {
            title: "send_event",
            href: `/docs/reference/python/steps/send-event`,
          },
          { title: "sleep", href: `/docs/reference/python/steps/sleep` },
          {
            title: "sleep_until",
            href: `/docs/reference/python/steps/sleep-until`,
          },
          {
            title: "wait_for_event",
            href: `/docs/reference/python/steps/wait-for-event`,
          },
        ],
      },
      {
        title: "Middleware",
        links: [
          {
            title: "Overview",
            href: `/docs/reference/python/middleware/overview`,
          },
          {
            title: "Lifecycle",
            href: `/docs/reference/python/middleware/lifecycle`,
          },
        ],
      },
      {
        title: "Guides",
        links: [
          { title: "Testing", href: `/docs/reference/python/guides/testing` },
          { title: "Modal", href: `/docs/reference/python/guides/modal` },
          { title: "Pydantic", href: `/docs/reference/python/guides/pydantic` },
        ],
      },
      {
        title: "Migrations",
        links: [
          {
            title: "v0.4 to v0.5",
            href: `/docs/reference/python/migrations/v0.4-to-v0.5`,
          },
          {
            title: "v0.3 to v0.4",
            href: `/docs/reference/python/migrations/v0.3-to-v0.4`,
          },
        ],
      },
    ],
  },
  {
    title: "Go SDK",
    links: [
      {
        title: "Reference",
        href: "https://pkg.go.dev/github.com/inngest/inngestgo",
      },
      {
        title: "Migrations",
        links: [
          {
            title: "v0.15 to v0.16",
            href: `/docs/reference/go/migrations/v0.16`,
          },
          {
            title: "v0.8 to v0.11",
            href: `/docs/reference/go/migrations/v0.8-to-v0.11`,
          },
          {
            title: "v0.7 to v0.8",
            href: `/docs/reference/go/migrations/v0.7-to-v0.8`,
          },
        ],
      },
    ],
  },
  {
    // Language-agnostic event reference. Splitting /docs/events so its
    // conceptual half stays in Learn → Triggers and its reference half lives
    // here is Phase 2a, sequenced with DEV-471.
    title: "Events",
    links: [
      {
        title: "Event payload format",
        href: `/docs/features/events-triggers/event-format`,
      },
      { title: "Event API", href: `/docs/events` },
    ],
  },
  {
    title: "CLI",
    links: [
      { title: "Overview", href: "/docs/cli", tag: "new" },
      // Phase 2a splits the CLI reference into its own pages. Installation may
      // fold into the Local development guide instead — see DEV-468.
      // { title: "Installation", href: `/docs/cli/installation` },
      // { title: "Commands", href: `/docs/cli/commands` },
      // { title: "Dev server", href: `/docs/cli/dev-server` },
    ],
  },
  // New Sandbox API endpoints are documented in the REST API in Phase 2b
  // (DEV-481).
  { title: "REST API", href: "https://api-docs.inngest.com" },
  {
    title: "System events",
    links: [
      {
        title: "function.failed",
        href: "/docs/reference/system-events/inngest-function-failed",
        className: "font-mono",
      },
      {
        title: "function.cancelled",
        href: "/docs/reference/system-events/inngest-function-cancelled",
        className: "font-mono",
      },
    ],
  },
  { title: "Self-hosting", href: `/docs/self-hosting` },
  {
    title: "AgentKit",
    href: "https://agentkit.inngest.com",
    target: "_blank",
  },
];

const sectionLearn: (NavGroup | NavLink)[] = [
  { title: "Home", href: "/docs" },
  {
    // Top-level entries are section titles; their direct children are always
    // visible, and any group nested a further level down collapses by default.
    title: "Durable functions",
    links: [
      { title: "Overview", href: `/docs/learn/inngest-functions` },
      {
        title: "How durable execution works",
        href: `/docs/learn/how-functions-are-executed`,
      },
      {
        title: "Quick starts",
        links: [
          {
            title: "Next.js",
            href: "/docs/getting-started/nextjs-quick-start",
          },
          {
            title: "Express",
            href: "/docs/getting-started/express-quick-start",
          },
          { title: "Python", href: "/docs/getting-started/python-quick-start" },
          {
            title: "Other frameworks",
            links: [
              {
                title: "Node.js",
                href: "/docs/getting-started/nodejs-quick-start",
              },
              {
                title: "Astro",
                href: "/docs/getting-started/astro-quick-start",
              },
              { title: "H3", href: "/docs/getting-started/h3-quick-start" },
              {
                title: "NestJS",
                href: "/docs/getting-started/nestjs-quick-start",
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
        // Keeps every existing triggering page for now; merging them into a
        // single doc is DEV-471.
        title: "Triggers",
        links: [
          { title: "Overview", href: `/docs/features/events-triggers` },
          { title: "Sending events", href: `/docs/events` },
          {
            title: "Event payload format",
            href: `/docs/features/events-triggers/event-format`,
          },
          { title: "Cron functions", href: `/docs/guides/scheduled-functions` },
          {
            title: "Multiple triggers & wildcards",
            href: `/docs/guides/multiple-triggers`,
          },
          {
            title: "Sending events from functions",
            href: `/docs/guides/sending-events-from-functions`,
          },
        ],
      },
      {
        title: "Steps",
        links: [
          { title: "Building with steps", href: `/docs/learn/inngest-steps` },
          {
            title: "Sleeping",
            href: "/docs/features/inngest-functions/steps-workflows/sleeps",
          },
          {
            title: "Wait for event",
            href: "/docs/features/inngest-functions/steps-workflows/wait-for-event",
          },
          {
            title: "Wait for signal",
            href: "/docs/features/inngest-functions/steps-workflows/wait-for-signal",
          },
          {
            title: "AI steps (LLM calls)",
            href: "/docs/features/inngest-functions/steps-workflows/step-ai-orchestration",
          },
          { title: "Durable Fetch", href: tsRef("v4", "functions/fetch") },
        ],
      },
      {
        title: "Flow control",
        links: [
          { title: "Overview", href: `/docs/guides/flow-control` },
          { title: "Concurrency", href: `/docs/guides/concurrency` },
          { title: "Throttling", href: `/docs/guides/throttling` },
          { title: "Batching", href: `/docs/guides/batching` },
          { title: "Rate limit", href: `/docs/guides/rate-limiting` },
          { title: "Singleton", href: `/docs/guides/singleton` },
          { title: "Debounce", href: `/docs/guides/debounce` },
          { title: "Priority", href: `/docs/guides/priority` },
        ],
      },
      {
        // Keeps the overview plus the four sub-pages for now; merging them into
        // a single doc is DEV-470.
        title: "Error handling",
        links: [
          { title: "Overview", href: `/docs/guides/error-handling` },
          {
            title: "Retries",
            href: "/docs/features/inngest-functions/error-retries/retries",
          },
          {
            title: "Rollbacks",
            href: "/docs/features/inngest-functions/error-retries/rollbacks",
          },
          {
            title: "Failure handlers",
            href: "/docs/features/inngest-functions/error-retries/failure-handlers",
          },
          {
            title: "Inngest errors",
            href: "/docs/features/inngest-functions/error-retries/inngest-errors",
          },
        ],
      },
      {
        // Framed around how the reader's code runs. The content rework behind
        // these two entries is DEV-472.
        title: "Running your app",
        links: [
          {
            title: "Serve via HTTP",
            href: "/docs/learn/serving-inngest-functions",
          },
          {
            title: "Workers (Connect)",
            href: `/docs/setup/connect`,
            tag: "beta",
          },
        ],
      },
      {
        title: "Sessions",
        href: `/docs/features/events-triggers/sessions`,
        tag: "new",
      },
      {
        title: "Advanced",
        links: [
          {
            title: "Deferred functions",
            href: "/docs/features/inngest-functions/deferred-functions",
            tag: "beta",
          },
          {
            title: "Experiments",
            href: "/docs/features/inngest-functions/steps-workflows/step-experiments",
            tag: "new",
          },
          { title: "Idempotency", href: `/docs/guides/handling-idempotency` },
          {
            title: "Cancellation",
            links: [
              {
                title: "Overview",
                href: `/docs/features/inngest-functions/cancellation`,
              },
              {
                title: "Cancel on timeouts",
                href: `/docs/features/inngest-functions/cancellation/cancel-on-timeouts`,
              },
              {
                title: "Cancel on events",
                href: `/docs/features/inngest-functions/cancellation/cancel-on-events`,
              },
              {
                // Duplicates Platform → Recovery tools → Bulk cancel; the merge
                // is DEV-474.
                title: "Bulk cancellation",
                href: `/docs/guides/cancel-running-functions`,
              },
            ],
          },
          {
            title: "Checkpointing",
            href: `/docs/setup/checkpointing`,
          },
          // Logging lived in two places in the old nav; this is its single home.
          { title: "Logging", href: "/docs/guides/logging" },
          {
            title: "Middleware",
            links: [
              { title: "Overview", href: `/docs/features/middleware` },
              {
                title: "Creating middleware",
                href: `/docs/features/middleware/create`,
              },
              {
                title: "Dependency Injection",
                href: "/docs/features/middleware/dependency-injection",
              },
              {
                title: "Encryption Middleware",
                href: "/docs/features/middleware/encryption-middleware",
              },
              {
                title: "Sentry Middleware",
                href: "/docs/features/middleware/sentry-middleware",
              },
            ],
          },
          {
            title: "Durable Endpoints",
            links: [
              { title: "Overview", href: `/docs/learn/durable-endpoints` },
              {
                title: "Streaming",
                href: "/docs/learn/durable-endpoints/streaming",
              },
            ],
          },
        ],
      },
      {
        title: "Guides",
        links: [
          {
            title: "Working with loops",
            href: "/docs/guides/working-with-loops",
          },
          {
            title: "Optimizing performance",
            href: `/docs/improve-performance`,
          },
          { title: "Versioning", href: `/docs/learn/versioning` },
          { title: "Fan-out", href: `/docs/guides/fan-out-jobs` },
          {
            title: "Invoking other functions",
            href: `/docs/guides/invoking-functions-directly`,
          },
          { title: "Parallel steps", href: "/docs/guides/step-parallelism" },
          {
            title: "Delayed functions",
            href: `/docs/guides/delayed-functions`,
          },
          // Moving to Patterns is DEV-476.
          { title: "Background jobs", href: `/docs/guides/background-jobs` },
          {
            title: "User-defined Workflows",
            href: `/docs/guides/user-defined-workflows`,
          },
          // Relocating this is DEV-478.
          {
            title: "Mergent migration guide",
            href: `/docs/guides/mergent-migration`,
          },
          {
            // Moving these to the GitHub repo as markdown is DEV-477.
            title: "Workflow Kit",
            links: [
              { title: "Introduction", href: `/docs/reference/workflow-kit` },
              {
                title: "Creating Workflow Actions",
                href: `/docs/reference/workflow-kit/actions`,
              },
              {
                title: "Using the Workflow Engine",
                href: `/docs/reference/workflow-kit/engine`,
              },
              {
                title: "Workflow instance format",
                href: `/docs/reference/workflow-kit/workflow-instance`,
              },
              {
                title: "Components API (React)",
                href: `/docs/reference/workflow-kit/components-api`,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Durable Agents",
    links: [
      {
        title: "What is a durable agent?",
        href: `/docs/learn/durable-agents`,
      },
      // The three guides below are today's AI pattern pages. They keep their
      // URLs through Phase 1 and get re-routed to the new Agents guides once
      // those land (DEV-482).
      {
        title: "Agent tool loops",
        href: `/docs/ai-patterns/agent-tool-loops`,
      },
      {
        title: "Human-in-the-loop",
        href: `/docs/ai-patterns/human-in-the-loop`,
      },
      {
        title: "Sub-agents",
        href: `/docs/ai-patterns/sub-agent-delegation`,
      },
      // Phase 2b (DEV-482) writes the rest of this section. Uncomment each
      // entry as its page lands; leaving them out keeps the nav free of hrefs
      // that would 404 and leak into llms.txt and the sitemap.
      // { title: "Create an agent", href: `/docs/agents/create` },
      // { title: "Build a harness", href: `/docs/agents/harness` },
      // { title: "Instructions", href: `/docs/agents/instructions` },
      // { title: "Adapters", href: `/docs/agents/adapters` },
      // { title: "Tools", href: `/docs/agents/tools` },
      // { title: "Hooks", href: `/docs/agents/hooks` },
      // {
      //   // Ways to extend an agent or harness, not core features — each is
      //   // intentionally small.
      //   title: "Extensions",
      //   links: [
      //     { title: "Human in the loop", href: `/docs/agents/extensions/human-in-the-loop` },
      //     { title: "Memory", href: `/docs/agents/extensions/memory` },
      //     { title: "Skills", href: `/docs/agents/extensions/skills` },
      //     { title: "Sub-agents", href: `/docs/agents/extensions/sub-agents` },
      //   ],
      // },
    ],
  },
  {
    title: "Agent Evals",
    tag: "beta",
    links: [
      { title: "Overview", href: "/docs/learn/agent-evals" },
      {
        title: "Online scoring",
        href: "/docs/features/inngest-functions/steps-workflows/scoring",
      },
      {
        title: "Deferred scoring",
        href: "/docs/features/inngest-functions/steps-workflows/deferred-scoring",
      },
      // Phase 2b (DEV-483) expands this section:
      // { title: "Offline evals", href: `/docs/agent-evals/offline-evals` },
      // { title: "Scoring experiments", href: `/docs/agent-evals/scoring-experiments` },
      // { title: "Measuring scores", href: `/docs/agent-evals/measuring-scores` },
      // { title: "Scores for self-improving agents", href: `/docs/agent-evals/self-improving-agents` },
    ],
  },
  {
    // Promoted out of Platform → Monitor into a hallmark top-level bucket. The
    // pages keep their /docs/platform/monitor/* URLs in Phase 1; any URL change
    // is Phase 2a.
    title: "Traces & Observability",
    links: [
      { title: "Traces", href: "/docs/platform/monitor/traces" },
      // AI traces is a new page in Phase 2b (DEV-483).
      // { title: "AI traces", href: `/docs/platform/monitor/ai-traces` },
      { title: "Insights", href: "/docs/platform/monitor/insights" },
      {
        title: "Metrics & dashboards",
        href: "/docs/platform/monitor/observability-metrics",
      },
      // The purpose of these two is unresolved (DEV-475); they keep a nav home
      // until that lands.
      {
        title: "Inspecting runs",
        href: "/docs/platform/monitor/inspecting-function-runs",
      },
      {
        title: "Inspecting events",
        href: "/docs/platform/monitor/inspecting-events",
      },
    ],
  },
  // Sandboxes is written in Phase 2b (DEV-481). None of these pages exist yet,
  // so the section stays commented out rather than gated — an `unreleased` nav
  // entry would still surface in llms.txt, which does not filter on the label.
  // {
  //   title: "Sandboxes",
  //   links: [
  //     { title: "Creating sandboxes", href: `/docs/sandboxes` },
  //     { title: "Secrets", href: `/docs/sandboxes/secrets` },
  //     { title: "Lifecycle", href: `/docs/sandboxes/lifecycle` },
  //   ],
  // },
  {
    title: "Realtime",
    links: [
      { title: "Overview", href: "/docs/features/realtime" },
      {
        title: "React hooks / Next.js",
        href: "/docs/features/realtime/react-hooks",
      },
      // Page hidden for now given upcoming Durable token streaming pattern
      // TODO - Revisit this page and pattern relationship after updated IA in summer 2026
      // {
      //   title: "Stream AI responses",
      //   href: "/docs/features/realtime/stream-ai-responses",
      // },
      {
        title: "Subscription tokens",
        href: "/docs/features/realtime/subscription-tokens",
      },
    ],
  },
  {
    // Pulls the CLI, dev server and agent tooling together. These are guides —
    // the CLI reference lives in the Reference tab.
    title: "Local development",
    links: [
      // Becomes the "Inngest CLI + Dev server" guide (how to use each, how it
      // works, with screenshots) in Phase 2a.
      { title: "Dev server", href: `/docs/local-development` },
      // Needs a re-think: standalone doc, folded into the CLI guide, or a
      // Pattern. See DEV-467.
      { title: "Debugging with the CLI", href: "/docs/guides/debug-with-cli" },
      // TODO - This page should be removed as it's just a hub page, but it's likely
      // linked to from the homepage or emails, so we keep the page
      // { title: "AI development tools", href: "/docs/ai-dev-tools" },
      { title: "Agent skills", href: "/docs/ai-dev-tools/agent-skills" },
      { title: "MCP servers", href: "/docs/ai-dev-tools/mcp" },
    ],
  },
  {
    title: "Platform",
    links: [
      { title: "Environments", href: `/docs/platform/environments` },
      {
        // Two apps docs today; merging them into one page is DEV-474.
        title: "Apps",
        links: [
          { title: "Overview", href: "/docs/apps" },
          { title: "Managing apps", href: `/docs/platform/manage/apps` },
        ],
      },
      {
        // Replaces the old split between "Sync your app" and the deployment
        // overview.
        title: "Deployment",
        links: [
          { title: "Overview", href: `/docs/platform/deployment` },
          { title: "Sync your app", href: `/docs/apps/cloud` },
          {
            title: "Cloud providers",
            links: [
              { title: "Vercel", href: "/docs/deploy/vercel" },
              {
                title: "DigitalOcean",
                href: "/docs/deploy/digital-ocean",
                tag: "new",
              },
              { title: "Cloudflare Pages", href: `/docs/deploy/cloudflare` },
              { title: "Netlify", href: `/docs/deploy/netlify` },
              { title: "Render", href: `/docs/deploy/render` },
              {
                title: "Cloud provider usage limits",
                href: `/docs/usage-limits/providers`,
              },
            ],
          },
        ],
      },
      { title: "Webhooks", href: `/docs/platform/webhooks` },
      {
        // Renames the old "Manage" group.
        title: "Recovery tools",
        links: [
          { title: "Bulk replay", href: "/docs/platform/replay" },
          {
            title: "Bulk cancel",
            href: "/docs/platform/manage/bulk-cancellation",
          },
          { title: "Pausing functions", href: "/docs/guides/pause-functions" },
        ],
      },
      {
        title: "Managing keys",
        links: [
          { title: "Event keys", href: `/docs/events/creating-an-event-key` },
          { title: "Signing keys", href: `/docs/platform/signing-keys` },
          {
            title: "Rotating keys",
            href: "/docs/platform/manage/rotating-keys",
          },
          { title: "API keys", href: "/docs/platform/api-keys" },
        ],
      },
      {
        title: "Integrations",
        links: [
          {
            title: "Datadog",
            href: "/docs/platform/monitor/datadog-integration",
          },
          {
            title: "Prometheus",
            href: "/docs/platform/monitor/prometheus-metrics-export-integration",
          },
          { title: "Neon", href: `/docs/features/events-triggers/neon` },
        ],
      },
      { title: "Security", href: "/docs/learn/security" },
      { title: "Limits", href: `/docs/usage-limits/inngest` },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "FAQ", href: `/docs/faq` },
      { title: "Release phases", href: `/docs/release-phases` },
      { title: "Glossary", href: `/docs/learn/glossary` },
    ],
  },
];

const sectionExamples: NavGroup[] = [
  {
    title: "AI Agent Examples",
    defaultOpen: true,
    links: [
      { title: "AI Agents and RAG", href: `/docs/examples/ai-agents-and-rag` },
      {
        title: "AI Eval Scorer quickstart",
        href: `/docs/examples/ai-eval-scorer-quickstart`,
      },
      {
        title: "AI Metadata quickstart",
        href: `/docs/examples/ai-metadata-quickstart`,
      },
    ],
  },
  {
    title: "Durable Workflow Examples",
    defaultOpen: true,
    links: [
      { title: "All examples", href: `/docs/examples/` },
      { title: "Email Sequence", href: `/docs/examples/email-sequence` },
      {
        title: "Scheduling a one-off function",
        href: `/docs/examples/scheduling-one-off-function`,
      },
      {
        title: "Fetch run status and output",
        href: `/docs/examples/fetch-run-status-and-output`,
      },
      {
        title: "Track all function failures in Datadog",
        href: `/docs/examples/track-failures-in-datadog`,
      },
      {
        title: "Cleanup after function cancellation",
        href: `/docs/examples/cleanup-after-function-cancellation`,
      },
      { title: "Fetch: Durable HTTP requests", href: `/docs/examples/fetch` },
      {
        title: "Stream updates from functions",
        href: `/docs/examples/realtime`,
      },
      {
        title: "Setup OpenTelemetry with Inngest",
        href: `/docs/examples/open-telemetry`,
      },
      { title: "Durable Endpoints", href: `/docs/examples/durable-endpoints` },
      {
        title: "Trigger workflows from Retool",
        href: `/docs/guides/trigger-your-code-from-retool`,
      },
      {
        title: "Instrumenting GraphQL",
        href: `/docs/guides/instrumenting-graphql`,
      },
      {
        title: "Handle Clerk webhooks",
        href: `/docs/guides/clerk-webhook-events`,
      },
      {
        title: "Handle Resend webhooks",
        href: `/docs/guides/resend-webhook-events`,
      },
    ],
  },
  {
    title: "Middleware",
    defaultOpen: true,
    links: [
      {
        title: "Cloudflare Workers & Hono environment variables",
        href: `/docs/examples/middleware/cloudflare-workers-environment-variables`,
      },
    ],
  },
];

export const isNavGroup = (
  item: NavGroup | NavLink | NavSection | NavLinkGroup
): item is NavGroup => {
  return !!(item as NavGroup).links;
};
export const isNavSection = (
  item: NavGroup | NavLink | NavSection | NavLinkGroup
): item is NavSection => {
  return !!(item as NavSection).sectionLinks;
};
export const isNavLinkGroup = (
  item: NavGroup | NavLink | NavSection | NavLinkGroup
): item is NavLinkGroup => {
  return item.title && !(item as NavGroup).links && !(item as NavLink).href;
};
export const isNavLink = (
  item: NavGroup | NavLink | NavSection | NavLinkGroup
): item is NavLink => {
  return !!item.title && !!(item as NavLink).href;
};

function linkSearch(groups: (NavGroup | NavLink)[], pathname) {
  return groups.find((item) =>
    isNavGroup(item)
      ? recursiveLinkSearch(item, pathname)
      : item.href === pathname
  );
}

function recursiveLinkSearch(group: NavGroup, pathname) {
  if (group.href === pathname) return true;
  return group.links.find((link) => {
    return isNavLink(link)
      ? link.href === pathname
      : "links" in link && recursiveLinkSearch(link, pathname);
  });
}

const matchers: Record<string, (pathname: string) => any> = {
  docs: (pathname) => pathname === "/docs" || pathname === "/docs/",
  examples: (pathname) =>
    /^\/docs\/examples/.test(pathname) || linkSearch(sectionExamples, pathname),
  reference: (pathname) =>
    /^\/docs\/reference/.test(pathname) ||
    linkSearch(sectionReference, pathname),
  learn: (pathname) => linkSearch(sectionLearn, pathname),
  patterns: (pathname) => /^\/docs\/patterns/.test(pathname),
};
matchers.default = matchers.learn;

export const menuTabs = [
  {
    title: "Documentation",
    icon: PlayIcon,
    href: "/docs",
    matcher: matchers.default,
  },
  {
    title: "Examples",
    icon: LightBulbIcon,
    href: "/docs/examples/",
    matcher: matchers.examples,
  },
  {
    title: "Patterns",
    icon: Squares2X2Icon,
    href: "/docs/patterns",
    matcher: matchers.patterns,
  },
];

export const sidebarMenuTabs = [
  {
    title: "Learn",
    icon: BookOpenIcon,
    href: "/docs",
    matcher: matchers.learn,
  },
  {
    title: "Reference",
    icon: CodeBracketIcon,
    href: `/docs/reference/typescript/${TS_STABLE}/intro`,
    matcher: matchers.reference,
  },
];

const sectionPatterns: NavGroup[] = [
  {
    title: "Overview",
    defaultOpen: true,
    links: [{ title: "All patterns", href: "/docs/patterns" }],
  },
  ...PATTERN_SECTIONS.flatMap((s): NavGroup[] => {
    const links = PATTERNS.filter((p) => p.category === s.id).map((p) => ({
      title: p.title,
      href: `/docs/patterns/${s.id}/${p.slug}`,
    }));
    if (links.length === 0) return [];
    return [{ title: s.name, defaultOpen: true, links }];
  }),
];

export const topLevelNav = [
  {
    title: "Learn",
    icon: BookOpenIcon,
    href: `/docs`,
    sectionLinks: sectionLearn,
    matcher: matchers.learn,
  },
  {
    title: "Patterns",
    icon: Squares2X2Icon,
    href: "/docs/patterns",
    sectionLinks: sectionPatterns,
    matcher: matchers.patterns,
  },
  {
    title: "Reference",
    icon: CodeBracketIcon,
    href: `/docs/reference/typescript/${TS_STABLE}/intro`,
    matcher: matchers.reference,
    sectionLinks: sectionReference,
  },
  {
    title: "Examples",
    icon: LightBulbIcon,
    href: "/docs/examples/",
    sectionLinks: sectionExamples,
    matcher: matchers.examples,
  },
];

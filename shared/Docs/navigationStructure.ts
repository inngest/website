import {
  HomeIcon,
  PlayIcon,
  LightBulbIcon,
  BookOpenIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { parse } from "node:path";

// A basic link in the nav
export type NavLink = {
  title: string;
  href: string;
  className?: string;
  tag?: string;
  target?: string;
};

export type NavLinkGroup = {
  title: string;
  className?: string;
};
// A group nested of nav links with a header
export type NavGroup = {
  title: string;
  href?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  links: (NavGroup | NavLink | NavSection | NavLinkGroup)[];
  /* Whether group should be open when there is no active group */
  defaultOpen?: boolean;
  tag?: string;
  target?: string;
};
// A nav section with a nested navigation section
export type NavSection = NavLink & {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  matcher?: RegExp | Function;
  tag?: string;
  target?: string;
  sectionLinks: {
    title: string;
    links: NavLink[];
  }[];
};

// =============================================================================
// REFERENCE SECTION
// =============================================================================
const sectionReference: (NavGroup | NavLink)[] = [
  {
    title: "TypeScript SDK",
    links: [
      {
        title: "Introduction",
        href: `/docs/reference/typescript`,
      },
      {
        title: "Create the client",
        href: `/docs/reference/client/create`,
      },
      {
        title: "Create a function",
        href: `/docs/reference/functions/create`,
      },
      {
        title: "Send events",
        href: `/docs/reference/events/send`,
      },
      {
        title: "Errors",
        href: `/docs/reference/typescript/functions/errors`,
      },
      {
        title: "Handling failures",
        href: `/docs/reference/functions/handling-failures`,
      },
      {
        title: "Cancel on",
        href: `/docs/reference/typescript/functions/cancel-on`,
      },
      {
        title: "Concurrency",
        href: `/docs/functions/concurrency`,
      },
      {
        title: "Rate limit",
        href: `/docs/reference/functions/rate-limit`,
      },
      {
        title: "Singleton",
        href: `/docs/reference/functions/singleton`,
      },
      {
        title: "Debounce",
        href: `/docs/reference/functions/debounce`,
      },
      {
        title: "Function run priority",
        href: `/docs/reference/functions/run-priority`,
      },
      {
        title: "Extended Traces",
        href: "/docs/reference/typescript/extended-traces",
      },
      {
        title: "Referencing functions",
        href: `/docs/functions/references`,
      },
      {
        title: "Testing",
        href: "/docs/reference/testing",
      },
      {
        title: "Durable Endpoints",
        href: "/docs/reference/typescript/durable-endpoints",
        tag: "new",
      },
      {
        title: "Steps",
        links: [
          {
            title: "step.run()",
            href: `/docs/reference/functions/step-run`,
            className: "font-mono",
          },
          {
            title: "step.sleep()",
            href: `/docs/reference/functions/step-sleep`,
            className: "font-mono",
          },
          {
            title: "step.sleepUntil()",
            href: `/docs/reference/functions/step-sleep-until`,
            className: "font-mono",
          },
          {
            title: "step.invoke()",
            href: `/docs/reference/functions/step-invoke`,
            className: "font-mono",
          },
          {
            title: "step.waitForEvent()",
            href: `/docs/reference/functions/step-wait-for-event`,
            className: "font-mono",
          },
          {
            title: "step.sendEvent()",
            href: `/docs/reference/functions/step-send-event`,
            className: "font-mono",
          },
        ],
      },
      {
        title: "Serve",
        links: [
          {
            title: "Configuration",
            href: `/docs/reference/serve`,
          },
          {
            title: "Streaming",
            href: `/docs/streaming`,
          },
        ],
      },
      {
        title: "Middleware",
        links: [
          {
            title: "Lifecycle",
            href: `/docs/reference/middleware/lifecycle`,
          },
          {
            title: "Examples",
            href: `/docs/reference/middleware/examples`,
          },
          {
            title: "TypeScript",
            href: `/docs/reference/middleware/typescript`,
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
          {
            title: "Using TypeScript",
            href: `/docs/typescript`,
          },
          {
            title: "ESLint plugin",
            href: `/docs/sdk/eslint`,
          },
          { title: "Upgrading to v3", href: `/docs/sdk/migration` },
        ],
      },
    ],
  },
  {
    title: "Python SDK",
    links: [
      {
        title: "Introduction",
        href: `/docs/reference/python`,
      },
      {
        title: "Quick start",
        href: `/docs/reference/python/overview/quick-start`,
      },
      {
        title: "Inngest Client",
        href: `/docs/reference/python/client/overview`,
      },
      {
        title: "Create function",
        href: `/docs/reference/python/functions/create`,
      },
      {
        title: "Send events",
        href: `/docs/reference/python/client/send`,
      },
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
          {
            title: "invoke",
            href: `/docs/reference/python/steps/invoke`,
          },
          {
            title: "invoke_by_id",
            href: `/docs/reference/python/steps/invoke_by_id`,
          },
          {
            title: "parallel",
            href: `/docs/reference/python/steps/parallel`,
          },
          {
            title: "run",
            href: `/docs/reference/python/steps/run`,
          },
          {
            title: "send_event",
            href: `/docs/reference/python/steps/send-event`,
          },
          {
            title: "sleep",
            href: `/docs/reference/python/steps/sleep`,
          },
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
          {
            title: "Testing",
            href: `/docs/reference/python/guides/testing`,
          },
          {
            title: "Modal",
            href: `/docs/reference/python/guides/modal`,
          },
          {
            title: "Pydantic",
            href: `/docs/reference/python/guides/pydantic`,
          },
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
    title: "REST API",
    href: "https://api-docs.inngest.com/docs/inngest-api/1j9i5603g5768-introduction",
  },
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
  {
    title: "Self-hosting",
    href: `/docs/self-hosting`,
  },
];

// =============================================================================
// LEARN SECTION
// =============================================================================
const sectionLearn: (NavGroup | NavLink)[] = [
  { title: "Home", href: "/docs" },
  {
    title: "Quick starts",
    defaultOpen: true,
    links: [
      {
        title: "Next.js",
        href: "/docs/getting-started/nextjs-quick-start",
      },
      {
        title: "Node.js",
        href: "/docs/getting-started/nodejs-quick-start",
      },
      {
        title: "Python",
        href: "/docs/getting-started/python-quick-start",
      },
    ],
  },
  {
    title: "Concepts",
    defaultOpen: true,
    links: [
      {
        title: "How Durable execution works",
        href: `/docs/learn/how-functions-are-executed`,
      },
      {
        title: "Durable Functions",
        links: [
          {
            title: "Overview",
            href: `/docs/learn/inngest-functions`,
          },
          {
            title: "Serve Inngest Functions",
            href: "/docs/learn/serving-inngest-functions",
          },
          {
            title: "Triggering functions",
            href: `/docs/features/events-triggers`,
          },
          {
            title: "Idempotency",
            href: `/docs/guides/handling-idempotency`,
          },
        ],
      },
      {
        title: "Durable Endpoints",
        href: `/docs/learn/durable-endpoints`,
        tag: "new",
      },
      {
        title: "Steps",
        links: [
          {
            title: "Building with steps",
            href: `/docs/learn/inngest-steps`,
          },
          {
            title: "Sleeping",
            href: "/docs/features/inngest-functions/steps-workflows/sleeps",
          },
          {
            title: "Wait for event + signal",
            href: "/docs/features/inngest-functions/steps-workflows/wait-for-event",
          },
          {
            title: "Invoke other functions",
            href: `/docs/guides/invoking-functions-directly`,
          },
          {
            title: "AI steps (LLM calls)",
            href: "/docs/features/inngest-functions/steps-workflows/step-ai-orchestration",
          },
          {
            title: "Durable Fetch",
            href: "/docs/features/inngest-functions/steps-workflows/fetch",
          },
        ],
      },
      {
        title: "Error handling",
        links: [
          {
            title: "Overview",
            href: `/docs/guides/error-handling`,
          },
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
        title: "Flow control",
        links: [
          {
            title: "Overview",
            href: `/docs/guides/flow-control`,
          },
          {
            title: "Concurrency",
            href: `/docs/guides/concurrency`,
          },
          {
            title: "Throttling",
            href: `/docs/guides/throttling`,
          },
          {
            title: "Batching",
            href: `/docs/guides/batching`,
          },
          {
            title: "Rate limit",
            href: `/docs/guides/rate-limiting`,
          },
          {
            title: "Singleton",
            href: `/docs/guides/singleton`,
          },
          {
            title: "Debounce",
            href: `/docs/guides/debounce`,
          },
          {
            title: "Priority",
            href: `/docs/guides/priority`,
          },
        ],
      },
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
            title: "Bulk cancellation",
            href: `/docs/guides/cancel-running-functions`,
          },
        ],
      },
      {
        title: "Realtime",
        tag: "new",
        links: [
          {
            title: "Overview",
            href: "/docs/features/realtime",
          },
          {
            title: "React hooks / Next.js",
            href: "/docs/features/realtime/react-hooks",
          },
        ],
      },
      {
        title: "Environments and Apps",
        href: "/docs/apps",
        links: [
          {
            title: "Overview",
            href: "/docs/apps",
          },
          {
            title: "Environments",
            href: `/docs/platform/environments`,
          },
          {
            title: "Apps",
            href: `/docs/platform/manage/apps`,
          },
          {
            title: "Event keys",
            href: `/docs/events/creating-an-event-key`,
          },
          {
            title: "Signing keys",
            href: `/docs/platform/signing-keys`,
          },
        ],
      },
    ],
  },
  {
    title: "Guides",
    defaultOpen: true,
    links: [
      {
        title: "Versioning",
        href: `/docs/learn/versioning`,
      },
      {
        title: "Local development",
        href: `/docs/local-development`,
      },
      {
        title: "Patterns",
        links: [
          {
            title: "Multi-step functions",
            href: "/docs/guides/multi-step-functions",
          },
          {
            title: "Parallel steps",
            href: "/docs/guides/step-parallelism",
          },
          {
            title: "Fan-out",
            href: `/docs/guides/fan-out-jobs`,
          },
          {
            title: "Working with loops",
            href: "/docs/guides/working-with-loops",
          },
          {
            title: "Delayed functions",
            href: `/docs/guides/delayed-functions`,
          },
          {
            title: "Cron functions",
            href: `/docs/guides/scheduled-functions`,
          },
          {
            title: "Background jobs",
            href: `/docs/guides/background-jobs`,
          },
          {
            title: "Multiple triggers & wildcards",
            href: `/docs/guides/multiple-triggers`,
          },
          {
            title: "Sending events from functions",
            href: `/docs/guides/sending-events-from-functions`,
          },
          {
            title: "User-defined Workflows",
            href: `/docs/guides/user-defined-workflows`,
          },
          {
            title: "Mergent migration guide",
            href: `/docs/guides/mergent-migration`,
          },
          {
            title: "Workflow Kit",
            links: [
              {
                title: "Introduction",
                href: `/docs/reference/workflow-kit`,
              },
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
      {
        title: "Deploying",
        defaultOpen: true,
        links: [
          {
            title: "Overview",
            href: `/docs/platform/deployment`,
          },
          {
            title: "Sync your app",
            href: `/docs/apps/cloud`,
          },
          {
            title: "Connect",
            href: `/docs/setup/connect`,
            tag: "new",
          },
          {
            title: "Checkpointing",
            href: `/docs/setup/checkpointing`,
            tag: "new",
          },
          {
            title: "Cloud providers",
            links: [
              {
                title: "Vercel",
                href: "/docs/deploy/vercel",
              },
              {
                title: "DigitalOcean",
                href: "/docs/deploy/digital-ocean",
                tag: "new",
              },
              {
                title: "Cloudflare Pages",
                href: `/docs/deploy/cloudflare`,
              },
              {
                title: "Netlify",
                href: `/docs/deploy/netlify`,
              },
              {
                title: "Render",
                href: `/docs/deploy/render`,
              },
              {
                title: "Cloud Provider Usage Limits",
                href: `/docs/usage-limits/providers`,
              },
            ],
          },
        ],
      },
      {
        title: "Optimizing Performance",
        href: `/docs/improve-performance`,
      },
      {
        title: "Logging",
        href: "/docs/guides/logging",
      },
      {
        title: "Middleware",
        links: [
          {
            title: "Overview",
            href: `/docs/features/middleware`,
          },
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
        title: "Events & Triggers",
        links: [
          {
            title: "Overview",
            href: `/docs/features/events-triggers`,
          },
          {
            title: "Sending events",
            href: `/docs/events`,
          },
          {
            title: "Event payload format",
            href: `/docs/features/events-triggers/event-format`,
          },
          {
            title: "Writing expressions",
            href: `/docs/guides/writing-expressions`,
          },
          {
            title: "Consuming webhook events",
            href: `/docs/platform/webhooks`,
          },
        ],
      },
    ],
  },
  {
    title: "Platform",
    links: [
      {
        title: "Manage",
        links: [
          {
            title: "Bulk replay",
            href: "/docs/platform/replay",
          },
          {
            title: "Bulk cancel",
            href: "/docs/platform/manage/bulk-cancellation",
          },
          {
            title: "Pausing",
            href: "/docs/guides/pause-functions",
          },
        ],
      },
      {
        title: "Monitor",
        links: [
          {
            title: "Inspecting runs",
            href: "/docs/platform/monitor/inspecting-function-runs",
          },
          {
            title: "Traces",
            href: "/docs/platform/monitor/traces",
          },
          {
            title: "Observability and metrics",
            href: "/docs/platform/monitor/observability-metrics",
          },
          {
            title: "Insights",
            href: "/docs/platform/monitor/insights",
            tag: "new",
          },
          {
            title: "Events",
            href: "/docs/platform/monitor/inspecting-events",
          },
        ],
      },
      {
        title: "Integrations",
        links: [
          {
            title: "Neon",
            href: `/docs/features/events-triggers/neon`,
          },
          {
            title: "Datadog",
            href: "/docs/platform/monitor/datadog-integration",
          },
          {
            title: "Prometheus",
            href: "/docs/platform/monitor/prometheus-metrics-export-integration",
          },
        ],
      },
    ],
  },
  {
    title: "AI",
    links: [
      {
        title: "Dev Server MCP",
        href: "/docs/ai-dev-tools/mcp",
      },
      {
        title: "AgentKit",
        href: "https://agentkit.inngest.com",
        target: "_blank",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        title: "Security",
        href: "/docs/learn/security",
      },
      {
        title: "Glossary",
        href: `/docs/learn/glossary`,
      },
      {
        title: "Release phases",
        href: `/docs/release-phases`,
      },
      {
        title: "FAQ",
        href: `/docs/faq`,
      },
      {
        title: "Limitations",
        href: `/docs/usage-limits/inngest`,
      },
    ],
  },
];

// =============================================================================
// EXAMPLES SECTION (kept for backwards compatibility)
// =============================================================================
const sectionExamples: NavGroup[] = [
  {
    title: "Examples",
    defaultOpen: true,
    links: [
      { title: "All examples", href: `/docs/examples/` },
      {
        title: "AI Agents and RAG",
        href: `/docs/examples/ai-agents-and-rag`,
      },
      {
        title: "Email Sequence",
        href: `/docs/examples/email-sequence`,
      },
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
      {
        title: "Fetch: Durable HTTP requests",
        href: `/docs/examples/fetch`,
      },
      {
        title: "Stream updates from functions",
        href: `/docs/examples/realtime`,
      },
      {
        title: "Setup OpenTelemetry with Inngest",
        href: `/docs/examples/open-telemetry`,
      },
      {
        title: "Durable Endpoints",
        href: `/docs/examples/durable-endpoints`,
      },
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

// =============================================================================
// TYPE GUARDS
// =============================================================================
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

// =============================================================================
// LINK SEARCH HELPERS
// =============================================================================
function linkSearch(groups: (NavGroup | NavLink)[], pathname) {
  return groups.find((item) =>
    isNavGroup(item)
      ? recursiveLinkSearch(item, pathname)
      : item.href === pathname
  );
}

function recursiveLinkSearch(group: NavGroup, pathname) {
  if (group.href === pathname) {
    return true;
  }
  return group.links.find((link) => {
    return isNavLink(link)
      ? link.href === pathname
      : "links" in link && recursiveLinkSearch(link, pathname);
  });
}

// =============================================================================
// MATCHERS
// =============================================================================
const matchers: Record<string, (pathname: string) => any> = {
  docs: (pathname) => pathname === "/docs" || pathname === "/docs/",
  examples: (pathname) =>
    /^\/docs\/examples/.test(pathname) || linkSearch(sectionExamples, pathname),
  reference: (pathname) =>
    /^\/docs\/reference/.test(pathname) ||
    linkSearch(sectionReference, pathname),
  learn: (pathname) => linkSearch(sectionLearn, pathname),
};
matchers.default = matchers.learn;

// =============================================================================
// MENU TABS (Top navigation)
// =============================================================================
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
];

// =============================================================================
// SIDEBAR TABS (Sidebar navigation)
// =============================================================================
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
    href: "/docs/reference/typescript",
    matcher: matchers.reference,
  },
];

// =============================================================================
// TOP LEVEL NAV
// =============================================================================
export const topLevelNav = [
  {
    title: "Learn",
    icon: BookOpenIcon,
    href: `/docs`,
    sectionLinks: sectionLearn,
    matcher: matchers.learn,
  },
  {
    title: "Reference",
    icon: CodeBracketIcon,
    href: "/docs/reference/typescript",
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

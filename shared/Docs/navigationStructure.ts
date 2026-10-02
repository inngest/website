import {
  PlayIcon,
  LightBulbIcon,
  BookOpenIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { TS_STABLE, type TSVersion } from "./LanguageStore";
import { docsRefreshOutline, type DocsRefreshPage } from "./docsRefreshOutline";
import PATTERN_SECTIONS, { PATTERNS } from "../Patterns/patternsData";

function tsRef(version: TSVersion, path: string): string {
  return `/docs/reference/typescript/${version}/${path}`;
}

export type NavLink = {
  title: string;
  href: string;
  planned?: boolean;
  className?: string;
  tag?: string;
  target?: string;
  unreleased?: string;
};

export type NavLinkGroup = {
  title: string;
  className?: string;
  planned?: boolean;
};

export type NavGroup = {
  title: string;
  href?: string;
  planned?: boolean;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  links: (NavGroup | NavLink | NavSection | NavLinkGroup)[];
  defaultOpen?: boolean;
  /** Open by default when the current page isn't in any other collapsible group. */
  openWhenIdle?: boolean;
  /** Always-open top-level section with an icon header (Learn sidebar). */
  section?: boolean;
  tag?: string;
  target?: string;
  unreleased?: string;
};

export type NavSection = NavLink & {
  id: "docs" | "examples" | "sdk";
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
            title: "Framework handlers",
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
      { title: "Introduction", href: `/docs/reference/go` },
      {
        title: "Durable Workflows",
        href: `/docs/reference/go/durable-workflows`,
      },
      {
        title: "Durable Endpoints",
        href: `/docs/reference/go/durable-endpoints`,
      },
      {
        title: "Development and production",
        href: `/docs/reference/go/dev-and-production`,
      },
      {
        title: "Package reference",
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
    title: "CLI",
    href: "/docs/cli",
    tag: "new",
  },
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
];

function docsRefreshNav(page: DocsRefreshPage): NavGroup | NavLink {
  if (page.section) {
    return {
      title: page.title,
      section: true,
      icon: page.icon as NavGroup["icon"],
      links: [
        ...(page.href ? [{ title: "Overview", href: page.href }] : []),
        ...(page.children ?? []).map(docsRefreshNav),
      ],
    };
  }

  if (page.children?.length) {
    const hasOverview = page.children.some(
      (child) => child.title === "Overview"
    );
    return {
      title: page.title,
      ...(page.openWhenIdle ? { openWhenIdle: true } : {}),
      links: [
        ...(!hasOverview ? [{ title: "Overview", href: page.href }] : []),
        ...page.children.map(docsRefreshNav),
      ],
    };
  }

  return {
    title: page.title,
    href: page.href,
    className: page.monospace ? "font-mono" : undefined,
  };
}

const sectionDocs: (NavGroup | NavLink)[] =
  docsRefreshOutline.map(docsRefreshNav);

const sectionExamples: NavGroup[] = [
  {
    title: "AI Agent Examples",
    defaultOpen: true,
    links: [
      { title: "AI Agents and RAG", href: `/docs/examples/ai-agents-and-rag` },
      {
        title: "AI Eval Scorer quickstart",
        href: `/docs/agent-evals/guides/llm-judge`,
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
  docs: (pathname) =>
    /^\/docs(\/|$)/.test(pathname) &&
    !/^\/docs\/(examples|patterns|reference|sdk|cli)(\/|$)/.test(pathname) &&
    pathname !== "/docs/typescript",
  examples: (pathname) =>
    /^\/docs\/(examples|patterns)(\/|$)/.test(pathname) ||
    linkSearch(sectionExamples, pathname),
  reference: (pathname) =>
    /^\/docs\/(reference|sdk|cli)(\/|$)/.test(pathname) ||
    pathname === "/docs/typescript" ||
    linkSearch(sectionReference, pathname),
};

export const menuTabs = [
  {
    title: "Documentation",
    icon: PlayIcon,
    href: "/docs",
    matcher: matchers.docs,
  },
  {
    title: "Examples",
    icon: LightBulbIcon,
    href: "/docs/examples/",
    matcher: matchers.examples,
  },
  {
    title: "SDKs & APIs",
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
    id: "docs",
    title: "Documentation",
    icon: BookOpenIcon,
    href: `/docs`,
    sectionLinks: sectionDocs,
    matcher: matchers.docs,
  },
  {
    id: "examples",
    title: "Examples",
    icon: LightBulbIcon,
    href: "/docs/examples/",
    sectionLinks: [...sectionExamples, ...sectionPatterns],
    matcher: matchers.examples,
  },
  {
    id: "sdk",
    title: "SDKs & APIs",
    icon: CodeBracketIcon,
    href: `/docs/reference/typescript/${TS_STABLE}/intro`,
    matcher: matchers.reference,
    sectionLinks: sectionReference,
  },
];

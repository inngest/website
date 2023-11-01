import TypeScriptIcon from "src/shared/Icons/TypeScript";
import PythonIcon from "src/shared/Icons/Python";
import GuideIcon from "src/shared/Icons/Guide";
import {
  HomeIcon,
  CogIcon,
  PlayIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

// A basic link in the nav
type NavLink = {
  title: string;
  href: string;
};
// A group nested of nav links with a header
type NavGroup = {
  title: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  links: (NavLink | NavSection)[];
};
// A nav section with a nested navigation section
type NavSection = {
  title: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  href: string;
  matcher?: RegExp;
  sectionLinks: {
    title: string;
    links: NavLink[];
  }[];
};

const sectionGettingStarted = [
  {
    title: "Quick start tutorials",
    links: [
      {
        title: "Next.js",
        href: "/quick-start",
      },
    ],
  },
  {
    title: "Learn the basics",
    links: [
      { title: "SDK Overview", href: `/sdk/overview` },
      { title: "Serving the API & Frameworks", href: `/sdk/serve` },
      { title: "Writing Functions", href: `/functions` },
      { title: "Sending Events", href: `/events` },
      {
        title: "Multi-step Functions",
        href: `/functions/multi-step`,
      },
      {
        title: "Local Development",
        href: `/local-development`,
      },
    ],
  },
];
const sectionGuides = [
  {
    title: "Patterns",
    links: [
      {
        title: "Background jobs",
        href: `/guides/background-jobs`,
      },
      {
        title: "Enqueueing future jobs",
        href: `/guides/enqueueing-future-jobs`,
      },
      {
        title: "Scheduled functions",
        href: `/guides/scheduled-functions`,
      },
      {
        title: "Step parallelism",
        href: `/guides/step-parallelism`,
      },
      {
        title: "Fan-out jobs",
        href: `/guides/fan-out-jobs`,
      },

      {
        title: "Batching events",
        href: `/guides/batching`,
      },
    ],
  },
  {
    title: "How to",
    links: [
      {
        title: "Logging",
        href: `/guides/logging`,
      },
    ],
  },
  {
    title: "Use cases",
    links: [
      {
        title: "User-defined Workflows",
        href: `/guides/user-defined-workflows`,
      },
      {
        title: "Trigger code from Retool",
        href: `/guides/trigger-your-code-from-retool`,
      },
      {
        title: "Instrumenting GraphQL",
        href: `/guides/instrumenting-graphql`,
      },
    ],
  },
];

const sectionPlatform = [
  {
    title: "Deploying",
    links: [
      { title: "How to Deploy", href: `/deploy` },
      { title: "Deploy: Vercel", href: `/deploy/vercel` },
      { title: "Deploy: Netlify", href: `/deploy/netlify` },
      {
        title: "Deploy: Cloudflare Pages",
        href: `/deploy/cloudflare`,
      },
    ],
  },
  {
    title: "Inngest Cloud",
    links: [
      {
        title: "Working With Environments",
        href: `/platform/environments`,
      },
      {
        title: "Creating an Event Key",
        href: `/events/creating-an-event-key`,
      },
    ],
  },
];

const sectionTypeScriptReference = [
  {
    title: "Overview",
    // TODO - Allow this to be flattened w/ NavGroup
    links: [
      {
        title: "Introduction",
        href: `/reference/typescript`,
      },
    ],
  },
  {
    title: "Inngest Client",
    links: [
      {
        title: "Create the client",
        href: `/reference/client/create`,
      },
    ],
  },
  {
    title: "Functions",
    links: [
      {
        title: "Create function",
        href: `/reference/functions/create`,
      },
      {
        title: "Define steps (step.run)",
        href: `/reference/functions/step-run`,
      },
      {
        title: "Sleep",
        href: `/reference/functions/step-sleep`,
      },
      {
        title: "Sleep until a time",
        href: `/reference/functions/step-sleep-until`,
      },
      {
        title: "Wait for additional events",
        href: `/reference/functions/step-wait-for-event`,
      },
      {
        title: "Sending events from functions",
        href: `/reference/functions/step-send-event`,
      },
      {
        title: "Error handling & retries",
        href: `/functions/retries`,
        // href: `/reference/functions/error-handling`,
      },
      {
        title: "Handling failures",
        href: `/reference/functions/handling-failures`,
      },
      {
        title: "Cancel running functions",
        href: `/functions/cancellation`,
        // href: `/reference/functions/cancel-running-functions`,
      },
      {
        title: "Concurrency",
        href: `/functions/concurrency`,
        // href: `/reference/functions/concurrency`,
      },
      {
        title: "Rate limit",
        href: `/reference/functions/rate-limit`,
      },
      {
        title: "Debounce",
        href: `/reference/functions/debounce`,
      },
      {
        title: "Function run priority",
        href: `/reference/functions/run-priority`,
      },
      // {
      //   title: "Logging",
      //   href: `/reference/functions/logging`,
      // },
    ],
  },
  {
    title: "Events",
    links: [
      {
        title: "Send",
        href: `/reference/events/send`,
      },
    ],
  },
  {
    title: "Serve",
    links: [
      // {
      //   title: "Framework handlers",
      //   href: `/sdk/serve`,
      // },
      {
        title: "Configuration",
        href: `/reference/serve`,
      },
      { title: "Streaming", href: `/streaming` },
    ],
  },
  {
    title: "Middleware",
    links: [
      {
        title: "Overview",
        href: `/reference/middleware/overview`,
      },
      {
        title: "Creating middleware",
        href: `/reference/middleware/create`,
      },
      {
        title: "Lifecycle",
        href: `/reference/middleware/lifecycle`,
      },
      {
        title: "Examples",
        href: `/reference/middleware/examples`,
      },
      {
        title: "TypeScript",
        href: `/reference/middleware/typescript`,
      },
    ],
  },
  {
    title: "Using the SDK",
    links: [
      {
        title: "Environment variables",
        href: `/sdk/environment-variables`,
      },
      {
        title: "Using TypeScript",
        href: `/typescript`,
      },
      { title: "Upgrading to v3", href: `/sdk/migration` },
    ],
  },
  {
    title: "Usage Limits",
    links: [
      {
        title: "Inngest Cloud",
        href: `/usage-limits/inngest`,
      },
      {
        title: "Serverless Providers",
        href: `/usage-limits/providers`,
      },
    ],
  },
];

export const topLevelNav = [
  {
    title: "Home",
    icon: HomeIcon,
    href: `/`,
  },
  {
    title: "Getting started",
    icon: PlayIcon,
    href: "/quick-start",
    matcher: /\/(getting-started|quick-start)/,
    sectionLinks: sectionGettingStarted,
  },
  {
    title: "Guides",
    icon: GuideIcon,
    href: "/guides",
    matcher: /\/guides/,
    sectionLinks: sectionGuides,
  },
  {
    title: "Platform",
    icon: CogIcon,
    href: "/platform",
    matcher: /\/platform/,
    sectionLinks: sectionPlatform,
  },
  {
    title: "Reference",
    links: [
      {
        title: "TypeScript SDK",
        icon: TypeScriptIcon,
        href: `/reference/typescript`,
        sectionLinks: sectionTypeScriptReference,
      },
      {
        title: "Python SDK",
        icon: PythonIcon,
        href: `/reference/python`,
        sectionLinks: [],
      },
      {
        title: "REST API",
        icon: CommandLineIcon,
        href: `/reference/api`,
        sectionLinks: [],
      },
    ],
  },
];

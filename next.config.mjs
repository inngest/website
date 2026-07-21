import createMDX from "@next/mdx";
import { remarkPlugins } from "./mdx/remark.mjs";
import { rehypePlugins } from "./mdx/rehype.mjs";
import { recmaPlugins } from "./mdx/recma.mjs";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// All permanent redirects (source -> destination)
const permanentRedirects = [
  // Legacy docs
  ["/docs/functions/testing-functions", "/docs/local-development"],
  ["/docs/what-is-inngest", "/docs"],
  ["/docs/reference/functions/retries", "/docs/functions/retries"],
  ["/docs/creating-an-event-key", "/docs/events/creating-an-event-key"],
  ["/docs/event-format-and-structure", "/docs/reference/events/send"],
  ["/docs/events/event-format-and-structure", "/docs/reference/events/send"],
  ["/docs/writing-and-running-fuctions", "/docs/functions"], //typo
  ["/docs/cli/steps/", "/docs/learn/inngest-steps"],
  ["/docs/events/sources/sdks", "/docs/events"],
  ["/docs/deploying-fuctions", "/docs/apps/cloud"],
  ["/docs/deploy", "/docs/apps/cloud"],
  ["/docs/functions/introduction", "/docs/functions"],
  ["/docs/how-inngest-works", "/docs"], // TODO/DOCS redirect this to new concepts page
  ["/docs/frameworks/cloudflare-pages", "/docs/sdk/serve#framework-cloudflare"],
  ["/docs/frameworks/express", "/docs/sdk/serve#framework-express"],
  ["/docs/frameworks/nextjs", "/docs/sdk/serve#framework-next-js"],
  ["/docs/frameworks/redwoodjs", "/docs/sdk/serve#framework-redwood"],
  ["/docs/sdk/reference/serve", "/docs/reference/serve"],
  ["/docs/events/webhooks", "/docs/platform/webhooks"],
  ["/docs/functions/retries", "/docs/reference/typescript/functions/errors"],
  ["/docs/functions/cancellation", "/docs/guides/cancel-running-functions"],
  [
    "/docs/reference/python/overview/quick-start",
    "/docs/getting-started/python-quick-start",
  ],
  ["/docs/sdk/overview", "/docs"],
  ["/docs/dev-server", "/docs/local-development"],
  ["/docs/guides/development-with-docker", "/docs/local-development"],

  // Other pages
  ["/uses/zero-infra-llm-ai", "/ai"],
  // Was -> /uses/workflow-engine, which now redirects to /uses/webhooks.
  // Point straight at the final destination to avoid a redirect chain.
  ["/uses/internal-tools", "/uses/webhooks"],
  ["/uses/user-journey-automation", "/blog/lifecycle-emails-with-resend"],

  // new IA
  ["/docs/security", "/docs/learn/security"],
  ["/docs/functions", "/docs/learn/inngest-functions"],
  ["/docs/functions/multi-step", "/docs/learn/inngest-steps"],
  ["/docs/guides/multi-step-functions", "/docs/learn/inngest-steps"],
  [
    "/docs/features/inngest-functions/steps-workflows/fetch",
    "/docs/reference/typescript/functions/fetch",
  ],
  ["/docs/guides/enqueueing-future-jobs", "/docs/guides/delayed-functions"],
  ["/docs/steps", "/docs/learn/inngest-steps"],
  ["/docs/features/inngest-functions", "/docs/learn/inngest-functions"],
  [
    "/docs/features/inngest-functions/steps-workflows",
    "/docs/learn/inngest-functions",
  ],
  ["/blog/banger", "/blog/banger-video-rendering-pipeline"],
  [
    "/docs/reference/serve#custom-frameworks",
    "/docs/learn/serving-inngest-functions#custom-frameworks",
  ],
  ["/docs/sdk/serve", "/docs/learn/serving-inngest-functions"],
  [
    "/docs/getting-started/quick-start/python",
    "/docs/getting-started/python-quick-start",
  ],
  ["/docs/quick-start", "/docs/getting-started/nextjs-quick-start"],
  [
    "/docs/reference/typescript/functions/errors",
    "/docs/features/inngest-functions/error-retries/inngest-errors",
  ],
  ["/docs/reference/middleware/overview", "/docs/features/middleware"],
  [
    "/docs/reference/middleware/create",
    "/docs/features/middleware/create?guide=typescript",
  ],
  [
    "/docs/reference/middleware/typescript",
    "/docs/features/middleware/dependency-injection?guide=typescript",
  ],
  [
    "/docs/reference/python/middleware/encryption",
    "/docs/features/middleware/encryption-middleware?guide=python",
  ],
  ["/blog/nextjs-openai-o1", "/blog/agentic-workflow-example"],

  ["/docs/agent-kit/:any*", "https://agentkit.inngest.com"],

  ["/docs/features/realtime/nextjs", "/docs/features/realtime/react-hooks"],

  // Durable Endpoints rename
  ["/docs/learn/rest-endpoints", "/docs/learn/durable-endpoints"],

  // Metadata reference moved to /reference/typescript/functions/metadata
  [
    "/docs/features/inngest-functions/steps-workflows/metadata",
    "/docs/reference/typescript/functions/metadata",
  ],

  // TypeScript SDK versioned docs - landing page redirects (301 permanent)
  ["/docs/reference/typescript", "/docs/reference/typescript/intro"],
  ["/docs/reference/typescript/v4", "/docs/reference/typescript/v4/intro"],
  ["/docs/reference/typescript/v3", "/docs/reference/typescript/v3/intro"],
  // Legacy short paths - redirect directly to v4 TypeScript docs (collapsed from two-hop chain)
  [
    "/docs/reference/client/create",
    "/docs/reference/typescript/v4/client/create",
  ],
  ["/docs/reference/events/send", "/docs/reference/typescript/v4/events/send"],
  [
    "/docs/reference/functions/create",
    "/docs/reference/typescript/v4/functions/create",
  ],
  [
    "/docs/reference/functions/debounce",
    "/docs/reference/typescript/v4/functions/debounce",
  ],
  [
    "/docs/reference/functions/handling-failures",
    "/docs/reference/typescript/v4/functions/handling-failures",
  ],
  [
    "/docs/reference/functions/rate-limit",
    "/docs/reference/typescript/v4/functions/rate-limit",
  ],
  [
    "/docs/reference/functions/run-priority",
    "/docs/reference/typescript/v4/functions/run-priority",
  ],
  [
    "/docs/reference/functions/singleton",
    "/docs/reference/typescript/v4/functions/singleton",
  ],
  [
    "/docs/reference/functions/step-invoke",
    "/docs/reference/typescript/v4/functions/step-invoke",
  ],
  [
    "/docs/reference/functions/step-run",
    "/docs/reference/typescript/v4/functions/step-run",
  ],
  [
    "/docs/reference/functions/step-send-event",
    "/docs/reference/typescript/v4/functions/step-send-event",
  ],
  [
    "/docs/reference/functions/step-sleep-until",
    "/docs/reference/typescript/v4/functions/step-sleep-until",
  ],
  [
    "/docs/reference/functions/step-sleep",
    "/docs/reference/typescript/v4/functions/step-sleep",
  ],
  [
    "/docs/reference/functions/step-wait-for-event",
    "/docs/reference/typescript/v4/functions/step-wait-for-event",
  ],
  [
    "/docs/reference/functions/step-wait-for-signal",
    "/docs/reference/typescript/v4/functions/step-wait-for-signal",
  ],
  ["/docs/reference/serve", "/docs/reference/typescript/v4/serve"],
  ["/docs/reference/testing", "/docs/reference/typescript/v4/testing"],
  [
    "/docs/reference/middleware/lifecycle",
    "/docs/reference/typescript/v4/middleware/lifecycle",
  ],
  [
    "/docs/reference/middleware/examples",
    "/docs/reference/typescript/v4/middleware/examples",
  ],
  [
    "/docs/reference/typescript/migrations/v3-to-v4",
    "/docs/reference/typescript/v4/migrations/v3-to-v4",
  ],
  ["/docs/sdk/migration", "/docs/reference/typescript/v3/migrations/v2-to-v3"],
  [
    "/patterns/cancelling-scheduled-functions",
    "/docs/guides/cancel-running-functions",
  ],
  ["/patterns/running-code-on-a-schedule", "/docs/guides/scheduled-functions"],

  // run-experiments-in-production moved from the Durable Workflows category to
  // the new AI Evals category (per Lauren's IA feedback). Old category URL is
  // shared in Slack and linked from the experiments doc, so redirect it.
  [
    "/docs/patterns/durable/run-experiments-in-production",
    "/docs/patterns/ai-evals/run-experiments-in-production",
  ],

  // New IA: platform + use-case pages replacing legacy landing pages, plus
  // a few standalone LPs being retired.
  ["/uses/durable-workflows", "/platform/durable-execution"],
  ["/compare-to-legacy-queues", "/platform/flow-control"],
  ["/uses/serverless-cron-jobs", "/uses/scheduled-jobs"],
  ["/uses/workflow-engine", "/uses/webhooks"],
  ["/durable-endpoints", "/platform/durable-execution"],
  ["/platform", "/platform/durable-execution"],
  ["/ai-personalized-documentation", "/docs/ai-dev-tools/agent-skills"],
  ["/ai/early-access", "/ai"],
  ["/launch-week", "/"],
  ["/product/how-inngest-works", "/"],
  // The scheduled-jobs page moved under /uses; preserve the old URL.
  ["/scheduled-jobs", "/uses/scheduled-jobs"],
];

// Pattern slug -> category, for redirecting old flat pattern URLs to the new
// /docs/patterns/<category>/<slug> shape. Keep in sync with
// shared/Patterns/patternsData.ts (PATTERNS).
const PATTERN_SLUG_TO_CATEGORY = {
  "reliably-run-critical-workflows": "durable",
  "flash-sales-and-bursty-workflows": "flow",
  "event-coordination-for-lost-customers": "events",
  "reliable-scheduling-systems": "events",
  "running-functions-in-parallel": "events",
  "running-at-specific-times": "schedule",
  "build-reliable-webhooks": "jobs",
  "keeping-your-api-fast": "jobs",
};

async function redirects() {
  // Read blog redirects from MDX frontmatter
  const fs = await import("fs");
  const matter = await import("gray-matter");
  const blogRedirects = fs.default
    .readdirSync("./content/blog/")
    .filter((fname) => fname.endsWith(".mdx") || fname.endsWith(".md"))
    .map((fname) => {
      const filePath = `./content/blog/${fname}`;
      const source = fs.default.readFileSync(filePath, "utf-8");
      const { data } = matter.default(source);
      if (data.redirect) {
        return {
          source: `/blog/${fname.replace(/\.mdx?$/, "")}`,
          destination: data.redirect,
          permanent: true,
        };
      }
      return null;
    })
    .filter(Boolean);

  return [
    ...blogRedirects,
    {
      // /sales-inquiry-form renamed to /contact
      source: "/sales-inquiry-form",
      destination: "/contact",
      permanent: true,
    },
    {
      // /careers redirects to /about
      source: "/careers",
      destination: "/about",
      permanent: true,
    },
    {
      source: "/workflow-kit",
      destination: "/docs/reference/workflow-kit",
      permanent: false,
    },
    {
      source: "/discord",
      destination: "https://discord.gg/mPfcyDEdpx",
      permanent: true,
    },
    {
      source: "/mailing-list",
      destination: "http://eepurl.com/hI3dCr",
      permanent: true,
    },
    {
      source: "/2026-durable-execution-report",
      destination: "/content/ai-in-production-report-2026",
      permanent: true,
    },
    {
      source: "/2026-durable-execution-report/:path*",
      destination: "/content/ai-in-production-report-2026/:path*",
      permanent: true,
    },
    {
      // From the UI's source editing page:
      source: "/docs/event-webhooks",
      destination: "/docs/events/webhooks",
      permanent: true,
    },
    {
      source: "/features/sdk",
      destination: "/docs/sdk/overview",
      permanent: true,
    },
    {
      source: "/features/step-functions",
      destination: "/docs/learn/inngest-steps",
      permanent: true,
    },

    ...permanentRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    })),
    // Patterns moved under /docs/patterns/<category>/<slug>. Keep these after
    // permanentRedirects so the specific /patterns/* → /docs/guides/* entries
    // above still win.
    {
      source: "/patterns",
      destination: "/docs/patterns",
      permanent: true,
    },
    {
      source: "/patterns/md",
      destination: "/docs/patterns/md",
      permanent: true,
    },
    // Old flat pattern URLs (/patterns/<slug> and the interim
    // /docs/patterns/<slug>) → the new category-scoped URLs.
    ...Object.entries(PATTERN_SLUG_TO_CATEGORY).flatMap(([slug, category]) => [
      {
        source: `/patterns/${slug}`,
        destination: `/docs/patterns/${category}/${slug}`,
        permanent: true,
      },
      {
        source: `/docs/patterns/${slug}`,
        destination: `/docs/patterns/${category}/${slug}`,
        permanent: true,
      },
    ]),
    {
      source: "/library/:path*",
      destination: "/docs/patterns",
      permanent: true,
    },
    // Conditionally include /sign-up redirect — only valid when the
    // signup URL env var is set on this environment. Otherwise Vercel
    // preview builds fail with "destination is missing".
    ...(process.env.NEXT_PUBLIC_SIGNUP_URL
      ? [
          {
            source: "/sign-up",
            destination: process.env.NEXT_PUBLIC_SIGNUP_URL,
            permanent: true,
          },
        ]
      : []),
    // OOH campaign - SF car wrap (AI Engineer World's Fair 2026)
    {
      source: "/sf",
      destination:
        "/?utm_medium=ooh&utm_source=car-wrap-sf&utm_campaign=aiewf-2026",
      permanent: false,
    },
    // OOH campaign - AI conference signage (Sept 2026)
    {
      source: "/ai-conf",
      destination:
        "/?utm_medium=ooh&utm_source=signage&utm_campaign=ai-conf-0926",
      permanent: false,
    },
  ];
}

const withMDX = createMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
});

// Necessary for hot reloading after snippet changes. Watches for snippet
// changes and invalidates the cache for all files that reference the snippet
try {
  fs.watch("./snippets", { recursive: true }, (eventType, filename) => {
    if (filename && eventType === "change") {
      // Skip non-snippet files (documentation, config, etc.)
      if (filename.endsWith(".md")) {
        return;
      }
      filename = `./snippets/${filename}`;
      // const fullPath = path.join(process.cwd(), filename).replace(/\\/g, '/');
      const relativePath = path.relative(".", filename).replace(/\\/g, "/");
      console.log(`File changed: ${relativePath}`);
      console.log(
        `Looking for files containing: !snippet:path=${relativePath}`
      );
      touchFilesWithString(`!snippet:path=${relativePath}`);
    }
  });
  console.log("File watcher ready");
} catch (error) {
  console.error("File watcher error:", error);
}

// Recursively find all files in the current directory that contain the given
// string, and then touch them to invalidate the cache
function touchFilesWithString(str, { dir = "./pages", ext = "mdx" } = {}) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      touchFilesWithString(str, { dir: filePath, ext });
    } else {
      if (
        fs.readFileSync(filePath, "utf-8").includes(str) &&
        filePath.endsWith(ext)
      ) {
        const now = new Date();
        fs.utimesSync(filePath, now, now);
      }
    }
  }
}

/** @type {import('next').NextConfig} */
// Single source of truth for the stable TypeScript SDK version.
// Exposed to client code via NEXT_PUBLIC_TS_STABLE (see LanguageStore.ts).
const TS_STABLE_VERSION = "v4";

async function rewrites() {
  return {
    // beforeFiles run before page/filesystem matching, so these intercept the
    // raw-markdown URLs before the dynamic /docs/patterns/[category]/[slug]
    // pages would 404 on them. Segment counts don't collide: index (3) /
    // category (4) / pattern (5).
    beforeFiles: [
      {
        source: "/docs/patterns/md",
        destination: "/api/patterns/md",
      },
      {
        source: "/docs/patterns/:category/md",
        destination: "/api/patterns/category/:category/md",
      },
      {
        source: "/docs/patterns/:category/:slug/md",
        destination: "/api/patterns/:slug/md",
      },
    ],
    afterFiles: [
      // Versionless subpaths (excludes /v3/ and /v4/ prefixed paths)
      {
        source: "/docs/reference/typescript/:path((?!v3|v4).+)",
        destination: `/docs/reference/typescript/${TS_STABLE_VERSION}/:path`,
      },
      {
        source: "/docs-markdown/reference/typescript/:path((?!v3|v4).+)",
        destination: `/docs-markdown/reference/typescript/${TS_STABLE_VERSION}/:path`,
      },
    ],
  };
}

const nextConfig = {
  env: {
    NEXT_PUBLIC_TS_STABLE: TS_STABLE_VERSION,
  },
  redirects,
  rewrites,
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  // next-mdx-remote ships a pre-bundled CJS build that, in the App Router
  // (e.g. /blog/[slug]), resolves its own React copy and throws
  // "Invalid hook call / more than one copy of React" when MDXRemote runs.
  // Transpiling it makes Next bundle it against the app's single React.
  transpilePackages: ["next-mdx-remote"],
  experimental: {
    scrollRestoration: true,
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "resend.com",
      },
      {
        protocol: "https",
        hostname: "cdn.inngest.com",
      },
    ],
    // Next.js 16 requires explicit localPatterns for all next/image local sources
    localPatterns: [
      {
        pathname: "/assets/**",
      },
    ],
  },
  outputFileTracingExcludes: {
    "*": ["./.git/*", "./public/**/*", "./.pnpm-store/*"],
  },
  webpack: (config, { dev, isServer }) => {
    // Exclude old-style _prefix directories from being rendered (ex. mdx pages)
    config.module.rules.push({
      test: /_\w+\/.+\.mdx?$/,
      use: "ignore-loader",
    });
    // Import plain .md files as raw strings (webpack asset/source equivalent)
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });
    // Disable cache for production builds to reduce bundle size on Vercel
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: "memory",
      });
    }

    return config;
  },
};

let config = withMDX(nextConfig);

// When Turbopack is active, @next/mdx registers mdx-js-loader with plugin functions
// as loader options. Turbopack requires serializable options, so functions fail.
// Override the rule with a custom loader that imports plugins internally.
if (process.env.TURBOPACK) {
  const turbopackLoaderPath = fileURLToPath(
    new URL("./mdx/turbopack-loader.cjs", import.meta.url)
  );
  const rawMdLoaderPath = fileURLToPath(
    new URL("./mdx/raw-md-loader.cjs", import.meta.url)
  );
  config = {
    ...config,
    turbopack: {
      ...config.turbopack,
      rules: {
        ...config.turbopack?.rules,
        // Override the @next/mdx rule with our plugin-bundling loader
        "{*,next-mdx-rule}": [
          {
            loaders: [{ loader: turbopackLoaderPath }],
            as: "*.tsx",
            condition: { path: /\.mdx$/ },
          },
        ],
        // Handle plain .md files as raw string imports
        "*.md": {
          loaders: [{ loader: rawMdLoaderPath }],
          as: "*.js",
        },
      },
    },
  };
}

export default config;

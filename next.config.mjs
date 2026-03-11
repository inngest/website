import createMDX from "@next/mdx";
import { remarkPlugins } from "./mdx/remark.mjs";
import { rehypePlugins } from "./mdx/rehype.mjs";
import { recmaPlugins } from "./mdx/recma.mjs";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";

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
  ["/docs/cli/steps/", "/docs/guides/multi-step-functions"],
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
  ["/uses/internal-tools", "/uses/workflow-engine"],
  ["/uses/user-journey-automation", "/blog/lifecycle-emails-with-resend"],

  // new IA
  ["/docs/security", "/docs/learn/security"],
  ["/docs/functions", "/docs/learn/inngest-functions"],
  ["/docs/functions/multi-step", "/docs/guides/multi-step-functions"],
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

  // TypeScript SDK versioned docs - landing page redirect
  ["/docs/reference/typescript/v4", "/docs/reference/typescript/v4/client/create"],
  // Legacy short paths - redirect to versionless TypeScript docs
  ["/docs/reference/client/create", "/docs/reference/typescript/client/create"],
  ["/docs/reference/events/send", "/docs/reference/typescript/events/send"],
  ["/docs/reference/functions/create", "/docs/reference/typescript/functions/create"],
  ["/docs/reference/functions/debounce", "/docs/reference/typescript/functions/debounce"],
  ["/docs/reference/functions/handling-failures", "/docs/reference/typescript/functions/handling-failures"],
  ["/docs/reference/functions/rate-limit", "/docs/reference/typescript/functions/rate-limit"],
  ["/docs/reference/functions/run-priority", "/docs/reference/typescript/functions/run-priority"],
  ["/docs/reference/functions/singleton", "/docs/reference/typescript/functions/singleton"],
  ["/docs/reference/functions/step-invoke", "/docs/reference/typescript/functions/step-invoke"],
  ["/docs/reference/functions/step-run", "/docs/reference/typescript/functions/step-run"],
  ["/docs/reference/functions/step-send-event", "/docs/reference/typescript/functions/step-send-event"],
  ["/docs/reference/functions/step-sleep-until", "/docs/reference/typescript/functions/step-sleep-until"],
  ["/docs/reference/functions/step-sleep", "/docs/reference/typescript/functions/step-sleep"],
  ["/docs/reference/functions/step-wait-for-event", "/docs/reference/typescript/functions/step-wait-for-event"],
  ["/docs/reference/functions/step-wait-for-signal", "/docs/reference/typescript/functions/step-wait-for-signal"],
  ["/docs/reference/serve", "/docs/reference/typescript/serve"],
  ["/docs/reference/testing", "/docs/reference/typescript/testing"],
  ["/docs/reference/middleware/lifecycle", "/docs/reference/typescript/middleware/lifecycle"],
  ["/docs/reference/middleware/examples", "/docs/reference/typescript/middleware/examples"],
  ["/docs/reference/typescript/migrations/v3-to-v4", "/docs/reference/typescript/v4/migrations/v3-to-v4"],
  ["/docs/sdk/migration", "/docs/reference/typescript/v3/migrations/v2-to-v3"],
];

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
      destination: "/docs/guides/multi-step-functions",
      permanent: true,
    },

    // Reference intros
    { source: "/docs/reference/typescript", destination: "/docs/reference/typescript/intro", permanent: false },
    { source: "/docs/reference/typescript/v4", destination: "/docs/reference/typescript/v4/intro", permanent: false },
    { source: "/docs/reference/typescript/v3", destination: "/docs/reference/typescript/v3/intro", permanent: false },

    // Legacy short paths - redirect to versionless TypeScript docs
    { source: "/docs/reference/client/create", destination: "/docs/reference/typescript/client/create", permanent: false },
    { source: "/docs/reference/events/send", destination: "/docs/reference/typescript/events/send", permanent: false },
    { source: "/docs/reference/functions/create", destination: "/docs/reference/typescript/functions/create", permanent: false },
    { source: "/docs/reference/functions/debounce", destination: "/docs/reference/typescript/functions/debounce", permanent: false },
    { source: "/docs/reference/functions/handling-failures", destination: "/docs/reference/typescript/functions/handling-failures", permanent: false },
    { source: "/docs/reference/functions/rate-limit", destination: "/docs/reference/typescript/functions/rate-limit", permanent: false },
    { source: "/docs/reference/functions/run-priority", destination: "/docs/reference/typescript/functions/run-priority", permanent: false },
    { source: "/docs/reference/functions/singleton", destination: "/docs/reference/typescript/functions/singleton", permanent: false },
    { source: "/docs/reference/functions/step-invoke", destination: "/docs/reference/typescript/functions/step-invoke", permanent: false },
    { source: "/docs/reference/functions/step-run", destination: "/docs/reference/typescript/functions/step-run", permanent: false },
    { source: "/docs/reference/functions/step-send-event", destination: "/docs/reference/typescript/functions/step-send-event", permanent: false },
    { source: "/docs/reference/functions/step-sleep-until", destination: "/docs/reference/typescript/functions/step-sleep-until", permanent: false },
    { source: "/docs/reference/functions/step-sleep", destination: "/docs/reference/typescript/functions/step-sleep", permanent: false },
    { source: "/docs/reference/functions/step-wait-for-event", destination: "/docs/reference/typescript/functions/step-wait-for-event", permanent: false },
    { source: "/docs/reference/functions/step-wait-for-signal", destination: "/docs/reference/typescript/functions/step-wait-for-signal", permanent: false },
    { source: "/docs/reference/serve", destination: "/docs/reference/typescript/serve", permanent: false },
    { source: "/docs/reference/testing", destination: "/docs/reference/typescript/testing", permanent: false },
    { source: "/docs/reference/middleware/lifecycle", destination: "/docs/reference/typescript/middleware/lifecycle", permanent: false },
    { source: "/docs/reference/middleware/examples", destination: "/docs/reference/typescript/middleware/examples", permanent: false },
    { source: "/docs/reference/typescript/migrations/v3-to-v4", destination: "/docs/reference/typescript/v4/migrations/v3-to-v4", permanent: false },
    { source: "/docs/sdk/migration", destination: "/docs/reference/typescript/v3/migrations/v2-to-v3", permanent: false },
    ...permanentRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    })),
    {
      source: "/library/:path*",
      destination: "/patterns",
      permanent: true,
    },
    {
      source: "/sign-up",
      destination: process.env.NEXT_PUBLIC_SIGNUP_URL,
      permanent: true,
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
  fs.watch('./snippets', { recursive: true }, (eventType, filename) => {
    if (filename && eventType === 'change') {
      // Skip non-snippet files (documentation, config, etc.)
      if (filename.endsWith('.md')) {
        return;
      }
      filename = `./snippets/${filename}`;
      // const fullPath = path.join(process.cwd(), filename).replace(/\\/g, '/');
      const relativePath = path.relative('.', filename).replace(/\\/g, '/');
      console.log(`File changed: ${relativePath}`);
      console.log(`Looking for files containing: !snippet:path=${relativePath}`);
      touchFilesWithString(`!snippet:path=${relativePath}`);
    }
  });
  console.log('File watcher ready');
} catch (error) {
  console.error('File watcher error:', error);
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
const TS_STABLE_VERSION = "v3";

async function rewrites() {
  return [
    // Versionless subpaths (excludes /v3/ and /v4/ prefixed paths)
    {
      source: "/docs/reference/typescript/:path((?!v3|v4).+)",
      destination: `/docs/reference/typescript/${TS_STABLE_VERSION}/:path`,
    },
  ];
}

const nextConfig = {
  env: {
    NEXT_PUBLIC_TS_STABLE: TS_STABLE_VERSION,
  },
  redirects,
  rewrites,
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  experimental: {
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "resend.com",
      },
    ],
  },
  outputFileTracingExcludes: {
    "*": ["./.git/*", "./public/**/*", "./.pnpm-store/*", "./.next/*"],
  },
  webpack: (config, { dev, isServer }) => {
    // Exclude old-style _prefix directories from being rendered (ex. mdx pages)
    config.module.rules.push({
      test: /_\w+\/.+\.mdx?$/,
      use: "ignore-loader",
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

export default withMDX(nextConfig);

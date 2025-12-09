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

  // New IA restructure redirects
  ["/docs/deploy/improve-performance", "/docs/improve-performance"],
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
const nextConfig = {
  redirects,
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
    "*": ["./.git/*", "./public/**/*", "./.pnpm-store/*"],
    "!(/api)": ["./.next/*"],
  },
  outputFileTracingIncludes: {
    "/api/*": ["./next/**/*"],
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

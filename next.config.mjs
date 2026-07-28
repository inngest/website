import createMDX from "@next/mdx";
import { remarkPlugins } from "./mdx/remark.mjs";
import { rehypePlugins } from "./mdx/rehype.mjs";
import { recmaPlugins } from "./mdx/recma.mjs";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { permanentRedirects, TS_STABLE_VERSION } from "./redirects.mjs";

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
      // NOTE: no /docs-markdown equivalent here on purpose. Rewrites run after
      // redirects, so a rewrite would pin a moved path to a version directory
      // before the redirect table could be consulted — e.g.
      // /docs-markdown/reference/typescript/functions/errors became
      // .../typescript/v4/functions/errors, which has no file, instead of
      // /docs/features/inngest-functions/error-retries/inngest-errors.
      // The markdown route applies both rules itself, in the right order,
      // via resolveDocsPath() in redirects.mjs.
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
    // CDN images (cdn.inngest.com) ship no Cache-Control header, so the
    // optimizer would fall back to the 1h default and re-transform hourly.
    // Blog images are immutable per path, so hold transforms for 31 days.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "resend.com",
      },
      {
        protocol: "https",
        hostname: "cdn.inngest.com",
        pathname: "/blog/**",
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

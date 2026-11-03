const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");
const { lastmodFor } = require("./next-sitemap.lastmod.js");

// unreleased pages and blog posts with noindex stay out of the sitemap.
// their robots metadata conflicts with a sitemap entry. So do posts
// republished from a partner's site: their canonical_url names the
// partner's original, and a sitemap entry would claim the copy instead.
function sourceIsExcludedFromSitemap(filePath) {
  try {
    const src = fs.readFileSync(filePath, "utf8");
    const data = matter(src).data;
    if (data.unreleased || data.noindex) return true;
    if (
      typeof data.canonical_url === "string" &&
      !/^https:\/\/www\.inngest\.com(\/|$)/.test(data.canonical_url)
    ) {
      return true;
    }
    return /export\s+const\s+unreleased\s*=/.test(src);
  } catch {
    return false;
  }
}

// map a sitemap URL to the content file that controls its robots metadata.
function contentSourceFor(urlPath) {
  const p = urlPath.replace(/\/+$/, "");
  const candidates = [];
  if (p.startsWith("/blog/")) {
    const slug = p.slice("/blog/".length);
    candidates.push(`content/blog/${slug}.mdx`, `content/blog/${slug}.md`);
  } else if (p.startsWith("/changelog/")) {
    const slug = p.slice("/changelog/".length);
    candidates.push(`content/changelog/${slug}.mdx`);
  } else if (p.startsWith("/docs/")) {
    const sub = p.slice("/docs/".length);
    candidates.push(`pages/docs/${sub}.mdx`, `pages/docs/${sub}/index.mdx`);
  }
  for (const rel of candidates) {
    const abs = path.join(process.cwd(), rel);
    if (fs.existsSync(abs)) return abs;
  }
  return null;
}

// Every permanent redirect source is excluded from the sitemap, so old docs
// pages that still have files on disk don't get listed next to their new pages.
let redirectSources;
async function getRedirectSources() {
  if (!redirectSources) {
    const { permanentRedirects } = await import("./redirects.mjs");
    redirectSources = new Set(
      permanentRedirects.map(([source]) => source.replace(/\/$/, ""))
    );
  }
  return redirectSources;
}

// The stable TypeScript reference is listed at its versionless canonical URL
// (utils/docsCanonical.mjs), not the /<stable>/ file path next-sitemap finds.
let toCanonical;
async function getCanonicalizer() {
  if (!toCanonical) {
    const [{ canonicalDocsPath }, { TS_STABLE_VERSION }] = await Promise.all([
      import("./utils/docsCanonical.mjs"),
      import("./redirects.mjs"),
    ]);
    toCanonical = (urlPath) => canonicalDocsPath(urlPath, TS_STABLE_VERSION);
  }
  return toCanonical;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.inngest.com",
  // remove content with unreleased or noindex metadata from the sitemap.  the
  // static exclude list covers routes whose metadata lives in code.
  transform: async (config, urlPath) => {
    if ((await getRedirectSources()).has(urlPath)) return null;
    const src = contentSourceFor(urlPath);
    if (src && sourceIsExcludedFromSitemap(src)) return null;
    return {
      loc: (await getCanonicalizer())(urlPath),
      changefreq: config.changefreq,
      priority: config.priority,
      // Real dates only, never the build time; see next-sitemap.lastmod.js.
      lastmod: lastmodFor(urlPath),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  exclude: [
    "*/_*",
    "*/landing/*",
    "/blog-markdown",
    "/blog-markdown/*",
    "/docs-markdown",
    "/docs-markdown/*",
    // Plain-text and markdown files for AI crawlers. Found via llms.txt and
    // robots.txt, not the sitemap, which lists HTML pages only.
    "/blog.txt",
    "/llm-context.md",
    "/llms.txt",
    "/llms-full.txt",
    "/api/*",
    "*/download-gate-form*",
    // Pages that have been redirected — keep these out of the sitemap.
    // The 301 redirects are defined in next.config.mjs (permanentRedirects).
    // next-sitemap finds the underlying page files and would include these URLs
    // without this exclusion list.
    "/uses/durable-workflows",
    "/uses/workflow-engine",
    "/uses/serverless-cron-jobs",
    "/compare-to-legacy-queues",
    "/durable-endpoints",
    "/platform",
    "/careers",
    "/launch-week",
    "/launch-week/*",
    "/ai-personalized-documentation",
    "/product/how-inngest-works",
    // Docs pages copied to new paths (old files remain, redirected in redirects.mjs)
    "/docs/guides/writing-expressions",
    "/docs/ai-patterns/agent-tool-loops",
    "/docs/ai-patterns/human-in-the-loop",
    "/docs/ai-patterns/sub-agent-delegation",
    "/docs/features/events-triggers/neon",
    "/docs/platform/monitor/datadog-integration",
    "/docs/platform/monitor/prometheus-metrics-export-integration",
    "/docs/learn/agent-evals",
    "/docs/learn/durable-agents",
    "/docs/features/inngest-functions/steps-workflows/scoring",
    "/docs/features/inngest-functions/steps-workflows/deferred-scoring",
    "/docs/features/inngest-functions/steps-workflows/step-experiments",
    "/docs/features/events-triggers/sessions",
    "/docs/examples/ai-eval-scorer-quickstart",
    // Pages with noindex set in code — sitemap + noindex is contradictory.
    "/content/ai-in-production-report-2026",
    "/content/ai-in-production-report-2026/*",
    // YC deal page — shared directly, noindex in its own metadata.
    "/yc",
    "/resources/access/*",
  ],
};

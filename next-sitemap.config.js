const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

// unreleased pages and blog posts with noindex stay out of the sitemap.
// their robots metadata conflicts with a sitemap entry.
function sourceIsExcludedFromSitemap(filePath) {
  try {
    const src = fs.readFileSync(filePath, "utf8");
    const data = matter(src).data;
    if (data.unreleased || data.noindex) return true;
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

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.inngest.com",
  // remove content with unreleased or noindex metadata from the sitemap.  the
  // static exclude list covers routes whose metadata lives in code.
  transform: async (config, urlPath) => {
    const src = contentSourceFor(urlPath);
    if (src && sourceIsExcludedFromSitemap(src)) return null;
    return {
      loc: urlPath,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  exclude: [
    "*/_*",
    "*/landing/*",
    "/blog-markdown/*",
    "/docs-markdown/*",
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
    // Pages with noindex set in code — sitemap + noindex is contradictory.
    "/content/ai-in-production-report-2026",
    "/content/ai-in-production-report-2026/*",
    // "Build for the long run" campaign pages — gated behind
    // ?unreleased=long-run and noindex until the campaign launches.
    // Remove these two lines (and the robots block in the page files) to
    // ship the campaign.
    "/long-run",
    "/long-run/*",
    "/resources/access/*",
  ],
};

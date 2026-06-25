const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

// A page is "gated" (behind ?unreleased=<label>) if its source declares an
// `unreleased` label — YAML frontmatter for blog posts, an `export const
// unreleased` for docs/changelog MDX. Gated pages send noindex, so they must
// stay out of the sitemap (sitemap + noindex is contradictory).
function sourceIsGated(filePath) {
  try {
    const src = fs.readFileSync(filePath, "utf8");
    if (matter(src).data.unreleased) return true;
    return /export\s+const\s+unreleased\s*=/.test(src);
  } catch {
    return false;
  }
}

// Map a sitemap URL back to the content file that backs it, for the three
// surfaces that support gating. Returns null for everything else.
function gatedSourceFor(urlPath) {
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
  // Drop pages gated behind ?unreleased=<label> — they're noindex, so the
  // sitemap must not list them. Complements the static `exclude` list below.
  transform: async (config, urlPath) => {
    const src = gatedSourceFor(urlPath);
    if (src && sourceIsGated(src)) return null;
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
    "/resources/access/*",
  ],
};

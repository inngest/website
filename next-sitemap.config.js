/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.inngest.com",
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

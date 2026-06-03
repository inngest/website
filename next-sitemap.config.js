/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.inngest.com",
  generateRobotsTxt: true,
  exclude: [
    // Don't index the _underscore prefix directories
    "*/_*",
    // Skip landing page from indexing
    "*/landing/*",
  ],
  robotsTxtOptions: {
    policies: [
      // Standard crawlers: allow everything except parameterized URLs that
      // cause duplicate-content issues in Google Search Console.
      // ?ref= and ?redirect_url= each produce unique URLs per user journey;
      // canonical tags handle deduplication in HTML, but blocking crawl here
      // prevents new duplicates from being indexed in the first place.
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*?ref=",
          "/*?*&ref=",
          "/*?redirect_url=",
          "/*?*&redirect_url=",
        ],
      },
      // AI crawlers: welcome to index content areas only
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
          "Amazonbot",
          "CCBot",
        ],
        allow: ["/docs/", "/blog/", "/patterns/", "/llms.txt", "/llms-full.txt", "/docs-markdown/"],
        disallow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "Bytespider",
        disallow: ["/"],
      },
    ],
    additionalSitemaps: [],
  },
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.inngest.com",
  exclude: [
    // Don't index the _underscore prefix directories
    "*/_*",
    // Skip landing page from indexing
    "*/landing/*",
    // Markdown alternates for AI agents — canonical points to the HTML pages,
    // so listing them in the sitemap would create duplicate-content noise
    "/blog-markdown/*",
    "/docs-markdown/*",
    // API routes are not pages
    "/api/*",
  ],
  // NOTE - robots.txt is a static file defined in @public/robots.txt
};

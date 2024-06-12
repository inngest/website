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
};

import { URL } from "node:url";
import blc from "broken-link-checker";

const SITE_URL = process.argv.pop();

const options = {
  honorRobotExclusions: false,
  excludedKeywords: [
    `${SITE_URL}/test/`,
    // Internal "Edit" links on Docs pages
    "https://github.com/inngest/website/tree",
    "https://www.iubenda.com",
    "https://stripe.com/docs/api",
    "https://docs.stripe.com",
    "https://docs.github.com",
    "https://docs.retool.com",
    "https://youtu.be",
    "https://svelte.dev",
    "https://deno.land",
    "https://the-guild.dev/graphql/yoga-server",
    "https://envelop.dev",
    "https://twitter.com",
    "https://postmarkapp.com",
    "https://api-docs.inngest.com/docs/inngest-api",
    "http://localhost:8288",
    "http://localhost:",
    "https://www.uber.com",
    "https://www.tripadvisor.com",
    "https://linkedin.com",
    "http://web.archive.org",
    "https://platform.openai.com",
    "https://t.co",
    "https://sentry.io",
    "https://x.com",
    "https://devjobs.at/",
    "https://nextjs.org/",
    "https://open.spotify.com/",
    "https://www.linkedin.com/",
    "https://openai.com/",
    "https://bsky.app/profile/inngest.com",
    "https://v0.dev",
    "https://innge.st",
    "https://roadmap.inngest.com",
    "https://docs.anthropic.com",
    "https://redwoodjs.com",
    "https://app.datadoghq.com",
    "https://www.notion.so/blog",
    "http://localhost",
    "https://github.com/zerodevx",
  ],
};

const brokenReasonsToIgnore = ["HTTP_308"];

const seen = [];
const uniqueURLs = {};

function hasBeenSeen({ pathname, link, text }): boolean {
  return !!seen.find(function (l) {
    return l.pathname === pathname && l.link === link && l.text === text;
  });
}

let pagesChecked = 0;
let brokenLinks = 0;
let linksChecked = 0;

function logBrokenLink(result) {
  const page = new URL(result.base.resolved);
  const pathname = page.pathname;
  const link = result.url.original;
  const text = result.html.text;
  if (hasBeenSeen({ pathname, link, text })) {
    return;
  }
  brokenLinks++;
  seen.push({
    pathname,
    link,
    text,
  });
  uniqueURLs[link] = uniqueURLs.hasOwnProperty(link) ? uniqueURLs[link] + 1 : 1;
  console.log(`BROKEN LINK on ${pathname}: ${result.brokenReason}
  href=${link}
  text=${text}`);
}

const siteChecker = new blc.SiteChecker(options, {
  error: function (error) {
    console.log("ERROR: ", error);
  },
  robots: function (robots, customData) {},
  html: function (tree, robots, response, pageUrl, customData) {},
  // junk: function (result, customData) {},
  link: function (result, customData) {
    linksChecked++;
    if (result.broken && !brokenReasonsToIgnore.includes(result.brokenReason)) {
      logBrokenLink(result);
    }
  },
  page: function (error, pageUrl, customData) {
    pagesChecked++;
  },
  // site: function (error, siteUrl, customData) {},
  end: function () {
    console.log(
      `\nFound ${brokenLinks} broken links out of ${linksChecked} total links across ${pagesChecked} pages\n`
    );
    console.log(
      Object.keys(uniqueURLs)
        .map((u) => ` - ${u} (${uniqueURLs[u]})`)
        .join(`\n`)
    );
    if (brokenLinks > 0) {
      process.exit(1);
    }
  },
});

console.log(`Checking broken links for: ${SITE_URL}\n\n`);

siteChecker.enqueue(SITE_URL, {});

import nextMDX from "@next/mdx";
import { remarkPlugins } from "./mdx/remark.mjs";
import { rehypePlugins } from "./mdx/rehype.mjs";
import { recmaPlugins } from "./mdx/recma.mjs";

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
    "/docs/getting-started/quick-start/python",
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
];

async function redirects() {
  return [
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

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects,
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  experimental: {
    scrollRestoration: true,
    appDir: true,
  },
};

export default withMDX(nextConfig);

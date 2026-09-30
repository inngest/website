/**
 * Single source of truth for permanent redirects and docs path resolution.
 *
 * Consumed by:
 *   - next.config.mjs            → emits these as 308 redirects for the HTML site
 *   - app/(llms)/docs-markdown/  → resolves them in-process, so the markdown
 *                                  mirror serves moved docs instead of 404ing
 *
 * The markdown mirror cannot rely on the 308s: it resolves slugs straight off
 * the `pages/docs` filesystem, and many agents fetching markdown do not follow
 * redirects. `resolveDocsPath` gives it the same destination the browser would
 * land on, in one hop.
 */

// Single source of truth for the stable TypeScript SDK version.
// Exposed to client code via NEXT_PUBLIC_TS_STABLE (see LanguageStore.ts).
export const TS_STABLE_VERSION = "v4";

// All permanent redirects (source -> destination)
export const permanentRedirects = [
  // Overview pages merged into their parent section pages
  [
    "/docs/durable-execution/guides-and-advanced/error-handling/overview",
    "/docs/durable-execution/guides-and-advanced/error-handling",
  ],
  [
    "/docs/durable-execution/guides-and-advanced/middleware/overview",
    "/docs/durable-execution/guides-and-advanced/middleware",
  ],
  // Pages copied into the docs refresh structure
  [
    "/docs/deploy/vercel",
    "/docs/durable-execution/deploying-functions/platforms/vercel",
  ],
  [
    "/docs/deploy/netlify",
    "/docs/durable-execution/deploying-functions/platforms/netlify",
  ],
  [
    "/docs/deploy/cloudflare",
    "/docs/durable-execution/deploying-functions/platforms/cloudflare",
  ],
  [
    "/docs/deploy/render",
    "/docs/durable-execution/deploying-functions/platforms/render",
  ],
  [
    "/docs/deploy/digital-ocean",
    "/docs/durable-execution/deploying-functions/platforms/digital-ocean",
  ],
  [
    "/docs/usage-limits/providers",
    "/docs/durable-execution/deploying-functions/platforms/provider-limits",
  ],
  [
    "/docs/learn/durable-endpoints/streaming",
    "/docs/durable-execution/durable-endpoints/streaming",
  ],
  [
    "/docs/features/inngest-functions/steps-workflows/step-metadata-how-to",
    "/docs/durable-execution/primitives/metadata",
  ],
  [
    "/docs/guides/writing-expressions",
    "/docs/durable-execution/guides-and-advanced/writing-expressions",
  ],
  [
    "/docs/ai-patterns/agent-tool-loops",
    "/docs/durable-execution/guides-and-advanced/patterns/agent-tool-loops",
  ],
  [
    "/docs/ai-patterns/human-in-the-loop",
    "/docs/durable-execution/guides-and-advanced/patterns/human-in-the-loop",
  ],
  [
    "/docs/ai-patterns/sub-agent-delegation",
    "/docs/durable-execution/guides-and-advanced/patterns/sub-agent-delegation",
  ],
  [
    "/docs/features/events-triggers/neon",
    "/docs/platform-and-operations/integrations/neon",
  ],
  [
    "/docs/platform/monitor/datadog-integration",
    "/docs/platform-and-operations/integrations/datadog",
  ],
  [
    "/docs/platform/monitor/prometheus-metrics-export-integration",
    "/docs/platform-and-operations/integrations/prometheus",
  ],
  [
    "/docs/getting-started/nodejs-quick-start",
    "/docs/durable-execution/quick-start/typescript-quick-start",
  ],
  // Legacy docs
  ["/docs/functions/testing-functions", "/docs/local-development"],
  ["/docs/what-is-inngest", "/docs"],
  ["/docs/reference/functions/retries", "/docs/functions/retries"],
  ["/docs/creating-an-event-key", "/docs/events/creating-an-event-key"],
  ["/docs/event-format-and-structure", "/docs/reference/events/send"],
  ["/docs/events/event-format-and-structure", "/docs/reference/events/send"],
  ["/docs/writing-and-running-fuctions", "/docs/functions"], //typo
  ["/docs/cli/steps/", "/docs/learn/inngest-steps"],
  ["/docs/events/sources/sdks", "/docs/events"],
  ["/docs/deploying-fuctions", "/docs/apps/cloud"],
  ["/docs/deploy", "/docs/durable-execution/deploying-functions/platforms"],
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
    "/docs/getting-started/python-quick-start",
  ],
  ["/docs/sdk/overview", "/docs/sdks"],
  ["/docs/sdk/overview/reference", "/docs/sdks#sdk-references"],
  ["/docs/sdks/reference", "/docs/sdks#sdk-references"],
  ["/docs/dev-server", "/docs/local-development"],
  ["/docs/guides/development-with-docker", "/docs/local-development"],

  // Other pages
  ["/uses/zero-infra-llm-ai", "/ai"],
  // Was -> /uses/workflow-engine, which now redirects to /uses/webhooks.
  // Point straight at the final destination to avoid a redirect chain.
  ["/uses/internal-tools", "/uses/webhooks"],
  ["/uses/user-journey-automation", "/blog/lifecycle-emails-with-resend"],

  // new IA
  ["/docs/security", "/docs/learn/security"],
  ["/docs/functions", "/docs/learn/inngest-functions"],
  ["/docs/functions/multi-step", "/docs/learn/inngest-steps"],
  ["/docs/guides/multi-step-functions", "/docs/learn/inngest-steps"],
  [
    "/docs/features/inngest-functions/steps-workflows/fetch",
    "/docs/reference/typescript/functions/fetch",
  ],
  ["/docs/guides/enqueueing-future-jobs", "/docs/guides/delayed-functions"],
  ["/docs/steps", "/docs/learn/inngest-steps"],
  ["/docs/features/inngest-functions", "/docs/learn/inngest-functions"],
  [
    "/docs/features/inngest-functions/steps-workflows",
    "/docs/learn/inngest-functions",
  ],
  ["/blog/banger", "/blog/banger-video-rendering-pipeline"],
  [
    "/docs/reference/serve#custom-frameworks",
    "/docs/learn/serving-inngest-functions#custom-frameworks",
  ],
  ["/docs/sdk/serve", "/docs/learn/serving-inngest-functions"],
  [
    "/docs/getting-started/quick-start/python",
    "/docs/getting-started/python-quick-start",
  ],
  ["/docs/quick-start", "/docs/getting-started/nextjs-quick-start"],
  [
    "/docs/reference/typescript/functions/errors",
    "/docs/features/inngest-functions/error-retries/inngest-errors",
  ],
  ["/docs/reference/middleware/overview", "/docs/features/middleware"],
  [
    "/docs/reference/middleware/create",
    "/docs/features/middleware/create?guide=typescript",
  ],
  [
    "/docs/reference/middleware/typescript",
    "/docs/features/middleware/dependency-injection?guide=typescript",
  ],
  [
    "/docs/reference/python/middleware/encryption",
    "/docs/features/middleware/encryption-middleware?guide=python",
  ],
  ["/blog/nextjs-openai-o1", "/blog/agentic-workflow-example"],

  ["/docs/agent-kit/:any*", "https://agentkit.inngest.com"],

  // Realtime moved to /docs/realtime
  ["/docs/features/realtime", "/docs/realtime"],
  ["/docs/features/realtime/nextjs", "/docs/realtime/guides/react-hooks"],
  [
    "/docs/features/realtime/react-hooks",
    "/docs/realtime/guides/react-hooks",
  ],
  [
    "/docs/features/realtime/subscription-tokens",
    "/docs/realtime/guides/subscription-tokens",
  ],
  [
    "/docs/features/realtime/stream-ai-responses",
    "/docs/realtime/guides/stream-ai-responses",
  ],
  [
    "/docs/features/realtime/subscribe",
    "/docs/realtime/guides/server-side-subscriptions",
  ],

  // Agent Evals moved to /docs/agent-evals
  ["/docs/learn/agent-evals", "/docs/agent-evals/overview"],
  // Pre-launch name of the section; shared in drafts and Notion.
  ["/docs/online-evals", "/docs/agent-evals"],
  ["/docs/online-evals/:any*", "/docs/agent-evals/:any*"],
  [
    "/docs/features/inngest-functions/steps-workflows/scoring",
    "/docs/agent-evals/scores",
  ],
  [
    "/docs/features/inngest-functions/steps-workflows/deferred-scoring",
    "/docs/agent-evals/deferred-scoring",
  ],
  [
    "/docs/features/inngest-functions/steps-workflows/step-experiments",
    "/docs/agent-evals/experiments",
  ],
  ["/docs/features/events-triggers/sessions", "/docs/agent-evals/sessions"],
  [
    "/docs/examples/ai-eval-scorer-quickstart",
    "/docs/agent-evals/guides/llm-judge",
  ],

  // Durable Endpoints rename
  ["/docs/learn/rest-endpoints", "/docs/learn/durable-endpoints"],

  // Metadata reference moved to /reference/typescript/functions/metadata
  [
    "/docs/features/inngest-functions/steps-workflows/metadata",
    "/docs/reference/typescript/functions/metadata",
  ],

  // TypeScript SDK versioned docs - landing page redirects (301 permanent)
  ["/docs/reference/typescript", "/docs/reference/typescript/intro"],
  ["/docs/reference/typescript/v4", "/docs/reference/typescript/v4/intro"],
  ["/docs/reference/typescript/v3", "/docs/reference/typescript/v3/intro"],
  // Legacy short paths - redirect directly to v4 TypeScript docs (collapsed from two-hop chain)
  [
    "/docs/reference/client/create",
    "/docs/reference/typescript/v4/client/create",
  ],
  ["/docs/reference/events/send", "/docs/reference/typescript/v4/events/send"],
  [
    "/docs/reference/functions/create",
    "/docs/reference/typescript/v4/functions/create",
  ],
  [
    "/docs/reference/functions/debounce",
    "/docs/reference/typescript/v4/functions/debounce",
  ],
  [
    "/docs/reference/functions/handling-failures",
    "/docs/reference/typescript/v4/functions/handling-failures",
  ],
  [
    "/docs/reference/functions/rate-limit",
    "/docs/reference/typescript/v4/functions/rate-limit",
  ],
  [
    "/docs/reference/functions/run-priority",
    "/docs/reference/typescript/v4/functions/run-priority",
  ],
  [
    "/docs/reference/functions/singleton",
    "/docs/reference/typescript/v4/functions/singleton",
  ],
  [
    "/docs/reference/functions/step-invoke",
    "/docs/reference/typescript/v4/functions/step-invoke",
  ],
  [
    "/docs/reference/functions/step-run",
    "/docs/reference/typescript/v4/functions/step-run",
  ],
  [
    "/docs/reference/functions/step-send-event",
    "/docs/reference/typescript/v4/functions/step-send-event",
  ],
  [
    "/docs/reference/functions/step-sleep-until",
    "/docs/reference/typescript/v4/functions/step-sleep-until",
  ],
  [
    "/docs/reference/functions/step-sleep",
    "/docs/reference/typescript/v4/functions/step-sleep",
  ],
  [
    "/docs/reference/functions/step-wait-for-event",
    "/docs/reference/typescript/v4/functions/step-wait-for-event",
  ],
  [
    "/docs/reference/functions/step-wait-for-signal",
    "/docs/reference/typescript/v4/functions/step-wait-for-signal",
  ],
  ["/docs/reference/serve", "/docs/reference/typescript/v4/serve"],
  ["/docs/reference/testing", "/docs/reference/typescript/v4/testing"],
  [
    "/docs/reference/middleware/lifecycle",
    "/docs/reference/typescript/v4/middleware/lifecycle",
  ],
  [
    "/docs/reference/middleware/examples",
    "/docs/reference/typescript/v4/middleware/examples",
  ],
  [
    "/docs/reference/typescript/migrations/v3-to-v4",
    "/docs/reference/typescript/v4/migrations/v3-to-v4",
  ],
  ["/docs/sdk/migration", "/docs/reference/typescript/v3/migrations/v2-to-v3"],
  [
    "/patterns/cancelling-scheduled-functions",
    "/docs/guides/cancel-running-functions",
  ],
  ["/patterns/running-code-on-a-schedule", "/docs/guides/scheduled-functions"],

  // run-experiments-in-production moved from the Durable Workflows category to
  // the new AI Evals category (per Lauren's IA feedback). Old category URL is
  // shared in Slack and linked from the experiments doc, so redirect it.
  [
    "/docs/patterns/durable/run-experiments-in-production",
    "/docs/patterns/ai-evals/run-experiments-in-production",
  ],

  // New IA: platform + use-case pages replacing legacy landing pages, plus
  // a few standalone LPs being retired.
  ["/uses/durable-workflows", "/platform/durable-execution"],
  ["/compare-to-legacy-queues", "/platform/flow-control"],
  ["/uses/serverless-cron-jobs", "/uses/scheduled-jobs"],
  ["/uses/workflow-engine", "/uses/webhooks"],
  ["/durable-endpoints", "/platform/durable-execution"],
  ["/platform", "/platform/durable-execution"],
  ["/ai-personalized-documentation", "/docs/ai-dev-tools/agent-skills"],
  ["/ai/early-access", "/ai"],
  ["/launch-week", "/"],
  ["/product/how-inngest-works", "/"],
  // The scheduled-jobs page moved under /uses; preserve the old URL.
  ["/scheduled-jobs", "/uses/scheduled-jobs"],
];

const redirectMap = new Map(permanentRedirects);

/** Splits "/docs/a?b#c" into ["/docs/a", "?b#c"]. */
function splitSuffix(pathname) {
  const at = pathname.search(/[?#]/);
  return at === -1
    ? [pathname, ""]
    : [pathname.slice(0, at), pathname.slice(at)];
}

/**
 * Follows the permanent-redirect chain for a pathname, mirroring what a browser
 * would do across successive 308s. Some entries chain (e.g. /docs/functions/retries
 * → /docs/reference/typescript/functions/errors → /docs/features/.../inngest-errors),
 * so this loops rather than doing a single lookup.
 *
 * A destination's own fragment wins; otherwise an inherited one is carried
 * forward, which is how browsers treat a fragment-less redirect target.
 *
 * @param {string} pathname absolute site path, e.g. "/docs/reference/serve"
 * @returns {string} the final destination, unchanged when nothing matches
 */
export function resolveRedirect(pathname, maxHops = 10) {
  let [base, suffix] = splitSuffix(pathname);
  const seen = new Set([base]);

  for (let hop = 0; hop < maxHops; hop++) {
    const next = redirectMap.get(base);
    if (!next) break;

    const [nextBase, nextSuffix] = splitSuffix(next);
    if (seen.has(nextBase)) break; // cycle guard
    seen.add(nextBase);

    base = nextBase;
    suffix = nextSuffix || suffix;
  }

  return base + suffix;
}

/** Splits a docs slug into its path and any "?query"/"#fragment" tail. */
export function splitDocsSuffix(slug) {
  return splitSuffix(slug);
}

/**
 * Resolves a docs slug (no leading slash, e.g. "reference/serve") to the slug
 * that actually has a file behind it, applying two rules in the same order the
 * HTML site does:
 *
 *   1. permanent redirects  — reference/serve → reference/typescript/v4/serve
 *   2. versionless TS paths — reference/typescript/foo → reference/typescript/v4/foo
 *      (the rewrite in next.config.mjs, applied here because rewrites run after
 *      redirects and would otherwise send moved paths to a version that has no
 *      such file)
 *
 * Any "?query"/"#fragment" is preserved, including one a redirect destination
 * introduces (/docs/frameworks/express → .../serving-inngest-functions#framework-express),
 * so callers rewriting links keep the deep link intact. Use splitDocsSuffix()
 * before touching the filesystem with the result.
 *
 * @param {string} slug docs-relative slug, no leading slash
 * @returns {string} the resolved slug, suffix included
 */
export function resolveDocsPath(slug) {
  const [inputBase, inputSuffix] = splitSuffix(slug);
  const resolved = resolveRedirect(`/docs/${inputBase}${inputSuffix}`);
  const [base, suffix] = splitSuffix(resolved);

  // Destinations outside /docs (marketing pages, external moves) have no
  // markdown mirror; hand the original slug back so the caller 404s on it.
  if (!base.startsWith("/docs/") && base !== "/docs") return slug;

  const docSlug = base.replace(/^\/docs\/?/, "");

  const versionless = docSlug.match(/^reference\/typescript\/(?!v\d)(.+)$/);
  const finalSlug = versionless
    ? `reference/typescript/${TS_STABLE_VERSION}/${versionless[1]}`
    : docSlug;

  return finalSlug + suffix;
}

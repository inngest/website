export const V1_ROUTES = new Set<string>([
  "/",
  "/ai",
  "/uses/scheduled-jobs",
  "/about",
  // Canonical IA for the platform / use-case pages.
  "/platform/durable-execution",
  "/platform/flow-control",
  "/platform/observability",
  "/uses/webhooks",
  "/pricing",
  "/compare-to-temporal",
  "/get-in-touch",
  "/uses/serverless-node-background-jobs",
  "/privacy",
  "/terms",
  "/security",
  "/changelog",
  "/customers",
  "/events",
  "/sales-inquiry-form",
  "/download-gate-form",
  // /blog index is v1-chromed when the flag is on (renders the Learn hub
  // via PageShell). Post detail pages come from the "/blog/" prefix below.
  "/blog",
]);

// Prefix-based v1 routes. Anything whose pathname starts with one of
// these strings (e.g. /blog/<slug>) is treated as a v1 route for nav /
// footer / wipe-transition behaviour without each slug needing to be
// listed in V1_ROUTES. Note "/blog/" (trailing slash) matches post
// detail pages but NOT the "/blog" index, which keeps legacy chrome.
export const V1_ROUTE_PREFIXES = [
  "/blog/",
  "/customers/",
  "/events/",
];

export const isV1Route = (pathname: string): boolean =>
  V1_ROUTES.has(pathname) ||
  V1_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export const isV1Enabled = (): boolean =>
  process.env.NEXT_PUBLIC_FEATURE_V1 === "true";

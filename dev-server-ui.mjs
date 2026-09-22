export function devServerUIRewrites(origin = process.env.DEV_SERVER_UI_ORIGIN) {
  if (!origin) return [];

  const url = new URL(origin);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "DEV_SERVER_UI_ORIGIN must be an HTTP(S) origin without a path or credentials"
    );
  }
  if (["www.inngest.com", "inngest.com"].includes(url.hostname)) {
    throw new Error(
      "DEV_SERVER_UI_ORIGIN must point to the separate UI deployment"
    );
  }

  return [
    { source: "/dev", destination: `${url.origin}/dev` },
    { source: "/dev/:path*", destination: `${url.origin}/dev/:path*` },
  ];
}

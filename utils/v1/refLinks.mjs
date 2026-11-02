// @ts-check
/**
 * Shared by `refLinkProps()` (utils/v1/ref.ts, used at every rendered link)
 * and the `rehypeRefLinks` MDX plugin (mdx/rehypeRefLinks.mjs), so React
 * components and MDX content apply the same rule. Plain JS so next.config.mjs
 * and the MDX loaders can import it.
 *
 * Rule: a same-origin link that carries `?ref=<placement>` loses the
 * parameter and gets `data-ref="<placement>"` instead (see
 * utils/v1/refHandoff.ts for how the value reaches analytics). Links that
 * leave www.inngest.com keep `?ref=`, and so do the sign-up and sign-in
 * short links, which redirect to app.inngest.com and pass attribution there.
 */

/** Paths that redirect to app.inngest.com and must keep `?ref=` in the URL. */
export const KEEP_URL_REF_PATHS = ["/sign-up", "/sign-in"];

const SITE_ORIGIN = /^https?:\/\/(?:www\.)?inngest\.com(?=[/?#]|$)/i;

/**
 * Split `ref` out of a same-origin URL.
 *
 * @param {unknown} url
 * @returns {{ href: string, ref: string } | null} null when the URL needs no
 *   change: not a string, no `ref` parameter, another origin, or a path in
 *   KEEP_URL_REF_PATHS.
 */
export function splitInternalRef(url) {
  if (typeof url !== "string" || !url.includes("ref=")) return null;

  // Same-origin only: root-relative paths ("/x", not protocol-relative
  // "//host") or absolute www/apex inngest.com URLs.
  const isRelative = url.startsWith("/") && !url.startsWith("//");
  if (!isRelative && !SITE_ORIGIN.test(url)) return null;

  const hashAt = url.indexOf("#");
  const hash = hashAt === -1 ? "" : url.slice(hashAt);
  const beforeHash = hashAt === -1 ? url : url.slice(0, hashAt);
  const queryAt = beforeHash.indexOf("?");
  if (queryAt === -1) return null;
  const base = beforeHash.slice(0, queryAt);
  const query = beforeHash.slice(queryAt + 1);

  const path = (isRelative ? base : base.replace(SITE_ORIGIN, "")) || "/";
  const normalizedPath = path.replace(/\/+$/, "") || "/";
  if (KEEP_URL_REF_PATHS.includes(normalizedPath)) return null;

  let ref = null;
  const kept = [];
  for (const part of query.split("&")) {
    if (part === "") continue;
    const eq = part.indexOf("=");
    const rawKey = eq === -1 ? part : part.slice(0, eq);
    let key = rawKey;
    try {
      key = decodeURIComponent(rawKey);
    } catch {
      // keep the raw key
    }
    if (key === "ref") {
      if (ref === null) {
        const rawValue = eq === -1 ? "" : part.slice(eq + 1);
        try {
          ref = decodeURIComponent(rawValue.replace(/\+/g, " "));
        } catch {
          ref = rawValue;
        }
      }
      continue;
    }
    // Other parameters are kept exactly as written.
    kept.push(part);
  }
  if (ref === null) return null;

  const rest = kept.length ? `?${kept.join("&")}` : "";
  return { href: `${base}${rest}${hash}`, ref };
}

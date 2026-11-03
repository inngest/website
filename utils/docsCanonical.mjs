// @ts-check
/**
 * Canonical path for a docs URL.
 *
 * The TypeScript SDK reference for the stable version is served at two URLs:
 * the versioned /docs/reference/typescript/<stable>/… page and the versionless
 * /docs/reference/typescript/… "latest" alias (a rewrite in next.config.mjs).
 * The versionless URL is canonical, so links, rankings and AI citations stay
 * on the same URL across major SDK releases: bumping TS_STABLE_VERSION moves
 * "latest" to the new version and the old version's pages become their own
 * canonical archive (as /v3/ is today).
 *
 * Exceptions keep the versioned URL:
 *   - the version index (/docs/reference/typescript/<stable>), which redirects
 *   - migration guides, which are version-specific; their versionless path
 *     redirects to the versioned page
 *
 * Every other path is returned unchanged. Pure, so it runs the same in the
 * browser, the edge middleware and the sitemap build.
 *
 * @param {string} pathname path only, no query or hash
 * @param {string} stableVersion TS_STABLE_VERSION, e.g. "v4"
 * @returns {string}
 */
export function canonicalDocsPath(pathname, stableVersion) {
  const prefix = `/docs/reference/typescript/${stableVersion}/`;
  if (!pathname.startsWith(prefix)) return pathname;
  const rest = pathname.slice(prefix.length);
  if (rest === "" || rest.startsWith("migrations/")) return pathname;
  return `/docs/reference/typescript/${rest}`;
}

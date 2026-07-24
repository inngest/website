/**
 * Appends a `?ref=<source>` attribution tag, matching the tracking scheme
 * used across the marketing site so analytics can see which surface a click
 * came from (nav links carry `?ref=nav`, footer links `?ref=footer`, etc.).
 *
 * Preserves any existing query string and hash fragment, and no-ops on
 * placeholder (`#`), `mailto:` and `tel:` links. External http(s) links are
 * tagged too (e.g. the sign-up app URL); callers skip social / third-party
 * links before calling.
 */
export function appendRef(url: string, ref: string): string {
  if (
    !url ||
    url === "#" ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  ) {
    return url;
  }
  const hashAt = url.indexOf("#");
  const hash = hashAt === -1 ? "" : url.slice(hashAt);
  const base = hashAt === -1 ? url : url.slice(0, hashAt);
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}ref=${ref}${hash}`;
}

import { splitInternalRef } from "./refLinks.mjs";

/**
 * Appends a `?ref=<source>` attribution tag, matching the tracking scheme
 * used across the marketing site so analytics can see which surface a click
 * came from (nav links carry `?ref=nav`, footer links `?ref=footer`, etc.).
 *
 * For same-origin links the tag never reaches the rendered HTML: every link
 * renders through `refLinkProps()`, which moves it into `data-ref`. Links to
 * app.inngest.com and the /sign-up and /sign-in short links keep `?ref=`.
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

/**
 * Props for a rendered link. A same-origin href carrying `?ref=<placement>`
 * comes back without the parameter plus `data-ref="<placement>"`, so the page
 * has one URL for search engines while utils/v1/refHandoff.ts still reports
 * the placement. Every other href (no ref, other origins, /sign-up, URL
 * objects, undefined) is returned unchanged.
 *
 * Use it in place of `href` on `<a>` and `next/link`:
 *
 *   <Link {...refLinkProps(item.href)}>…</Link>
 */
export function refLinkProps<T>(href: T): { href: T; "data-ref"?: string } {
  const split = splitInternalRef(href);
  if (!split) return { href };
  return split.ref
    ? { href: split.href as T, "data-ref": split.ref }
    : { href: split.href as T };
}

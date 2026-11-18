import { canonicalDocsPath } from "../../utils/docsCanonical.mjs";
import { TS_STABLE } from "./LanguageStore";

/**
 * `router.pathname` in the form the docs nav uses for its hrefs.
 *
 * The stable TypeScript reference renders from /docs/reference/typescript/v4/…
 * files, so `router.pathname` is versioned even when the visitor is on the
 * versionless URL, while nav hrefs are versionless (canonicalDocsPath). Use
 * this wherever the current page is matched against nav hrefs.
 */
export function toDocsNavPath(pathname: string): string {
  return canonicalDocsPath(pathname, TS_STABLE);
}

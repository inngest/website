// @ts-check
import { visit } from "unist-util-visit";

import { TS_STABLE_VERSION } from "../redirects.mjs";
import { canonicalDocsHref } from "../utils/docsCanonical.mjs";

/**
 * Point links in MDX content at canonical docs URLs: a link to the stable
 * TypeScript reference (/docs/reference/typescript/v4/…) renders as its
 * versionless URL. See canonicalDocsHref() in utils/docsCanonical.mjs.
 *
 * Handles markdown links and raw HTML anchors (hast elements, including after
 * rehype-raw) and the string `href` of any inline JSX element (`<a>`,
 * `<Card>`, `<ButtonLink>`, …).
 *
 * @param {{ stableVersion?: string }} [options]
 */
export function rehypeCanonicalDocsLinks(options = {}) {
  const stableVersion = options.stableVersion ?? TS_STABLE_VERSION;
  /** @param {any} tree */
  return (tree) => {
    visit(tree, (/** @type {any} */ node) => {
      if (node.type === "element") {
        if (typeof node.properties?.href === "string") {
          node.properties.href = canonicalDocsHref(
            node.properties.href,
            stableVersion
          );
        }
        return;
      }
      if (
        node.type === "mdxJsxFlowElement" ||
        node.type === "mdxJsxTextElement"
      ) {
        for (const attr of node.attributes ?? []) {
          if (
            attr.type === "mdxJsxAttribute" &&
            attr.name === "href" &&
            typeof attr.value === "string"
          ) {
            attr.value = canonicalDocsHref(attr.value, stableVersion);
          }
        }
      }
    });
  };
}

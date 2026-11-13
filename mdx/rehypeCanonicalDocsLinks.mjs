// @ts-check
// JavaScript, not TypeScript: mdx/rehype.mjs imports this, and next.config.mjs
// loads that in plain Node, which can't import .ts. @ts-check plus the JSDoc
// types below keep it type-checked.
import { visit } from "unist-util-visit";

import { TS_STABLE_VERSION } from "../redirects.mjs";
import { canonicalDocsHref } from "../utils/docsCanonical.mjs";

/**
 * A unist node, as unist-util-visit types it.
 * @typedef {Parameters<typeof visit>[0]} Node
 */

/**
 * A hast element: a markdown link or raw HTML anchor.
 * @typedef {Node & { type: "element", properties?: { href?: unknown } }} Element
 */

/**
 * An attribute on an inline JSX element. Expression attributes
 * (`href={url}`) are a different type and have no string value.
 * @typedef {{ type: string, name?: string, value?: unknown }} JsxAttribute
 */

/**
 * An inline JSX element in MDX (`<a>`, `<Card>`, `<ButtonLink>`, …).
 * @typedef {Node & {
 *   type: "mdxJsxFlowElement" | "mdxJsxTextElement",
 *   attributes?: JsxAttribute[],
 * }} JsxElement
 */

/** @type {(node: Node) => node is Element} */
const isElement = (node) => node.type === "element";

/** @type {(node: Node) => node is JsxElement} */
const isJsxElement = (node) =>
  node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";

/**
 * Point links in MDX content at canonical docs URLs: a link to the stable
 * TypeScript reference (/docs/reference/typescript/v4/…) renders as its
 * versionless URL. See canonicalDocsHref() in utils/docsCanonical.mjs.
 *
 * Handles markdown links and raw HTML anchors (hast elements, including after
 * rehype-raw) and the string `href` of any inline JSX element.
 *
 * @param {{ stableVersion?: string }} [options]
 * @returns {(tree: Node) => void}
 */
export function rehypeCanonicalDocsLinks(options = {}) {
  const stableVersion = options.stableVersion ?? TS_STABLE_VERSION;
  return (tree) => {
    visit(tree, (node) => {
      if (isElement(node)) {
        const href = node.properties?.href;
        if (typeof href === "string") {
          node.properties.href = canonicalDocsHref(href, stableVersion);
        }
        return;
      }
      if (isJsxElement(node)) {
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

import { visit } from "unist-util-visit";

import { resolveRedirect } from "../redirects.mjs";
import { splitInternalRef } from "../utils/v1/refLinks.mjs";

/**
 * splitInternalRef(), with the href resolved through our redirect table. The
 * click handoff matches the destination path exactly, so a tracked link to a
 * path that redirects (e.g. an old /docs/guides/… URL) would lose its ref.
 * Pointing it at the final URL keeps the ref and saves the redirect hop.
 */
function splitAndResolve(href) {
  const split = splitInternalRef(href);
  if (!split) return null;
  return { ...split, href: resolveRedirect(split.href) };
}

/**
 * Move `?ref=<placement>` on same-origin links in MDX content into
 * `data-ref="<placement>"`, so blog, docs, changelog and customer story
 * pages render one URL per page while utils/v1/refHandoff.ts still reports
 * the placement. Same rule as `refLinkProps()`; see utils/v1/refLinks.mjs.
 *
 * Handles markdown links and raw HTML anchors (hast `a` elements, including
 * after rehype-raw) and inline JSX `<a href="…">`. Other JSX components that
 * take an `href` are left alone: they render through `refLinkProps()`
 * themselves. Tracked links are pointed at their final URL when they hit a
 * redirect (see splitAndResolve).
 */
export function rehypeRefLinks() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "element" &&
        node.tagName === "a" &&
        typeof node.properties?.href === "string"
      ) {
        const split = splitAndResolve(node.properties.href);
        if (!split) return;
        node.properties.href = split.href;
        if (split.ref) node.properties.dataRef = split.ref;
        return;
      }

      if (
        (node.type === "mdxJsxFlowElement" ||
          node.type === "mdxJsxTextElement") &&
        node.name === "a"
      ) {
        const hrefAttr = node.attributes?.find(
          (attr) =>
            attr.type === "mdxJsxAttribute" &&
            attr.name === "href" &&
            typeof attr.value === "string"
        );
        if (!hrefAttr) return;
        const split = splitAndResolve(hrefAttr.value);
        if (!split) return;
        hrefAttr.value = split.href;
        if (
          split.ref &&
          !node.attributes.some(
            (attr) =>
              attr.type === "mdxJsxAttribute" && attr.name === "data-ref"
          )
        ) {
          node.attributes.push({
            type: "mdxJsxAttribute",
            name: "data-ref",
            value: split.ref,
          });
        }
      }
    });
  };
}

import { visit } from "unist-util-visit";

import { splitInternalRef } from "../utils/v1/refLinks.mjs";

/**
 * Move `?ref=<placement>` on same-origin links in MDX content into
 * `data-ref="<placement>"`, so blog, docs, changelog and customer story
 * pages render one URL per page while utils/v1/refHandoff.ts still reports
 * the placement. Same rule as `refLinkProps()`; see utils/v1/refLinks.mjs.
 *
 * Handles markdown links and raw HTML anchors (hast `a` elements, including
 * after rehype-raw) and inline JSX `<a href="…">`. Other JSX components that
 * take an `href` are left alone: they render through `refLinkProps()`
 * themselves.
 */
export function rehypeRefLinks() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "element" &&
        node.tagName === "a" &&
        typeof node.properties?.href === "string"
      ) {
        const split = splitInternalRef(node.properties.href);
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
        const split = splitInternalRef(hrefAttr.value);
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

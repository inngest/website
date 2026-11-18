import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { canonicalDocsHref, canonicalDocsPath } from "./docsCanonical.mjs";
import { rehypeCanonicalDocsLinks } from "../mdx/rehypeCanonicalDocsLinks.mjs";
import { resolveRedirect, TS_STABLE_VERSION } from "../redirects.mjs";

test("stable-version reference pages canonicalise to the versionless URL", () => {
  assert.equal(
    canonicalDocsPath("/docs/reference/typescript/v4/functions/triggers", "v4"),
    "/docs/reference/typescript/functions/triggers"
  );
});

test("versionless URLs, older versions and other docs are unchanged", () => {
  for (const p of [
    "/docs/reference/typescript/functions/triggers",
    "/docs/reference/typescript/v3/functions/triggers",
    "/docs/reference/typescript/v4",
    "/docs/reference/python/client/overview",
    "/docs",
    "/pricing",
  ]) {
    assert.equal(canonicalDocsPath(p, "v4"), p);
  }
});

test("migration guides keep their versioned URL", () => {
  const p = "/docs/reference/typescript/v4/migrations/v3-to-v4";
  assert.equal(canonicalDocsPath(p, "v4"), p);
});

test("follows the stable version when it changes", () => {
  assert.equal(
    canonicalDocsPath("/docs/reference/typescript/v5/serve", "v5"),
    "/docs/reference/typescript/serve"
  );
  assert.equal(
    canonicalDocsPath("/docs/reference/typescript/v4/serve", "v5"),
    "/docs/reference/typescript/v4/serve"
  );
});

// Guard: every stable reference page's canonical must be a live URL, never a
// redirect source, or search engines get a canonical that points at a 308.
test("no stable reference page canonicalises to a redirecting URL", () => {
  const dir = path.join("pages/docs/reference/typescript", TS_STABLE_VERSION);
  const walk = (d) =>
    fs
      .readdirSync(d, { withFileTypes: true })
      .flatMap((e) =>
        e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
      );
  const pages = walk(dir)
    .filter((f) => /\.(mdx?|tsx)$/.test(f))
    .map(
      (f) =>
        "/" + f.replace(/^pages\//, "").replace(/(\/index)?\.(mdx?|tsx)$/, "")
    );
  assert.ok(pages.length > 0);
  for (const page of pages) {
    const canonical = canonicalDocsPath(page, TS_STABLE_VERSION);
    assert.equal(
      resolveRedirect(canonical),
      canonical,
      `${page} → ${canonical} redirects`
    );
  }
});

test("canonicalDocsHref rewrites links, keeping query, hash and origin", () => {
  const cases = [
    [
      "/docs/reference/typescript/v4/functions/create",
      "/docs/reference/typescript/functions/create",
    ],
    [
      "/docs/reference/typescript/v4/functions/create#batchevents",
      "/docs/reference/typescript/functions/create#batchevents",
    ],
    [
      "/docs/reference/typescript/v4/serve?ref=docs#signingKey",
      "/docs/reference/typescript/serve?ref=docs#signingKey",
    ],
    [
      "https://www.inngest.com/docs/reference/typescript/v4/client/create",
      "https://www.inngest.com/docs/reference/typescript/client/create",
    ],
    [
      "https://inngest.com/docs/reference/typescript/v4/client/create",
      "https://inngest.com/docs/reference/typescript/client/create",
    ],
  ];
  for (const [input, expected] of cases) {
    assert.equal(canonicalDocsHref(input, "v4"), expected, input);
  }
});

test("canonicalDocsHref leaves other links unchanged", () => {
  for (const href of [
    "/docs/reference/typescript/v3/functions/create",
    "/docs/reference/typescript/v4/migrations/v3-to-v4",
    "/docs/reference/typescript/v4",
    "/docs/reference/typescript/functions/create",
    "/docs/guides/background-jobs",
    "https://example.com/docs/reference/typescript/v4/functions/create",
    "https://www.inngest.com.evil.test/docs/reference/typescript/v4/serve",
    "//cdn.example.com/docs/reference/typescript/v4/serve",
    "#batchevents",
    "mailto:hello@inngest.com",
  ]) {
    assert.equal(canonicalDocsHref(href, "v4"), href, href);
  }
  assert.equal(canonicalDocsHref(undefined, "v4"), undefined);
});

test("rehypeCanonicalDocsLinks rewrites markdown links and JSX hrefs", () => {
  const v4 = "/docs/reference/typescript/v4/functions/create";
  const latest = "/docs/reference/typescript/functions/create";
  const jsx = (type, name) => ({
    type,
    name,
    attributes: [
      { type: "mdxJsxAttribute", name: "href", value: v4 },
      { type: "mdxJsxAttribute", name: "title", value: v4 },
    ],
    children: [],
  });
  const tree = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "p",
        properties: {},
        children: [
          {
            type: "element",
            tagName: "a",
            properties: { href: v4 },
            children: [],
          },
          jsx("mdxJsxTextElement", "a"),
        ],
      },
      jsx("mdxJsxFlowElement", "Card"),
      { type: "text", value: v4 },
    ],
  };
  rehypeCanonicalDocsLinks({ stableVersion: "v4" })(tree);
  const [p, card, text] = tree.children;
  assert.equal(p.children[0].properties.href, latest);
  assert.equal(p.children[1].attributes[0].value, latest);
  assert.equal(card.attributes[0].value, latest);
  // Only hrefs change: other attributes and text are left alone.
  assert.equal(card.attributes[1].value, v4);
  assert.equal(text.value, v4);
});

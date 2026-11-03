import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { canonicalDocsPath } from "./docsCanonical.mjs";
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

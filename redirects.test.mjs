import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  permanentRedirects,
  resolveRedirect,
  resolveDocsPath,
  splitDocsSuffix,
  TS_STABLE_VERSION,
} from "./redirects.mjs";

/**
 * Two kinds of test here:
 *
 *   1. Behaviour — the resolver logic, pinned with cases taken from the real
 *      table. These break if someone changes how resolution works.
 *   2. Invariants — properties the table itself has to keep as docs move.
 *      These break when an entry rots, which is the failure mode that produced
 *      the 404s in the markdown mirror in the first place.
 */

const docsDir = path.join(process.cwd(), "pages", "docs");

function docFileExists(slug) {
  return [
    path.join(docsDir, `${slug}.mdx`),
    path.join(docsDir, slug, "index.mdx"),
    path.join(docsDir, `${slug}.md`),
  ].some((p) => fs.existsSync(p));
}

describe("splitDocsSuffix", () => {
  it("splits off a fragment", () => {
    assert.deepEqual(splitDocsSuffix("/docs/a#b"), ["/docs/a", "#b"]);
  });

  it("splits off a query", () => {
    assert.deepEqual(splitDocsSuffix("/docs/a?b=c"), ["/docs/a", "?b=c"]);
  });

  it("treats everything after the first marker as the suffix", () => {
    assert.deepEqual(splitDocsSuffix("/docs/a?b=c#d"), ["/docs/a", "?b=c#d"]);
  });

  it("returns an empty suffix when there is none", () => {
    assert.deepEqual(splitDocsSuffix("/docs/a"), ["/docs/a", ""]);
  });
});

describe("resolveRedirect", () => {
  it("resolves a single hop", () => {
    assert.equal(
      resolveRedirect("/docs/reference/serve"),
      "/docs/reference/typescript/v4/serve"
    );
  });

  it("follows a multi-hop chain to the end", () => {
    // /docs/functions/retries → /docs/reference/typescript/functions/errors
    //                        → /docs/features/.../inngest-errors
    assert.equal(
      resolveRedirect("/docs/functions/retries"),
      "/docs/features/inngest-functions/error-retries/inngest-errors"
    );
  });

  it("leaves an unknown path untouched", () => {
    assert.equal(
      resolveRedirect("/docs/learn/inngest-steps"),
      "/docs/learn/inngest-steps"
    );
  });

  it("carries an incoming fragment through to the destination", () => {
    assert.equal(
      resolveRedirect("/docs/reference/serve#signingKey"),
      "/docs/reference/typescript/v4/serve#signingKey"
    );
  });

  it("carries an incoming query through to the destination", () => {
    assert.equal(
      resolveRedirect("/docs/reference/serve?ref=test"),
      "/docs/reference/typescript/v4/serve?ref=test"
    );
  });

  it("lets a fragment on the destination win, as a browser would", () => {
    // /docs/frameworks/express → /docs/sdk/serve#framework-express
    //                          → /docs/learn/serving-inngest-functions (no fragment)
    // so the fragment introduced mid-chain survives.
    assert.equal(
      resolveRedirect("/docs/frameworks/express"),
      "/docs/learn/serving-inngest-functions#framework-express"
    );
  });

  it("stops at maxHops rather than looping forever", () => {
    // Chains are at most 3 hops today; capping at 1 must stop early instead of
    // running to the end.
    assert.equal(
      resolveRedirect("/docs/functions/retries", 1),
      "/docs/reference/typescript/functions/errors"
    );
  });
});

describe("resolveDocsPath", () => {
  it("applies a redirect", () => {
    assert.equal(
      resolveDocsPath("reference/serve"),
      `reference/typescript/${TS_STABLE_VERSION}/serve`
    );
  });

  it("pins a versionless TypeScript path to the stable version", () => {
    assert.equal(
      resolveDocsPath("reference/typescript/testing"),
      `reference/typescript/${TS_STABLE_VERSION}/testing`
    );
  });

  it("leaves an explicitly versioned path alone", () => {
    assert.equal(
      resolveDocsPath("reference/typescript/v3/serve"),
      "reference/typescript/v3/serve"
    );
    assert.equal(
      resolveDocsPath("reference/typescript/v4/serve"),
      "reference/typescript/v4/serve"
    );
  });

  it("applies redirects BEFORE the versionless rule", () => {
    // The bug this ordering fixes: the rewrite used to run first and pinned
    // this to reference/typescript/v4/functions/errors, which has no file.
    // The redirect moves it out of the reference section entirely.
    assert.equal(
      resolveDocsPath("reference/typescript/functions/errors"),
      "features/inngest-functions/error-retries/inngest-errors"
    );
  });

  it("preserves a suffix", () => {
    assert.equal(
      resolveDocsPath("reference/serve#signingKey"),
      `reference/typescript/${TS_STABLE_VERSION}/serve#signingKey`
    );
  });

  it("returns the input when the destination leaves /docs", () => {
    // Nothing outside /docs has a markdown mirror, so the caller should 404
    // rather than be handed an off-site URL.
    assert.equal(resolveDocsPath("agent-kit/foo"), "agent-kit/foo");
  });

  it("leaves an unknown slug untouched", () => {
    assert.equal(resolveDocsPath("learn/inngest-steps"), "learn/inngest-steps");
  });
});

describe("permanentRedirects table", () => {
  const docsSources = permanentRedirects
    .map(([source]) => source)
    .filter((source) => source.startsWith("/docs/") && !/[:*]/.test(source));

  it("has no duplicate sources", () => {
    const seen = new Set();
    const dupes = [];
    for (const [source] of permanentRedirects) {
      if (seen.has(source)) dupes.push(source);
      seen.add(source);
    }
    assert.deepEqual(
      dupes,
      [],
      `duplicate redirect sources: ${dupes.join(", ")}`
    );
  });

  it("has no entry redirecting to itself", () => {
    const selfRefs = permanentRedirects
      .filter(([source, destination]) => source === destination)
      .map(([source]) => source);
    assert.deepEqual(
      selfRefs,
      [],
      `self-referencing redirects: ${selfRefs.join(", ")}`
    );
  });

  it("resolves every chain without hitting the hop limit", () => {
    // resolveRedirect bails at maxHops; if a source still points at another
    // source afterwards, the chain was too long or cyclic.
    const map = new Map(permanentRedirects);
    const unresolved = permanentRedirects
      .map(([source]) => source)
      .filter((source) => map.has(splitDocsSuffix(resolveRedirect(source))[0]));
    assert.deepEqual(
      unresolved,
      [],
      `chains did not terminate: ${unresolved.join(", ")}`
    );
  });

  it("points every /docs destination at a page that exists", () => {
    const broken = [];

    for (const source of docsSources) {
      const [destination] = splitDocsSuffix(resolveRedirect(source));
      if (!destination.startsWith("/docs")) continue; // off-site or marketing
      if (destination === "/docs") continue; // the docs index

      const slug = destination.replace(/^\/docs\/?/, "");
      // /docs/patterns/* is a separate content system (pages/docs/patterns is a
      // dynamic route, not MDX files), so there is nothing to stat.
      if (slug.startsWith("patterns/")) continue;

      const [resolved] = splitDocsSuffix(resolveDocsPath(slug));
      if (!docFileExists(resolved)) broken.push(`${source} -> ${destination}`);
    }

    assert.deepEqual(
      broken,
      [],
      `redirects to missing pages:\n  ${broken.join("\n  ")}`
    );
  });

  it("never leaves a /docs source resolving back to a redirect source", () => {
    // A destination that is itself stale means the markdown mirror would need
    // two passes, and every link we rewrite to it is stale on arrival.
    const sources = new Set(permanentRedirects.map(([source]) => source));
    const stale = docsSources.filter((source) => {
      const [destination] = splitDocsSuffix(resolveRedirect(source));
      return sources.has(destination);
    });
    assert.deepEqual(
      stale,
      [],
      `destinations that are themselves stale: ${stale.join(", ")}`
    );
  });
});

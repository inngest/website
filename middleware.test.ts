import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";

import { middleware } from "./middleware";

const ORIGIN = "https://www.inngest.com";

function run(path: string, headers: Record<string, string> = {}) {
  return middleware(new NextRequest(`${ORIGIN}${path}`, { headers }));
}

/** rel="canonical" targets in the response's Link header. */
function canonicals(res: Response): string[] {
  return (res.headers.get("link") ?? "")
    .split(/,\s*(?=<)/)
    .filter((part) => /rel="canonical"/.test(part))
    .map((part) => part.slice(1, part.indexOf(">")));
}

function hasMarkdownAlternate(res: Response, href: string): boolean {
  return (res.headers.get("link") ?? "").includes(
    `<${href}>; rel="alternate"; type="text/markdown"`
  );
}

describe("canonical Link header", () => {
  it("is not sent on a syndicated blog post (its page canonical names the partner)", () => {
    const res = run("/blog/weaviate-ai-workflows");
    assert.deepEqual(canonicals(res), []);
  });

  it("is not sent on a regular blog post, which still advertises its Markdown copy", () => {
    const res = run("/blog/announcing-step-fetch");
    assert.deepEqual(canonicals(res), []);
    assert.ok(
      hasMarkdownAlternate(res, `${ORIGIN}/blog/announcing-step-fetch.md`)
    );
  });

  it("is not sent on docs pages, which still advertise their Markdown copy", () => {
    const res = run("/docs/reference/typescript/v4/functions/triggers");
    assert.deepEqual(canonicals(res), []);
    assert.ok(
      hasMarkdownAlternate(
        res,
        `${ORIGIN}/docs/reference/typescript/v4/functions/triggers.md`
      )
    );
  });

  it("is not sent on other pages, with or without ?ref=", () => {
    assert.equal(run("/pricing?ref=nav").headers.get("link"), null);
    assert.equal(run("/").headers.get("link"), null);
  });

  it("points the blog Markdown mirror at the HTML post", () => {
    const res = run("/blog-markdown/weaviate-ai-workflows");
    assert.deepEqual(canonicals(res), [`${ORIGIN}/blog/weaviate-ai-workflows`]);
  });

  it("points the docs Markdown mirror at the HTML page, versionless for the stable TS reference", () => {
    for (const path of [
      "/docs-markdown/reference/typescript/functions/triggers",
      "/docs-markdown/reference/typescript/v4/functions/triggers",
    ]) {
      assert.deepEqual(canonicals(run(path)), [
        `${ORIGIN}/docs/reference/typescript/functions/triggers`,
      ]);
    }
  });

  it("points the docs Markdown index at /docs", () => {
    assert.deepEqual(canonicals(run("/docs-markdown")), [`${ORIGIN}/docs`]);
  });
});

describe("Markdown serving", () => {
  it("rewrites .md URLs to the mirrors", () => {
    assert.match(
      run("/blog/announcing-step-fetch.md").headers.get(
        "x-middleware-rewrite"
      ) ?? "",
      /\/blog-markdown\/announcing-step-fetch$/
    );
    assert.match(
      run("/docs/getting-started.md").headers.get("x-middleware-rewrite") ?? "",
      /\/docs-markdown\/getting-started$/
    );
  });

  it("rewrites Accept: text/markdown requests to the mirrors", () => {
    const res = run("/blog/announcing-step-fetch", { accept: "text/markdown" });
    assert.match(
      res.headers.get("x-middleware-rewrite") ?? "",
      /\/blog-markdown\/announcing-step-fetch$/
    );
  });

  it("varies HTML responses on Accept", () => {
    assert.equal(
      run("/blog/announcing-step-fetch").headers.get("vary"),
      "Accept"
    );
  });
});

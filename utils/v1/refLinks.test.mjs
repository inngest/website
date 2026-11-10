import { test } from "node:test";
import assert from "node:assert/strict";

import { splitInternalRef } from "./refLinks.mjs";
import { rehypeRefLinks } from "../../mdx/rehypeRefLinks.mjs";

test("moves ref out of a same-origin path", () => {
  assert.deepEqual(splitInternalRef("/pricing?ref=nav"), {
    href: "/pricing",
    ref: "nav",
  });
});

test("keeps other parameters, their order and the hash", () => {
  assert.deepEqual(
    splitInternalRef("/docs/x?a=1&ref=footer&b=two%20words#sec"),
    {
      href: "/docs/x?a=1&b=two%20words#sec",
      ref: "footer",
    }
  );
  assert.deepEqual(splitInternalRef("/docs/x?ref=footer#sec"), {
    href: "/docs/x#sec",
    ref: "footer",
  });
});

test("makes absolute www and apex inngest.com URLs root-relative", () => {
  assert.deepEqual(
    splitInternalRef("https://www.inngest.com/blog/x?ref=blog"),
    {
      href: "/blog/x",
      ref: "blog",
    }
  );
  assert.deepEqual(splitInternalRef("https://inngest.com/?ref=x"), {
    href: "/",
    ref: "x",
  });
});

test("leaves other origins, sign-up and sign-in alone", () => {
  assert.equal(
    splitInternalRef("https://app.inngest.com/sign-up?ref=nav"),
    null
  );
  assert.equal(
    splitInternalRef("https://www.inngest.com.evil.com/?ref=x"),
    null
  );
  assert.equal(splitInternalRef("//cdn.example.com/x?ref=y"), null);
  assert.equal(splitInternalRef("/sign-up?ref=pricing-card-pro"), null);
  assert.equal(splitInternalRef("/sign-up/?ref=x"), null);
  assert.equal(splitInternalRef("/sign-in?ref=nav"), null);
  assert.equal(splitInternalRef("https://www.inngest.com/sign-up?ref=x"), null);
});

test("leaves URLs without a ref parameter alone", () => {
  assert.equal(splitInternalRef("/pricing"), null);
  assert.equal(splitInternalRef("/docs?prefer=x"), null);
  assert.equal(splitInternalRef("/docs#ref=x"), null);
  assert.equal(splitInternalRef("mailto:hi@inngest.com?ref=x"), null);
  assert.equal(splitInternalRef(undefined), null);
  assert.equal(splitInternalRef({ pathname: "/x", query: { ref: "y" } }), null);
});

test("decodes the ref value", () => {
  assert.deepEqual(splitInternalRef("/x?ref=a%2Fb"), {
    href: "/x",
    ref: "a/b",
  });
});

test("rehypeRefLinks rewrites markdown links and inline JSX anchors", () => {
  const tree = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "a",
        properties: { href: "/changelog?ref=blog" },
        children: [],
      },
      {
        type: "element",
        tagName: "a",
        properties: { href: "/sign-up?ref=blog" },
        children: [],
      },
      {
        type: "element",
        tagName: "a",
        properties: { href: "https://e2b.dev/?ref=inngest" },
        children: [],
      },
      {
        type: "mdxJsxTextElement",
        name: "a",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "href",
            value: "/docs?ref=docs-home",
          },
        ],
        children: [],
      },
      {
        type: "mdxJsxFlowElement",
        name: "Card",
        attributes: [
          { type: "mdxJsxAttribute", name: "href", value: "/docs?ref=card" },
        ],
        children: [],
      },
    ],
  };
  rehypeRefLinks()(tree);
  const [md, signUp, external, jsxA, card] = tree.children;
  assert.deepEqual(md.properties, { href: "/changelog", dataRef: "blog" });
  assert.deepEqual(signUp.properties, { href: "/sign-up?ref=blog" });
  assert.deepEqual(external.properties, {
    href: "https://e2b.dev/?ref=inngest",
  });
  assert.deepEqual(jsxA.attributes, [
    { type: "mdxJsxAttribute", name: "href", value: "/docs" },
    { type: "mdxJsxAttribute", name: "data-ref", value: "docs-home" },
  ]);
  // Components render through refLinkProps() themselves.
  assert.equal(card.attributes[0].value, "/docs?ref=card");
});

test("rehypeRefLinks points tracked links at their final URL", () => {
  const tree = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "a",
        properties: { href: "/docs/guides/concurrency?ref=blog#keys" },
        children: [],
      },
      {
        type: "element",
        tagName: "a",
        properties: {
          href: "https://www.inngest.com/docs/guides/concurrency?ref=blog",
        },
        children: [],
      },
    ],
  };
  rehypeRefLinks()(tree);
  const [relative, absolute] = tree.children;
  assert.deepEqual(relative.properties, {
    href: "/docs/durable-execution/flow-control/concurrency#keys",
    dataRef: "blog",
  });
  assert.deepEqual(absolute.properties, {
    href: "/docs/durable-execution/flow-control/concurrency",
    dataRef: "blog",
  });
});

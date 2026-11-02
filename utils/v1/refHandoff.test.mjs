import { test } from "node:test";
import assert from "node:assert/strict";

import {
  REF_HANDOFF_COOKIE,
  normalizePath,
  parseHandoffCookie,
  resolvePageRef,
  serializeHandoff,
} from "./refHandoff.ts";

const cookieFor = (handoff) =>
  `other=1; ${REF_HANDOFF_COOKIE}=${serializeHandoff(handoff)}; theme=dark`;

test("normalizePath trims trailing slashes and keeps root", () => {
  assert.equal(normalizePath("/pricing/"), "/pricing");
  assert.equal(normalizePath("/pricing"), "/pricing");
  assert.equal(normalizePath("/"), "/");
  assert.equal(normalizePath(""), "/");
});

test("parseHandoffCookie reads the handoff among other cookies", () => {
  assert.deepEqual(
    parseHandoffCookie(cookieFor({ ref: "footer", path: "/pricing" })),
    {
      ref: "footer",
      path: "/pricing",
    }
  );
});

test("parseHandoffCookie ignores missing, empty and malformed values", () => {
  assert.equal(parseHandoffCookie(""), null);
  assert.equal(parseHandoffCookie("other=1"), null);
  assert.equal(parseHandoffCookie(`${REF_HANDOFF_COOKIE}=not-json`), null);
  assert.equal(
    parseHandoffCookie(cookieFor({ ref: "", path: "/pricing" })),
    null
  );
});

test("URL ?ref= wins over a handoff", () => {
  assert.deepEqual(
    resolvePageRef(
      "?ref=unzip.dev",
      "/pricing",
      cookieFor({ ref: "footer", path: "/pricing" })
    ),
    { ref: "unzip.dev", source: "url" }
  );
});

test("handoff applies only on the page it was stored for", () => {
  const cookie = cookieFor({ ref: "nav", path: "/pricing" });
  assert.deepEqual(resolvePageRef("", "/pricing", cookie), {
    ref: "nav",
    source: "click",
  });
  assert.deepEqual(resolvePageRef("", "/pricing/", cookie), {
    ref: "nav",
    source: "click",
  });
  assert.equal(resolvePageRef("", "/docs", cookie), null);
});

test("no URL ref and no handoff resolves to null", () => {
  assert.equal(resolvePageRef("?utm_source=x", "/pricing", "other=1"), null);
});

test("ref values with reserved characters round-trip", () => {
  const cookie = cookieFor({ ref: "blog-a;b=c", path: "/docs" });
  assert.deepEqual(resolvePageRef("", "/docs", cookie), {
    ref: "blog-a;b=c",
    source: "click",
  });
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { lastmodFor, toW3CDate } = require("./next-sitemap.lastmod.js");

test("toW3CDate formats dates and rejects non-dates", () => {
  assert.equal(toW3CDate("2026-05-05"), "2026-05-05");
  assert.equal(toW3CDate(new Date("2025-01-31T00:00:00Z")), "2025-01-31");
  assert.equal(toW3CDate(undefined), null);
  assert.equal(toW3CDate("not a date"), null);
});

test("blog posts use their front-matter date", () => {
  assert.equal(lastmodFor("/blog/ai-in-production-report-2026"), "2026-05-05");
});

test("changelog entries use `export const date`", () => {
  assert.equal(
    lastmodFor("/changelog/2024-11-25-function-cancelled-event"),
    "2024-11-25"
  );
});

test("pages without a reliable date get no lastmod", () => {
  assert.equal(lastmodFor("/pricing"), undefined);
  assert.equal(lastmodFor("/"), undefined);
  assert.equal(lastmodFor("/blog/does-not-exist"), undefined);
});

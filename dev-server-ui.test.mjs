import assert from "node:assert/strict";
import test from "node:test";
import { devServerUIRewrites } from "./dev-server-ui.mjs";

test("does not publish the UI before an origin is configured", () => {
  assert.deepEqual(devServerUIRewrites(""), []);
});

test("preserves the UI prefix for documents, deep links, and assets", () => {
  assert.deepEqual(devServerUIRewrites("https://dev-ui.example.com/"), [
    { source: "/dev", destination: "https://dev-ui.example.com/dev" },
    {
      source: "/dev/:path*",
      destination: "https://dev-ui.example.com/dev/:path*",
    },
  ]);
  assert.equal(
    devServerUIRewrites("http://localhost:5173")[0].destination,
    "http://localhost:5173/dev"
  );
});

test("rejects invalid origins and production rewrite loops", () => {
  for (const origin of [
    "https://www.inngest.com",
    "https://inngest.com",
    "file:///tmp/ui",
    "https://user:password@example.com",
    "https://example.com/dev",
    "https://example.com?preview=1",
    "https://example.com#dev",
  ]) {
    assert.throws(() => devServerUIRewrites(origin));
  }
});

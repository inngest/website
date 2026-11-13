import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

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

// ── Git-based dates (docs and customer stories) ─────────────────────────────
// Each case runs in a throwaway repo, in its own Node process, so it doesn't
// depend on this checkout's history and the module's cache starts empty.

const MODULE = path.resolve("next-sitemap.lastmod.js");

function git(cwd, args, date) {
  execFileSync(
    "git",
    [
      "-c",
      "user.name=test",
      "-c",
      "user.email=test@example.com",
      "-c",
      "commit.gpgsign=false",
      ...args,
    ],
    {
      cwd,
      stdio: "ignore",
      env: date
        ? { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date }
        : process.env,
    }
  );
}

function write(dir, rel, content) {
  fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
  fs.writeFileSync(path.join(dir, rel), content);
}

/** A repo with a docs page and a customer story committed on known dates. */
function makeRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lastmod-"));
  git(dir, ["init", "-q"]);
  write(dir, "pages/docs/guide.mdx", "v1");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-qm", "docs"], "2020-01-01T00:00:00Z");
  write(dir, "content/customers/acme.mdx", "story");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-qm", "customer"], "2021-06-01T00:00:00Z");
  write(dir, "README.md", "unrelated");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-qm", "later"], "2022-03-01T00:00:00Z");
  return dir;
}

/** Run lastmodFor for each URL in `cwd`, in a fresh process. */
function lastmodsIn(cwd, urls, script = "") {
  const out = execFileSync(
    process.execPath,
    [
      "-e",
      `const { lastmodFor } = require(${JSON.stringify(MODULE)});
       const urls = ${JSON.stringify(urls)};
       const first = urls.map((u) => lastmodFor(u) ?? null);
       ${script}
       console.log(JSON.stringify(first));`,
    ],
    { cwd, encoding: "utf8" }
  );
  return JSON.parse(out);
}

test("full history: docs and customer pages get their last commit date", () => {
  const repo = makeRepo();
  const [docs, customer] = lastmodsIn(repo, ["/docs/guide", "/customers/acme"]);
  assert.match(docs, /^2020-01-01T00:00:00/);
  assert.match(customer, /^2021-06-01T00:00:00/);
});

test("shallow clone: docs and customer pages get no date", () => {
  const repo = makeRepo();
  const shallow = fs.mkdtempSync(path.join(os.tmpdir(), "lastmod-shallow-"));
  execFileSync(
    "git",
    ["clone", "-q", "--depth", "1", `file://${repo}`, shallow],
    {
      stdio: "ignore",
    }
  );
  assert.deepEqual(lastmodsIn(shallow, ["/docs/guide", "/customers/acme"]), [
    null,
    null,
  ]);
});

test("not a git checkout: docs pages get no date", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lastmod-nogit-"));
  write(dir, "pages/docs/guide.mdx", "v1");
  assert.deepEqual(lastmodsIn(dir, ["/docs/guide"]), [null]);
});

test("git history is read once per build and cached", () => {
  const repo = makeRepo();
  // After the first lookup, commit a newer change and look again in the
  // same process: the cached date is returned, not the new one.
  const script = `
    require("node:fs").writeFileSync("pages/docs/guide.mdx", "v2");
    const { execFileSync } = require("node:child_process");
    const env = { ...process.env, GIT_AUTHOR_DATE: "2023-01-01T00:00:00Z", GIT_COMMITTER_DATE: "2023-01-01T00:00:00Z" };
    execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@e", "-c", "commit.gpgsign=false", "commit", "-qam", "newer"], { env });
    if (lastmodFor("/docs/guide") !== first[0]) throw new Error("cache was not used");
  `;
  const [docs] = lastmodsIn(repo, ["/docs/guide"], script);
  assert.match(docs, /^2020-01-01T00:00:00/);
});

/**
 * Real `lastmod` dates for the XML sitemap.
 *
 * Search engines only use lastmod when it proves accurate. Stamping every
 * URL with the build time (next-sitemap's default) teaches them to ignore
 * it, so we only send a date we can stand behind and omit it otherwise:
 *
 *   - Blog posts: `dateUpdated` from front matter, else `date`.
 *   - Changelog entries: `date` from front matter or `export const date`.
 *   - Docs pages and customer stories: the last commit that touched the
 *     source file, read from git in one pass. Only when the checkout has
 *     full history: a shallow clone (Vercel's default) reports the
 *     shallow boundary as the last change for every older file, which
 *     would be wrong, so in that case these pages get no lastmod.
 *   - Everything else: no lastmod.
 */
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const matter = require("gray-matter");

/** "YYYY-MM-DD" (W3C date) for front-matter dates; null if not a date. */
function toW3CDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function readIfExists(rel) {
  const abs = path.join(process.cwd(), rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
}

function firstExisting(candidates) {
  return candidates.find((rel) => fs.existsSync(path.join(process.cwd(), rel)));
}

/** Blog and changelog: the date the content says it was published/updated. */
function contentDate(rel) {
  const src = readIfExists(rel);
  if (src === null) return null;
  let data = {};
  try {
    data = matter(src).data;
  } catch {
    // fall through to the ESM export below
  }
  const fromFrontMatter = toW3CDate(data.dateUpdated) || toW3CDate(data.date);
  if (fromFrontMatter) return fromFrontMatter;
  const exported = src.match(
    /^export\s+const\s+date\s*=\s*["'`]([^"'`]+)["'`]/m
  );
  return exported ? toW3CDate(exported[1]) : null;
}

let gitDates;
/** Map of repo-relative path → ISO date of the last commit touching it. */
function loadGitDates() {
  if (gitDates) return gitDates;
  gitDates = new Map();
  try {
    const shallow = execFileSync(
      "git",
      ["rev-parse", "--is-shallow-repository"],
      {
        encoding: "utf8",
      }
    ).trim();
    if (shallow !== "false") return gitDates;
    const log = execFileSync(
      "git",
      [
        "log",
        "--format=%x00%cI",
        "--name-only",
        "--no-renames",
        "--",
        "pages/docs",
        "content/customers",
      ],
      { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }
    );
    let current = null;
    for (const line of log.split("\n")) {
      if (line.startsWith("\0")) {
        current = line.slice(1);
      } else if (line && current && !gitDates.has(line)) {
        // Newest commit first, so the first sighting is the latest change.
        gitDates.set(line, current);
      }
    }
  } catch {
    // No git (or not a repo): omit these dates rather than guess.
  }
  return gitDates;
}

/** The lastmod for a sitemap URL path, or undefined to omit it. */
function lastmodFor(urlPath) {
  const p = urlPath.replace(/\/+$/, "");

  if (p.startsWith("/blog/")) {
    const slug = p.slice("/blog/".length);
    const rel = firstExisting([
      `content/blog/${slug}.mdx`,
      `content/blog/${slug}.md`,
    ]);
    return (rel && contentDate(rel)) || undefined;
  }
  if (p.startsWith("/changelog/")) {
    const slug = p.slice("/changelog/".length);
    const rel = firstExisting([
      `content/changelog/${slug}.mdx`,
      `content/changelog/${slug}.md`,
    ]);
    return (rel && contentDate(rel)) || undefined;
  }

  let rel;
  if (p.startsWith("/docs/") || p === "/docs") {
    const sub = p.slice("/docs".length).replace(/^\//, "");
    rel = sub
      ? firstExisting([`pages/docs/${sub}.mdx`, `pages/docs/${sub}/index.mdx`])
      : firstExisting(["pages/docs/index.mdx"]);
  } else if (p.startsWith("/customers/")) {
    const slug = p.slice("/customers/".length);
    rel = firstExisting([`content/customers/${slug}.mdx`]);
  }
  return (rel && loadGitDates().get(rel)) || undefined;
}

module.exports = { lastmodFor, toW3CDate, contentDate };

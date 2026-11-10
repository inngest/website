// Post-build safety net: report internal links that still carry ?ref= in the
// built HTML.
//
// Same-origin links should render a clean href plus data-ref (see
// utils/v1/refLinks.mjs and refLinkProps() in utils/v1/ref.ts). A link that
// skips refLinkProps — e.g. a new component rendering a raw <a> or next/link
// with a dynamic href — would leak ?ref= into the HTML and recreate the
// duplicate parameter URLs the SEO audit flagged. Sign-up / sign-in links and
// other origins keep ?ref= on purpose and are not reported.
//
// Scans prerendered pages under .next/server/{app,pages}. Warns by default so
// it never blocks a deploy; set REF_LINKS_STRICT=1 (or pass --strict) to fail
// the build instead.
//
// Usage: node scripts/check-ref-links.mjs [buildDir] [--strict]

import fs from "node:fs";
import path from "node:path";

import { resolveRedirect } from "../redirects.mjs";
import { splitInternalRef } from "../utils/v1/refLinks.mjs";

const args = process.argv.slice(2);
const strict =
  args.includes("--strict") || process.env.REF_LINKS_STRICT === "1";
const buildDir = args.find((a) => !a.startsWith("--")) ?? ".next";
const roots = ["server/app", "server/pages"].map((d) => path.join(buildDir, d));

function htmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(p);
    return entry.name.endsWith(".html") ? [p] : [];
  });
}

const files = roots.flatMap(htmlFiles);
if (files.length === 0) {
  console.warn(
    `[check-ref-links] No prerendered HTML found in ${buildDir}; skipped.`
  );
  process.exit(0);
}

const HREF = /\shref="([^"]*)"/g;
const TRACKED_A = /<a\b[^>]*\bdata-ref="[^"]*"[^>]*>/g;
const found = new Map(); // href → Set of pages
const redirected = new Map(); // tracked href that redirects → Set of pages

/** @param {Map<string, Set<string>>} map */
function add(map, key, page) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(page);
}

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const page =
    "/" +
    path
      .relative(buildDir, file)
      .replace(/^server\/(app|pages)\/?/, "")
      .replace(/\.html$/, "")
      .replace(/(^|\/)index$/, "");
  for (const match of html.matchAll(HREF)) {
    const href = match[1].replace(/&amp;/g, "&");
    if (splitInternalRef(href)) add(found, href, page);
  }
  // A tracked link to a path that redirects loses its ref: the click
  // handoff matches the destination path exactly.
  for (const tag of html.matchAll(TRACKED_A)) {
    const href = tag[0]
      .match(/\shref="(\/[^"]*)"/)?.[1]
      ?.replace(/&amp;/g, "&");
    if (!href || href.startsWith("//")) continue;
    const pathname = href.split(/[?#]/)[0];
    if (resolveRedirect(pathname) !== pathname) add(redirected, href, page);
  }
}

if (redirected.size > 0) {
  const warn = strict ? console.error : console.warn;
  warn(
    `[check-ref-links] ${redirected.size} tracked link(s) point at a URL ` +
      `that redirects, so their ref is lost. Link to the final URL instead:`
  );
  for (const [href, pages] of [...redirected].slice(0, 25)) {
    warn(
      `  ${href} → ${resolveRedirect(href.split(/[?#]/)[0])}  — e.g. ` +
        [...pages].slice(0, 3).join(", ")
    );
  }
  if (redirected.size > 25) warn(`  …and ${redirected.size - 25} more`);
}

if (found.size === 0) {
  console.log(
    `[check-ref-links] OK: no internal ?ref= links in ${files.length} pages.`
  );
  process.exit(strict && redirected.size > 0 ? 1 : 0);
}

const rows = [...found.entries()].sort((a, b) => b[1].size - a[1].size);
const total = rows.reduce((n, [, pages]) => n + pages.size, 0);
const log = strict ? console.error : console.warn;
log(
  `[check-ref-links] ${rows.length} internal link(s) still carry ?ref= ` +
    `(${total} occurrences). Render them through refLinkProps() or a shared ` +
    `link component; see "Links" in AGENTS.md.`
);
for (const [href, pages] of rows.slice(0, 25)) {
  const sample = [...pages].slice(0, 3).join(", ");
  log(`  ${href}  — ${pages.size} page(s), e.g. ${sample}`);
}
if (rows.length > 25) log(`  …and ${rows.length - 25} more`);

process.exit(strict ? 1 : 0);

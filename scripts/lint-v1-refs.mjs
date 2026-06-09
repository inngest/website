import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["components/v1", "app"];
const TRACKED =
  "sign-up|docs|get-in-touch|contact|sales-inquiry-form|demo|customers|careers|security|pricing";
const HREF_ATTR = new RegExp(
  `href=\\{?"(/(?:${TRACKED})(?:/[^"?#]*)?(?:[?#][^"]*)?)"`,
  "g"
);
const URL_CONST = new RegExp(
  `const\\s+\\w*(?:URL|HREF|LINK)\\b\\s*=\\s*"(/(?:${TRACKED})(?:/[^"?#]*)?(?:[?#][^"]*)?)"`,
  "g"
);

const SKIP_DIR = new Set(["node_modules", ".next", "dist", ".git"]);
const strict = process.argv.includes("--strict");
const target = process.argv.find((a) => !a.startsWith("--") && a.endsWith(".tsx"));

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (p.endsWith(".tsx") && !/Legacy/.test(p)) out.push(p);
  }
}

function lineOf(src, index) {
  return src.slice(0, index).split("\n").length;
}

const files = [];
if (target) files.push(target);
else for (const r of ROOTS) walk(r, files);

const violations = [];
for (const file of files) {
  const src = readFileSync(file, "utf8");
  for (const re of [HREF_ATTR, URL_CONST]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) {
      const url = m[1];
      if (url.startsWith("/assets/")) continue;
      if (/[?&]ref=/.test(url)) continue;
      violations.push({ file, line: lineOf(src, m.index), url });
    }
  }
}

violations.sort((a, b) =>
  a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1
);

for (const v of violations) {
  console.log(`  ${v.file}:${v.line}  ${v.url}  — missing ?ref=`);
}

const n = violations.length;
console.log(
  `\nv1 ref lint — ${n} link(s) to a tracked destination without ?ref= (${files.length} file(s) scanned)`
);
if (strict && n > 0) {
  console.log(`✗ --strict: failing on ${n} untagged link(s).`);
  process.exit(1);
}
console.log("(report-only; pass --strict to fail CI on violations)");

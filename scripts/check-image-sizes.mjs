// @ts-check
/**
 * Warn when an image in public/ is over the size budget, so oversized
 * screenshots and exports are caught when they're added rather than after
 * they ship. Runs before `next build`; it only prints warnings and never
 * fails the build.
 *
 * Images that were already over budget when this check was added are listed
 * in scripts/image-size-baseline.json and skipped. Shrink one and it drops
 * off the list next time the baseline is updated.
 *
 *   node scripts/check-image-sizes.mjs                    # check
 *   node scripts/check-image-sizes.mjs --update-baseline  # rewrite the list
 */
import fs from "node:fs";
import path from "node:path";

const BUDGET_BYTES = 300 * 1024;
const PUBLIC_DIR = "public";
const BASELINE_FILE = "scripts/image-size-baseline.json";
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const oversized = walk(PUBLIC_DIR)
  .filter((file) => IMAGE_EXT.test(file))
  .map((file) => ({
    file: file.split(path.sep).join("/"),
    size: fs.statSync(file).size,
  }))
  .filter(({ size }) => size > BUDGET_BYTES)
  .sort((a, b) => a.file.localeCompare(b.file));

if (process.argv.includes("--update-baseline")) {
  fs.writeFileSync(
    BASELINE_FILE,
    JSON.stringify(
      oversized.map(({ file }) => file),
      null,
      2
    ) + "\n"
  );
  console.log(
    `check-image-sizes: wrote ${oversized.length} files to ${BASELINE_FILE}`
  );
  process.exit(0);
}

const baseline = new Set(
  fs.existsSync(BASELINE_FILE)
    ? JSON.parse(fs.readFileSync(BASELINE_FILE, "utf8"))
    : []
);
const fresh = oversized.filter(({ file }) => !baseline.has(file));

if (fresh.length === 0) {
  console.log("check-image-sizes: no new images over 300 KB");
} else {
  const kb = (/** @type {number} */ n) => `${Math.round(n / 1024)} KB`;
  console.warn(
    `\nWarning (check-image-sizes): ${fresh.length} image(s) over 300 KB. Large ` +
      `images slow pages down. Resize to the size it's shown at (2x for ` +
      `retina is plenty), compress it (e.g. https://squoosh.app), or use ` +
      `MP4 instead of an animated GIF:\n` +
      fresh.map(({ file, size }) => `  - ${file} (${kb(size)})`).join("\n") +
      "\n"
  );
}

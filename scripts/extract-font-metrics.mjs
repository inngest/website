import { readFile, writeFile } from "node:fs/promises";
import { fromBuffer } from "@capsizecss/unpack";

/*
 * Extracts OpenType metrics (capHeight, ascent, descent, lineGap, unitsPerEm,
 * xHeight) from each v1 font and writes them to utils/v1/font-metrics.json.
 *
 * Run once after replacing any font file:
 *   node scripts/extract-font-metrics.mjs
 *
 * The JSON output is consumed by scripts/generate-typography-tokens.mjs to
 * compute Capsize trim margins for each typography utility.
 */

const FONTS_DIR = "/Users/mohammed/Projects/Inngest/Assets/Inngest Fonts";

const SOURCES = {
  circularXX: `${FONTS_DIR}/Circular/CircularXX/CircularXX - Latin - Desktop Fonts/OpenType OTF/Fonts/CircularXX-Regular.otf`,
  circularXXMono: `${FONTS_DIR}/Circular/CircularXX Mono/CircularXX Mono - Latin - Desktop Fonts/OpenType OTF/Fonts/CircularXXMono-Regular.otf`,
  whyte: `${FONTS_DIR}/WHYTE/Whyte/ABCWhyte-Regular.otf`,
  whyteInktrap: `${FONTS_DIR}/WHYTE/Whyte Inktrap/ABCWhyteInktrap-Regular.otf`,
  whyteMono: `${FONTS_DIR}/WHYTE/Whyte Mono/ABCWhyteMono-Regular.otf`,
};

const metrics = {};
for (const [key, path] of Object.entries(SOURCES)) {
  const buffer = await readFile(path);
  const m = await fromBuffer(buffer);
  metrics[key] = {
    familyName: m.familyName,
    capHeight: m.capHeight,
    ascent: m.ascent,
    descent: m.descent,
    lineGap: m.lineGap,
    unitsPerEm: m.unitsPerEm,
    xHeight: m.xHeight,
  };
  console.log(
    `✓ ${key}: ${m.familyName} (UPM ${m.unitsPerEm}, cap ${m.capHeight})`
  );
}

const outPath = new URL("../utils/v1/font-metrics.json", import.meta.url);
await writeFile(outPath, JSON.stringify(metrics, null, 2) + "\n");
console.log(`\n✓ Wrote ${outPath.pathname}`);

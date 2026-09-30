import type { CSSProperties } from "react";

/**
 * The dissolving right edge of the blue headline band: a column of square
 * "pixels" that thins out from solid blue into the page, with a scatter of
 * near-black squares punched through it.
 *
 * The pattern comes from a seeded PRNG, so it's identical on the server
 * and the client (no hydration mismatch) and never reshuffles between
 * renders. It's drawn once at a fixed pixel size and clipped to the band's
 * height by the parent, so the squares stay crisp at any band height.
 */

const CELL = 14;
/** Columns drawn over the solid band, where only dark holes appear. */
const INNER_COLS = 4;
/** Columns past the solid edge, where the blue thins out. */
const OUTER_COLS = 8;
/** Enough rows for the tallest band (mobile, 4-line headline). */
const ROWS = 64;

export const PIXEL_EDGE_INNER_WIDTH = INNER_COLS * CELL;
export const PIXEL_EDGE_WIDTH = (INNER_COLS + OUTER_COLS) * CELL;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Cell = { x: number; y: number; fill: "blue" | "dark" };

function buildCells(seed: number): Cell[] {
  const rand = mulberry32(seed);
  const cells: Cell[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < INNER_COLS + OUTER_COLS; col++) {
      const x = col * CELL;
      const y = row * CELL;
      const r = rand();
      if (col < INNER_COLS) {
        // Over the solid band: occasional dark holes, more of them the
        // closer they sit to the edge.
        const holeChance = 0.03 + (col / INNER_COLS) * 0.12;
        if (r < holeChance) cells.push({ x, y, fill: "dark" });
        continue;
      }
      // Past the edge: blue density falls off steeply, with dark squares
      // mixed in through the middle of the fade.
      const t = (col - INNER_COLS + 0.5) / OUTER_COLS; // 0 → 1
      const blueChance = Math.pow(1 - t, 1.6) * 0.95;
      const darkChance = 0.14 * Math.sin(Math.PI * Math.min(t * 1.4, 1));
      if (r < blueChance) cells.push({ x, y, fill: "blue" });
      else if (r < blueChance + darkChance) cells.push({ x, y, fill: "dark" });
    }
  }
  return cells;
}

const CELLS = buildCells(20260930);

export default function PixelEdge({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div aria-hidden="true" className={className} style={style}>
      <svg
        width={PIXEL_EDGE_WIDTH}
        height={ROWS * CELL}
        viewBox={`0 0 ${PIXEL_EDGE_WIDTH} ${ROWS * CELL}`}
        shapeRendering="crispEdges"
        className="block"
      >
        {CELLS.map((cell) => (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x}
            y={cell.y}
            width={CELL}
            height={CELL}
            className={
              cell.fill === "blue" ? "fill-v1-accent-blue" : "fill-black"
            }
          />
        ))}
      </svg>
    </div>
  );
}

// Shared animation primitives. Kept framework-agnostic — no React imports.

export type Vec2 = { x: number; y: number };
export type Vec3 = { x: number; y: number; z: number };

export type FormationPoint = { x: number; y: number; z?: number };
export type Formation = readonly FormationPoint[];

export type Particle = {
  x: number; y: number; z: number;      // current position (world)
  vx: number; vy: number;                // velocity (only active when disturbed)
  energy: number;                        // 0..1, decays after cursor repel
  spring: number;                        // per-particle spring k (for jello)
  ease: number;                          // per-particle lerp rate (for drift)
  size: number;                          // base dot size
  dotColor: string;                      // pre-baked `hsl(...)` for hot-loop fillStyle
  // Letter-particle extras (set only for first letterCount particles)
  char: string;
  typeIndex: number;                     // global keystroke index (incl. whitespace)
  funcIndex: number;                     // -1 for non-letters, else 0..N
  isTitle: boolean;
  isCursor: boolean;
  bodyLocalIdx: number;                  // position within a function body
  bulletCycleIdx: number;                // -1 for non-bullets, else 0..N-1
  // Reference to a LetterChar index. For letter particles, set to the
  // particle's own index (it IS the letter); for outline dots, pinned
  // to a random letter so the dot traces that glyph's outline.
  linkedLetterIdx: number;
  // Glyph-outline offset for outline dots. Always 0 for letters.
  jitterX: number;
  jitterY: number;
};

export type LetterChar = {
  char: string;
  x: number;                             // center x, stable across states
  y: number;                             // default y (state 0) — convenience
  yByState: readonly number[];           // absolute y per activeFunc state
  yCollapsed: number;                    // y when no function is open (titles stack tight; body chars live inside their title)
  typeIndex: number;
  funcIndex: number;
  isTitle: boolean;
  bodyLocalIdx: number;                  // -1 for titles
  pixelOffsets: readonly { dx: number; dy: number }[]; // glyph outline pixels
};

export type TypedCodeFormation = {
  chars: readonly LetterChar[];
  fontPx: number;
  typeIndexTotal: number;
};

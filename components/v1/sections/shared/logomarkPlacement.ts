/**
 * Legacy "design" placement of the {@link InngestLogoCanvas} logomark
 * watermark — the full-bleed right-overflow used by Quote, Customers,
 * and BackgroundJobs (formerly `anchor="design"`).
 *
 * In the 1440 design the logomark ink sat at left X 957 (= 66.46%) with
 * width 664.8 (= 46.17%). Pass these to `width` + `x` with `originX={0}`
 * to reproduce it at any canvas size — both are proportional, so they
 * scale correctly even for the small fixed-size Customers canvas.
 *
 *   <InngestLogoCanvas
 *     width={LOGOMARK_DESIGN_WIDTH}
 *     x={LOGOMARK_DESIGN_X}
 *     originX={0}
 *   />
 *
 * Kept in a standalone module (no component code) so callers — incl.
 * the one that `dynamic()`-imports the canvas — can use these without
 * bundling the canvas runtime.
 */
export const LOGOMARK_DESIGN_WIDTH = "46.17%"; // 664.8 / 1440
export const LOGOMARK_DESIGN_X = "66.46%"; //     957.0 / 1440

/**
 * Mobile-only ambient particle layer for the hero. Pure CSS — no
 * canvas, no JS animation loop. Desktop runs the full HeroCodeScene
 * canvas instead; this keeps the "particles floating" feel on phones
 * where the canvas scene is too expensive.
 *
 * Positions are hardcoded (not Math.random) so SSR + client agree.
 */

// Salmon — matches the desktop scene's particle colour.
const DOT_COLOR = "rgb(251, 85, 54)";

// [xPct, yPct, sizePx, animDurationS, animDelayS, minOpacity, maxOpacity]
const DOTS: ReadonlyArray<readonly [number, number, number, number, number, number, number]> = [
  [6, 8, 2, 7, 0, 0.15, 0.5],
  [14, 22, 1, 9, 1.2, 0.1, 0.4],
  [22, 5, 2, 8, 2.5, 0.2, 0.55],
  [30, 38, 1, 11, 0.4, 0.1, 0.35],
  [38, 14, 2, 8, 1.8, 0.2, 0.6],
  [46, 28, 1, 10, 3, 0.1, 0.4],
  [54, 6, 1, 9, 0.8, 0.15, 0.5],
  [62, 42, 2, 7, 2, 0.2, 0.65],
  [70, 18, 1, 11, 1.5, 0.1, 0.4],
  [78, 32, 2, 8, 0.3, 0.2, 0.55],
  [86, 10, 1, 9, 2.8, 0.1, 0.4],
  [94, 24, 2, 10, 1, 0.2, 0.6],
  [4, 48, 1, 8, 1.7, 0.1, 0.4],
  [12, 60, 2, 11, 0.6, 0.2, 0.55],
  [20, 74, 1, 9, 2.2, 0.1, 0.4],
  [28, 56, 2, 8, 0.9, 0.25, 0.65],
  [36, 80, 1, 10, 1.4, 0.1, 0.4],
  [44, 64, 2, 9, 2.6, 0.2, 0.55],
  [52, 88, 1, 11, 0.2, 0.1, 0.4],
  [60, 70, 2, 8, 1.9, 0.2, 0.6],
  [68, 84, 1, 10, 1.1, 0.1, 0.4],
  [76, 58, 2, 9, 2.4, 0.2, 0.55],
  [84, 76, 1, 11, 0.5, 0.1, 0.4],
  [92, 64, 2, 8, 1.6, 0.2, 0.6],
  [8, 92, 1, 10, 2.3, 0.1, 0.4],
  [40, 94, 2, 9, 0.7, 0.2, 0.55],
  [72, 92, 1, 11, 1.3, 0.1, 0.4],
  [16, 36, 1, 8, 2.7, 0.15, 0.5],
  [56, 50, 1, 10, 0.1, 0.15, 0.5],
  [88, 44, 1, 9, 2.1, 0.15, 0.5],
];

export default function HeroAmbientDots({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-v1-backdrop overflow-hidden ${className ?? ""}`}
    >
      {DOTS.map(([x, y, size, duration, delay, minOp, maxOp], i) => (
        <span
          key={i}
          className="absolute block rounded-full motion-reduce:hidden"
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: DOT_COLOR,
              animation: `v1-hero-dot-drift ${duration}s ease-in-out ${delay}s infinite`,
              opacity: minOp,
              "--dot-min": minOp,
              "--dot-max": maxOp,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

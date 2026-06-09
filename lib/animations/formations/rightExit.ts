import type { FormationPoint } from '../core/types';

/**
 * Targets that lie 1.3×–1.9× the canvas width to the right AND
 * biased toward the bottom of the canvas (0.6×–1.3× the height) —
 * particles drag diagonally toward the bottom-right corner of the
 * hero as the user scrolls. Reads as the code "draining" off the
 * page rather than sliding straight off the right edge. Mild Z
 * scatter retains depth.
 */
export function rightExitFormation(count: number, W: number, H: number): FormationPoint[] {
  const pts: FormationPoint[] = [];
  const zRange = Math.min(W, H) * 0.18;
  for (let i = 0; i < count; i++) {
    pts.push({
      x: W * 1.3 + Math.random() * W * 0.6,
      y: H * 0.6 + Math.random() * H * 0.7,
      z: (Math.random() - 0.5) * 2 * zRange,
    });
  }
  return pts;
}

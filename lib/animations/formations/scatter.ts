import type { FormationPoint } from '../core/types';

export function scatterFormation(count: number, W: number, H: number): FormationPoint[] {
  const pts: FormationPoint[] = [];
  const zRange = Math.min(W, H) * 0.35;
  for (let i = 0; i < count; i++) {
    pts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      z: (Math.random() - 0.5) * 2 * zRange,
    });
  }
  return pts;
}

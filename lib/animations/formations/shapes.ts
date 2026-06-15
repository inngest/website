import type { FormationPoint } from '../core/types';

const CX_RATIO = 0.72; // formations are anchored to the right-hand column

export function sphereFormation(count: number, W: number, H: number): FormationPoint[] {
  const pts: FormationPoint[] = [];
  const R = Math.min(W * 0.5, H) * 0.32;
  const cx = W * CX_RATIO;
  const cy = H / 2;
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push({
      x: cx + Math.cos(theta) * r * R,
      y: cy + y * R * 0.9 - Math.sin(theta) * r * R * 0.05,
    });
  }
  return pts;
}

export function cubeFormation(count: number, W: number, H: number): FormationPoint[] {
  const cx = W * CX_RATIO;
  const cy = H / 2;
  const S = Math.min(W * 0.5, H) * 0.28;
  const corners: Array<[number, number, number]> = [];
  for (let z = -1; z <= 1; z += 2)
    for (let y = -1; y <= 1; y += 2)
      for (let x = -1; x <= 1; x += 2)
        corners.push([x, y, z]);
  const edges: Array<[number, number]> = [
    [0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7],
  ];
  const perEdge = Math.floor(count / edges.length);

  const project = (x: number, y: number, z: number) => {
    const angX = -0.5, angY = 0.7;
    const cY = Math.cos(angY), sY = Math.sin(angY);
    const cX = Math.cos(angX), sX = Math.sin(angX);
    const x1 = x * cY + z * sY;
    const z1 = -x * sY + z * cY;
    const y1 = y * cX - z1 * sX;
    return { x: cx + x1 * S, y: cy + y1 * S };
  };

  const pts: FormationPoint[] = [];
  for (const [a, b] of edges) {
    const A = corners[a], B = corners[b];
    for (let i = 0; i < perEdge; i++) {
      const t = i / Math.max(1, perEdge - 1);
      pts.push(project(
        A[0] + (B[0] - A[0]) * t,
        A[1] + (B[1] - A[1]) * t,
        A[2] + (B[2] - A[2]) * t,
      ));
    }
  }
  while (pts.length < count) pts.push(pts[pts.length - 1]);
  return pts.slice(0, count);
}

export function torusFormation(count: number, W: number, H: number): FormationPoint[] {
  const cx = W * CX_RATIO;
  const cy = H / 2;
  const R = Math.min(W * 0.5, H) * 0.28;
  const r = R * 0.35;
  const pts: FormationPoint[] = [];
  const tilt = 0.9;
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2 * 7;
    const v = (i / count) * Math.PI * 2 * 23;
    const x3 = (R + r * Math.cos(v)) * Math.cos(u);
    const y3 = r * Math.sin(v);
    const z3 = (R + r * Math.cos(v)) * Math.sin(u);
    pts.push({ x: cx + x3, y: cy + y3 * ct - z3 * st });
  }
  return pts;
}

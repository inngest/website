export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const smoothstep = (t: number): number => t * t * (3 - 2 * t);

export const clamp01 = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t);

/** Fisher–Yates partial shuffle — returns up to n distinct items. */
export function pickN<T>(arr: readonly T[], n: number): T[] {
  if (arr.length === 0) return [];
  if (arr.length <= n) {
    const out = arr.slice();
    while (out.length < n) out.push(arr[Math.floor(Math.random() * arr.length)]);
    return out;
  }
  const copy = arr.slice();
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

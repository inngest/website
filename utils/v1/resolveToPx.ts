// Resolves a `<length-percentage>`-style value to absolute CSS pixels.
// The number-is-px convention matches React component libs (Tailwind,
// MUI, Radix, Framer Motion) and CSS itself, where bare numbers are
// rejected and the unit must be explicit on strings.
//
// Accepts:
//   - `number`     — absolute CSS pixels
//   - `"NNpx"`     — same, as a string
//   - bare `"NN"`  — same, as a string (lenient — same as `"NNpx"`)
//   - `"NN%"`      — percentage of `extent`
//
// Anything else returns `fallback` and warns in dev — keeps a typo
// from silently shifting the canvas.

const PX_OR_BARE = /^(-?\d+(?:\.\d+)?)(?:px)?$/;
const PCT = /^(-?\d+(?:\.\d+)?)%$/;

export interface ResolveToPxOptions {
  /** Returned when `value` is `undefined` or unparseable. */
  fallback?: number;
  /** Used in the dev warning so multiple call sites can be told apart. */
  label?: string;
}

export function resolveToPx(
  value: number | string | undefined,
  extent: number,
  { fallback = 0, label = "resolveToPx" }: ResolveToPxOptions = {},
): number {
  if (value === undefined) return fallback;
  if (typeof value === "number") return value;
  const trimmed = value.trim();
  const pctMatch = PCT.exec(trimmed);
  if (pctMatch) return (parseFloat(pctMatch[1]) / 100) * extent;
  const pxMatch = PX_OR_BARE.exec(trimmed);
  if (pxMatch) return parseFloat(pxMatch[1]);
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[${label}] Unsupported length value "${value}". Use a number, "NNpx", or "NN%".`,
    );
  }
  return fallback;
}

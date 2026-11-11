import type { ReactNode } from "react";

/**
 * A visible placeholder for a screenshot that can't be taken yet, for example
 * because the feature isn't built. Describe the screenshot in `children`.
 */
export function ScreenshotNeeded({ children }: { children: ReactNode }) {
  return (
    <div
      role="note"
      className="not-prose my-6 flex items-center gap-2 rounded-lg border border-dashed border-carbon-300 px-4 py-3 text-xs leading-relaxed text-subtle dark:border-carbon-600"
    >
      <span className="shrink-0 rounded bg-canvasSubtle px-1.5 py-0.5 font-semibold uppercase tracking-wide text-muted">
        Screenshot needed
      </span>
      <span>{children}</span>
    </div>
  );
}

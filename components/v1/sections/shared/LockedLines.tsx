import { Fragment, type ReactNode } from "react";

/**
 * Renders a string array as separate `block whitespace-nowrap`
 * spans so the designer-locked line breaks land exactly where
 * specified at every viewport above the chosen breakpoint. Below
 * the breakpoint (default `lg`) the spans collapse to inline flow
 * for natural wrap.
 *
 * Below-breakpoint trailing spaces between lines are preserved so
 * the inline flow reads correctly when wrapping naturally.
 */
export function LockedLines({
  lines,
  breakpoint = "lg",
}: {
  lines: readonly string[];
  /** Tailwind breakpoint at which the locked breaks kick in. */
  breakpoint?: "sm" | "md" | "lg" | "xl";
}): ReactNode {
  const cls = `${breakpoint}:block ${breakpoint}:whitespace-nowrap`;
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          <span className={cls}>{line}</span>
          {i < lines.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}

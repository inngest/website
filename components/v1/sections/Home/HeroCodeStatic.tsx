"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "src/utils/v1/cn";

/**
 * Mobile-only renderer for the hero code blocks. Takes the same
 * `HERO_CODE` string the canvas consumes and lays it out as an
 * accordion — all three section labels stay visible at once, only the
 * active section's code body is expanded. Mirrors the desktop scene's
 * interaction model:
 *  - Auto-cycle plays ONE pass and freezes on the last section
 *    (instead of looping forever), matching the desktop stop-at-end.
 *  - Every label row is a button; tapping a section makes it active
 *    and cancels any remaining auto-cycle ticks (user takeover wins).
 *
 * Height transition uses the CSS-grid `grid-template-rows: 0fr ↔ 1fr`
 * pattern so it works with content of arbitrary height without a
 * max-height ceiling.
 */

interface Section {
  label: string;
  body: string;
}

// Matches `bulletCycleMs` in HeroCodeScene so the rhythm on mobile
// reads the same as the desktop scene's bullet cycle.
const CYCLE_MS = 4200;

/**
 * Splits `HERO_CODE` on the `■ <fn>()` markers. Each section is the
 * label (without the bullet glyph) plus the code block that follows
 * it, with trailing whitespace + the canvas-only `|` cursor sentinel
 * trimmed away.
 */
function parseSections(code: string): Section[] {
  const lines = code.split("\n");
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    if (line.startsWith("■ ")) {
      if (current) sections.push(current);
      current = { label: line.slice(2).trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    }
  }
  if (current) sections.push(current);

  return sections.map(({ label, body }) => ({
    label,
    body: body.replace(/\|$/m, "").trimEnd(),
  }));
}

export default function HeroCodeStatic({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const sections = parseSections(code);
  const [active, setActive] = useState(0);
  // Once the user taps a row, the auto-cycle stops entirely so tapping
  // doesn't fight with the timer.
  const userTookOverRef = useRef(false);

  useEffect(() => {
    if (sections.length < 2) return;
    const id = setInterval(() => {
      if (userTookOverRef.current) return;
      setActive((i) => {
        // Stop at the last section instead of wrapping back to 0.
        if (i >= sections.length - 1) {
          clearInterval(id);
          return i;
        }
        return i + 1;
      });
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [sections.length]);

  return (
    // `min-h` pins the container to roughly the height of the tallest
    // section so the hero section's total height doesn't bob as the
    // accordion cycles. The value targets step.run()'s body on a
    // narrow phone; adjust if the snippets change.
    <div className={cn("flex min-h-[300px] flex-col", className)}>
      {sections.map((section, i) => {
        const expanded = i === active;
        return (
          <div key={section.label}>
            {/* Label row — always visible, tappable. `■` switches to
                salmon only on the active row (mirrors the desktop
                scene's bullet pulse); inactive rows render the glyph in
                the muted frost colour. Tapping makes the row active and
                halts the auto-cycle. */}
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => {
                userTookOverRef.current = true;
                setActive(i);
              }}
              className="pointer-events-auto flex w-full items-center gap-2 py-0.5 text-left font-mono text-[13px] text-v1-frost"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "motion-safe:transition-colors motion-safe:duration-300",
                  expanded ? "text-v1-accent-salmon" : "text-v1-frost/40",
                )}
              >
                ■
              </span>
              {section.label}
            </button>
            {/* Accordion body. Outer div animates grid-template-rows
                from 0fr → 1fr; inner wrapper has overflow-hidden so
                children get clipped during the transition. */}
            <div
              aria-hidden={expanded ? undefined : true}
              className="grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-500 motion-safe:ease-out"
              style={{
                gridTemplateRows: expanded ? "1fr" : "0fr",
                opacity: expanded ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <pre className="overflow-x-auto whitespace-pre py-2 text-[12px] leading-[1.5] text-v1-frost/75 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <code className="font-mono">{section.body}</code>
                </pre>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

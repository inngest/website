"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/utils/v1/hooks/useInView";
import { cn } from "@/utils/v1/cn";
import { RUN, type RunEntryState } from "@/components/v1/sections/LongRun/data";

/**
 * The campaign's technical proof, played as a run log: steps land one by
 * one, the write step fails, that step alone retries, and the run
 * finishes. Nothing above the failure replays — which is the whole point,
 * and why the entries that already landed stay put when the failure
 * arrives.
 *
 * Plays when it scrolls into view and replays on re-entry, so someone
 * scrolling back up sees it again rather than a static end state.
 * `prefers-reduced-motion: reduce` renders the completed log immediately.
 *
 * Swappable: if a richer interactive demo replaces this, it needs to keep
 * the two facts the surrounding copy asserts — the run doesn't restart,
 * and finished work isn't repeated.
 */

// Per-entry cadence. Slow enough to read a line before the next lands,
// quick enough that the whole run plays inside a scroll pause.
const STEP_MS = 620;

const STATE_STYLES: Record<RunEntryState, { mark: string; tone: string }> = {
  ok: { mark: "✓", tone: "text-v1-primary-intense" },
  fail: { mark: "✕", tone: "text-v1-accent-salmon" },
  // The retry line is in-flight, not a result — no glyph, muted.
  retry: { mark: "↻", tone: "text-v1-frost/55" },
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export default function RunTimeline() {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: "-15% 0px" });
  const reduced = usePrefersReducedMotion();
  // How many entries have landed. Starts empty and fills while in view;
  // resets on exit so the run replays next time it's scrolled to.
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduced) {
      setShown(RUN.length);
      return;
    }
    if (!inView) {
      setShown(0);
      return;
    }
    const timer = setInterval(() => {
      setShown((n) => {
        if (n >= RUN.length) {
          clearInterval(timer);
          return n;
        }
        return n + 1;
      });
    }, STEP_MS);
    return () => clearInterval(timer);
  }, [inView, reduced]);

  return (
    <div
      ref={ref}
      // The log is decorative narration of the copy beside it; a screen
      // reader gets the same facts from the section's prose, so the
      // partially-drawn list isn't announced line by line.
      aria-hidden="true"
      className="w-full overflow-hidden rounded-lg border border-v1-subtle bg-v1-codeEditor"
    >
      <div className="flex items-center gap-2 border-b border-v1-subtle px-5 py-3">
        <span className="block h-[9px] w-[9px] rounded-full bg-v1-accent-salmon" />
        <span className="text-v1-label-sm uppercase text-v1-frost/55">
          deep-research · run log
        </span>
      </div>

      <ol className="flex list-none flex-col gap-1 p-5 pl-5">
        {RUN.map((entry, i) => {
          const landed = i < shown;
          const s = STATE_STYLES[entry.state];
          return (
            <li
              key={`${entry.at}-${entry.label}`}
              className={cn(
                "flex list-none items-baseline gap-4 text-v1-code",
                // Entries hold their space from the start so nothing
                // below shifts as the run plays — the log fills in, it
                // doesn't grow.
                "motion-safe:transition-opacity motion-safe:duration-300",
                landed ? "opacity-100" : "opacity-0",
              )}
            >
              <span className="shrink-0 tabular-nums text-v1-frost/45">
                {entry.at}
              </span>
              <span
                className={cn(
                  "flex-1",
                  entry.state === "fail"
                    ? "text-v1-accent-salmon"
                    : "text-v1-frost/85",
                )}
              >
                {entry.label}
              </span>
              <span className={cn("shrink-0", s.tone)}>{s.mark}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

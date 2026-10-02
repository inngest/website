"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/utils/v1/cn";

/**
 * Static hero code block with an execution trace playing over it.
 *
 * Replaces the auto-scrolling reel: the snippet holds still so it can
 * be read, and the motion is confined to the three `step.run` calls,
 * which light up in order as if the function were running — step 1
 * completes, step 2 fails once and retries (the `retries: 3` in the
 * config doing its job), step 3 completes — then the trace holds and
 * replays. The active step lights up as a whole block (editor-style
 * row wash + left bar) and a status pill names the state — in a gutter
 * to the LEFT of the code on desktop (like a debugger's margin), never
 * over the code; inline after the step's `);` on small screens where
 * there is no margin to spare. The failure → retry → recovery beat is
 * the most visible thing on the screen: the headline's claim, shown.
 *
 * Each step call is reflowed onto four short lines so the code column
 * fits beside the gutter without horizontal scrolling at lg.
 *
 * Reduced motion: no timeline; every `step.run` sits in its completed
 * state with the completed pills shown, so the snippet still tells the
 * story without moving.
 */

type StepState = "idle" | "running" | "retrying" | "done";

interface Frame {
  at: number;
  steps: [StepState, StepState, StepState];
}

// One pass of the trace. `at` is ms from the start of the loop. Beats
// are long enough to read each state: run → done, run → fail → retry
// → done, run → done, then hold the completed function before replay.
const TIMELINE: Frame[] = [
  { at: 0, steps: ["running", "idle", "idle"] },
  { at: 1100, steps: ["done", "idle", "idle"] },
  { at: 1500, steps: ["done", "running", "idle"] },
  { at: 2600, steps: ["done", "retrying", "idle"] },
  { at: 3700, steps: ["done", "running", "idle"] },
  { at: 4800, steps: ["done", "done", "idle"] },
  { at: 5200, steps: ["done", "done", "running"] },
  { at: 6300, steps: ["done", "done", "done"] },
];
// ~2s hold on the finished run, then the loop restarts.
const LOOP_MS = 8500;
const ENTRY_DELAY_MS = 900;

const DONE_NOTES = ["Completed | 1.2s", "Completed | 0.9s", "Completed | 0.4s"];
const RUNNING_NOTE = "Running";
const RETRY_NOTE = "Failed | retrying 1/3";

const GREY = "#9B9B9B";
const GREEN = "#4afa7d";
const BLUE = "#4c74ee";

function Call({ children }: { children: ReactNode }) {
  return <span style={{ color: BLUE }}>{children}</span>;
}

function StepRun({ state }: { state: StepState }) {
  return (
    <span className={cn("hero-step-run", `hero-step-run--${state}`)}>
      <span className="hero-step-dot">step.</span>
      <span className="hero-step-name">run</span>
    </span>
  );
}

/**
 * Status pill — the loudest element in the trace, so the state of each
 * step is legible at a glance: Running (salmon, pulsing dot), Failed |
 * retrying (solid salmon), Completed (green). Always rendered so the
 * line never reflows; idle is invisible.
 */
function StatusPill({ state, index }: { state: StepState; index: number }) {
  const text =
    state === "done"
      ? DONE_NOTES[index]
      : state === "retrying"
      ? RETRY_NOTE
      : state === "running"
      ? RUNNING_NOTE
      : " ";
  return (
    <span
      aria-hidden="true"
      className={cn("hero-step-pill", `hero-step-pill--${state}`)}
    >
      {state === "running" && <span className="hero-step-pill-dot" />}
      {text}
    </span>
  );
}

/**
 * One step's lines, as a block so the active step can light up
 * editor-style (row wash + left bar) rather than only its keyword.
 */
function StepBlock({
  state,
  children,
}: {
  state: StepState;
  children: ReactNode;
}) {
  return (
    <span className={cn("hero-step-block", `hero-step-block--${state}`)}>
      {children}
    </span>
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function HeroCodeTrace() {
  const [reduced, setReduced] = useState(false);
  const [entered, setEntered] = useState(false);
  const [steps, setSteps] = useState<Frame["steps"]>(["idle", "idle", "idle"]);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  // Blur-in entrance (shared with the old reel's CSS), then start the
  // trace once the snippet is legible.
  useEffect(() => {
    if (reduced) {
      setEntered(true);
      setSteps(["done", "done", "done"]);
      return;
    }
    const id = window.setTimeout(() => setEntered(true), 40);
    return () => window.clearTimeout(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const timers: number[] = [];
    let loopStart = 0;

    const schedule = () => {
      for (const frame of TIMELINE) {
        timers.push(
          window.setTimeout(() => setSteps(frame.steps), loopStart + frame.at)
        );
      }
      timers.push(
        window.setTimeout(() => {
          setSteps(["idle", "idle", "idle"]);
        }, loopStart + LOOP_MS - 400)
      );
      timers.push(
        window.setTimeout(() => {
          timers.length = 0;
          loopStart = 0;
          schedule();
        }, loopStart + LOOP_MS)
      );
    };

    loopStart = ENTRY_DELAY_MS;
    schedule();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduced]);

  const [s1, s2, s3] = steps;

  return (
    <div className="hero-code-trace w-full max-w-[588px] shrink-0 lg:max-w-[640px] lg:flex-none">
      {/* lg: 176px left gutter reserved for the status pills; overflow is
          visible there so the gutter pills and the step wash (which runs
          14px past the code edge) are never clipped or scrollable. */}
      <pre
        className={cn(
          "hero-code-pre m-0 overflow-x-auto whitespace-pre font-v1Mono text-[13px] leading-[20px] [-ms-overflow-style:none] [scrollbar-width:none] lg:overflow-visible lg:pl-[176px] [&::-webkit-scrollbar]:hidden",
          entered && "hero-code-pre--in"
        )}
        style={{ color: GREY }}
        aria-label="Example Inngest function with three durable steps"
      >
        <code className="block">
          {"import { "}
          <span style={{ color: GREEN }}>copyFromURL, upload, list</span>
          {' } from "./s3-client"\n'}
          {"\n"}
          {"export default inngest.createFunction(\n"}
          {"  {\n"}
          {'    id: "import-product-images",\n'}
          {'    triggers: [{ event: "shop/product.imported" }],\n'}
          {"    retries: 3,\n"}
          {"  },\n"}
          {"  async ({ event, step }) => {\n"}
          <StepBlock state={s1}>
            {"    const uploadedImageURLs = await "}
            <StepRun state={s1} />
            {"(\n"}
            {'      "copy-images-to-s3",\n'}
            {"      async () => "}
            <Call>copyFromURL</Call>
            {"(event.data.imageURLs)\n"}
            {"    );"}
            <StatusPill state={s1} index={0} />
          </StepBlock>
          <StepBlock state={s2}>
            {"    const manifestURL = await "}
            <StepRun state={s2} />
            {"(\n"}
            {'      "save-image-manifest",\n'}
            {"      async () => "}
            <Call>upload</Call>
            {"(JSON.stringify(uploadedImageURLs))\n"}
            {"    );"}
            <StatusPill state={s2} index={1} />
          </StepBlock>
          <StepBlock state={s3}>
            {"    const files = await "}
            <StepRun state={s3} />
            {"(\n"}
            {'      "list-product-files",\n'}
            {"      async () => "}
            <Call>list</Call>
            {"(manifestURL)\n"}
            {"    );"}
            <StatusPill state={s3} index={2} />
          </StepBlock>
          {"  },\n"}
          {");"}
        </code>
      </pre>
    </div>
  );
}

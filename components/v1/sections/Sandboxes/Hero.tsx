"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import StatusTag from "@/components/v1/StatusTag";
import {
  renderTokens,
  tokenizeCode,
} from "@/components/v1/sections/shared/codeHighlight";
import { setHeroPanel, clearHeroPanel } from "@/utils/v1/heroNav";
import { tweens } from "@/utils/v1/springs";
import { cn } from "@/utils/v1/cn";
import { CHAPTERS, type Chapter, type ChapterId } from "./heroChapters";

/**
 * /platform/sandboxes hero.
 *
 * Thesis: a sandbox is a step. The stage proves it live: the function as
 * you would write it on the left, the playground's replay of a real run
 * of that function on the right, and each step's lines light up at the
 * moment its trace row runs, finishes, is replayed from memory after a
 * crash, or fails.
 *
 * The playground (inngest/sandboxes-playground) is served under
 * /try-sandboxes through a rewrite and framed in its hero embed level
 * (`?embed=hero`): trace plus outcome only, no background of its own,
 * autostart. It posts `try-sandboxes:height` (content height, flagged
 * unsettled while a run plays) and `try-sandboxes:run` (run state plus
 * every step's status), and restarts on `try-sandboxes:replay`.
 *
 * The three chapters are the playground's own sequence (Scenario 1 of 3)
 * and play through in order: when a run finishes the next chapter starts
 * after a pause, unless the viewer has chosen one or is pointing at the
 * stage. Clicking the active chapter replays it.
 */

const PRICING_URL = "/pricing?ref=sandboxes";
const DOCS_URL = "/docs/sandboxes?ref=sandboxes";

// The ivory hero band, as on /compare-to-temporal: ivory with a fine
// fractal-noise grain, ink headline, warm dark gray copy.
const IVORY = "#F3F1EA";
const INK = "#1A1A1A";
const SUBINK = "#2E2C28";
const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// In production /try-sandboxes is rewritten to the playground deployment,
// so the frame is same-origin. Local dev has no rewrite configured, so it
// falls back to the live site (cross-origin: the demo still plays, but
// the parent can't read the frame).
const PLAYGROUND_BASE =
  process.env.NEXT_PUBLIC_TRY_SANDBOXES_BASE ??
  (process.env.NODE_ENV === "development"
    ? "https://www.inngest.com/try-sandboxes"
    : "/try-sandboxes");

// The frame follows the playground's settled content height inside these
// bounds; past the max the playground keeps its newest rows in view.
const FRAME_MIN_H = 420;
const FRAME_MAX_H = 560;
// Pause on a finished run before the next chapter starts.
const DWELL_MS = 6000;

type StepStatus =
  | "pending"
  | "running"
  | "waiting"
  | "done"
  | "memoized"
  | "failed";
interface StepReport {
  id: string;
  status: StepStatus;
  durationMs?: number;
}
type RunState = "idle" | "running" | "complete";

const entry = (delayMs: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { ...tweens.entry, delay: delayMs / 1000 },
});

/**
 * Status of a code line's step. CI lines name a job and match every step
 * under it (`lint › node lint.mjs`), so statuses are folded: anything
 * running wins, then a failure, done once every step seen is done, and a
 * job with some steps done and more to come is in progress.
 */
function stepStatus(key: string, steps: StepReport[]) {
  const matches = steps.filter(
    (s) => s.id === key || s.id.startsWith(`${key} `)
  );
  if (matches.length === 0) return { status: "pending" as const };
  if (matches.length === 1) return matches[0];
  if (matches.some((s) => s.status === "running" || s.status === "waiting"))
    return { status: "running" as const };
  if (matches.some((s) => s.status === "failed"))
    return { status: "failed" as const };
  if (matches.every((s) => s.status === "done" || s.status === "memoized"))
    return { status: "done" as const };
  if (matches.some((s) => s.status === "done" || s.status === "memoized"))
    return { status: "running" as const };
  return { status: "pending" as const };
}

// Only the states the trace cannot put into words get a label: the
// crash ("Retrying") and the retry skipping saved steps ("Replayed").
const EXCEPTION_PILL: Partial<
  Record<StepStatus, { text: string; className: string }>
> = {
  failed: { text: "Retrying", className: "bg-v1-accent-salmon text-white" },
  memoized: {
    text: "Replayed",
    className:
      "bg-v1-frost/[0.12] text-v1-frost [box-shadow:inset_0_0_0_1px_rgb(var(--color-v1-frost)/0.35)]",
  },
};

/** The function, in full, with each step's lines lit by the playground's report. */
function CodePane({
  chapter,
  steps,
}: {
  chapter: Chapter;
  steps: StepReport[];
}) {
  // Group consecutive lines of the same step so the pill sits once, on
  // the group's first line, and the wash covers the whole call.
  const groups = useMemo(() => {
    const out: { step?: string; lines: Chapter["code"] }[] = [];
    for (const line of chapter.code) {
      const last = out[out.length - 1];
      if (last && last.step === line.step && line.step) last.lines.push(line);
      else out.push({ step: line.step, lines: [line] });
    }
    return out;
  }, [chapter]);

  return (
    <div className="flex h-full min-w-0 flex-col">
      {/* File label: lowercase and quiet, so it reads as a filename and
          not as a third row of tabs under the chapter bar. */}
      <div className="flex h-10 shrink-0 items-center px-4 font-v1Mono text-[11px] lowercase tracking-normal text-v1-frost/45 sm:px-5">
        {chapter.file}
      </div>
      <pre className="scrollbar-none relative min-w-0 flex-1 overflow-x-auto pb-4 pt-1 font-v1Mono text-[12px] leading-[20px] text-v1-frost/90">
        {groups.map((g, gi) => {
          const st = g.step ? stepStatus(g.step, steps) : null;
          const status = st?.status ?? "pending";
          const lit = status !== "pending";
          return (
            <div
              key={gi}
              className={cn(
                "relative grid grid-cols-[36px_minmax(0,1fr)] pr-4 motion-safe:transition-colors motion-safe:duration-500",
                status === "running" || status === "waiting"
                  ? "bg-v1-frost/[0.05]"
                  : status === "failed"
                  ? "bg-v1-accent-salmon/[0.08]"
                  : ""
              )}
            >
              {/* Gutter: a dot per step, aligned with its first line. The
                  trace next door carries status and duration in full. */}
              <div className="flex items-start justify-center">
                {st && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-[7px] inline-block h-1.5 w-1.5 rounded-full motion-safe:transition-colors motion-safe:duration-500",
                      status === "running" || status === "waiting"
                        ? "bg-v1-accent-blue motion-safe:animate-pulse"
                        : status === "done" || status === "memoized"
                        ? "bg-[rgb(var(--color-v1-status-completed-text))]"
                        : status === "failed"
                        ? "bg-v1-accent-salmon"
                        : "bg-v1-frost/20"
                    )}
                  />
                )}
              </div>
              {/* Exceptional state, at the end of the step's first line. */}
              {st && EXCEPTION_PILL[status] && (
                <span
                  className={cn(
                    "absolute right-3 top-[1px] inline-flex h-[18px] items-center rounded-full px-2 text-[10px] uppercase leading-none tracking-[0.06em] motion-safe:animate-v1-nav-pop",
                    EXCEPTION_PILL[status].className
                  )}
                >
                  {EXCEPTION_PILL[status].text}
                </span>
              )}
              <div
                className={cn(
                  "min-w-0 motion-safe:transition-opacity motion-safe:duration-500",
                  g.step && !lit && steps.length > 0 ? "opacity-60" : ""
                )}
              >
                {g.lines.map((line, li) => (
                  <div key={li} className="whitespace-pre">
                    {renderTokens(tokenizeCode(line.text))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

export default function Hero() {
  const [chapterId, setChapterId] = useState<ChapterId>("create");
  const [frameH, setFrameH] = useState(FRAME_MIN_H);
  const [loaded, setLoaded] = useState(false);
  const [runState, setRunState] = useState<RunState>("idle");
  const [steps, setSteps] = useState<StepReport[]>([]);
  // The viewer picked a chapter: stop advancing on their behalf.
  const [manual, setManual] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [reduced, setReduced] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const uncoverTimer = useRef<number | undefined>(undefined);

  const chapter = useMemo(
    () => CHAPTERS.find((c) => c.id === chapterId) ?? CHAPTERS[0],
    [chapterId]
  );
  const frameSrc = `${PLAYGROUND_BASE}/${chapter.id}?embed=hero`;
  const fullHref = `/try-sandboxes/${chapter.id}?ref=sandboxes-hero`;

  // Tell the fixed header there is an ivory panel under it (see heroNav).
  useEffect(() => {
    const token = {};
    setHeroPanel("ivory", token);
    return () => clearHeroPanel(token);
  }, []);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Messages from the playground: content height and run state.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      // The frame is in the server-rendered HTML, so its load event can
      // fire before React attaches onLoad; any message from it means it
      // has painted.
      setLoaded(true);
      const d = e.data as {
        type?: string;
        height?: number;
        settled?: boolean;
        state?: RunState;
        steps?: StepReport[];
      } | null;
      if (d?.type === "try-sandboxes:height" && typeof d.height === "number") {
        // Unsettled reports arrive while a run plays and the trace adds a
        // row every few hundred ms; skip them, and only grow within one
        // load, so the frame moves once when the run finishes.
        if (d.settled === false) return;
        const next = Math.round(
          Math.min(FRAME_MAX_H, Math.max(FRAME_MIN_H, d.height))
        );
        setFrameH((h) => Math.max(h, next));
      } else if (d?.type === "try-sandboxes:run" && d.state) {
        setRunState(d.state);
        setSteps(Array.isArray(d.steps) ? d.steps : []);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const select = (id: ChapterId) => {
    if (id === chapterId) return;
    window.clearTimeout(uncoverTimer.current);
    setLoaded(false);
    setFrameH(FRAME_MIN_H);
    setRunState("idle");
    setSteps([]);
    setChapterId(id);
  };

  const replay = () => {
    frameRef.current?.contentWindow?.postMessage(
      { type: "try-sandboxes:replay" },
      "*"
    );
  };

  // Play the chapters through: when a run finishes, dwell, then advance.
  useEffect(() => {
    if (runState !== "complete" || manual || hovering || reduced) return;
    const t = window.setTimeout(() => {
      const i = CHAPTERS.findIndex((c) => c.id === chapterId);
      select(CHAPTERS[(i + 1) % CHAPTERS.length].id);
    }, DWELL_MS);
    return () => window.clearTimeout(t);
    // `select` only reads state captured here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runState, manual, hovering, reduced, chapterId]);

  const progress =
    steps.length === 0
      ? 0
      : steps.filter((s) => s.status === "done" || s.status === "memoized")
          .length / steps.length;

  return (
    <section
      aria-labelledby="sandboxes-hero-headline"
      className="relative w-full overflow-hidden"
    >
      {/* Ivory panel behind the hero; the stage breaks out of its bottom
          edge onto the dark canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[200px] top-0 overflow-hidden lg:bottom-[260px]"
        style={{ backgroundColor: IVORY }}
      >
        <span
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{ backgroundImage: NOISE_BG, opacity: 0.45 }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col px-6 pb-16 pt-[104px] sm:px-9 lg:px-8 lg:pb-24 lg:pt-[120px]">
        {/* Copy and CTAs, centred */}
        <div className="mx-auto flex w-full max-w-[1040px] flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <motion.div
              {...entry(0)}
              className="text-v1-label-md flex flex-wrap items-center justify-center gap-x-3 gap-y-2 uppercase"
              style={{ color: SUBINK }}
            >
              <span>Sandboxes</span>
              <StatusTag size="md" tone="accent">
                Open beta
              </StatusTag>
            </motion.div>
            <h1
              id="sandboxes-hero-headline"
              className="text-v1-display-xs uppercase lg:leading-[0.98] lg:tracking-[-0.015em] lg:[font-size:clamp(3rem,5.4vw,5.25rem)]"
              style={{ color: INK }}
            >
              <motion.span className="block" {...entry(60)}>
                A sandbox is a step.
              </motion.span>
            </h1>
          </div>
          <motion.div
            {...entry(320)}
            className="flex flex-col items-center gap-6"
          >
            <p
              className="text-v1-body-lg max-w-[760px]"
              style={{ color: SUBINK }}
            >
              Create microVMs inside your Inngest functions. They retry, resume
              after a crash, and show up in the trace like every other step.
              Watch one run:
            </p>
            <div className="flex flex-col gap-[23px] sm:flex-row sm:items-center sm:justify-center">
              <ButtonLink
                href={PRICING_URL}
                variant="accent"
                className="!w-full sm:!w-auto"
              >
                Learn more
              </ButtonLink>
              <ButtonLink
                href={DOCS_URL}
                variant="secondaryLight"
                className="!w-full sm:!w-auto"
              >
                Read the docs
              </ButtonLink>
            </div>
          </motion.div>
        </div>

        {/* The stage: chapters on top, then the code and its live trace. */}
        <motion.div
          {...entry(440)}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          className="mt-12 flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-v1-frost/[0.14] bg-v1-surfaceBase shadow-[0_40px_120px_-40px_rgb(0_0_0/0.6)] lg:mt-16"
        >
          <div className="flex items-stretch border-b border-v1-subtle">
            <div
              role="tablist"
              aria-label="Chapters"
              className="scrollbar-none flex min-w-0 flex-1 overflow-x-auto"
            >
              {CHAPTERS.map((c, i) => {
                const active = c.id === chapterId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    title={active ? "Replay this chapter" : undefined}
                    onClick={() => {
                      setManual(true);
                      if (active) replay();
                      else select(c.id);
                    }}
                    className={cn(
                      "group/ch relative flex min-w-[7rem] flex-1 items-center gap-2.5 px-4 py-3.5 text-left focus:outline-none focus-visible:bg-v1-frost/[0.06] motion-safe:transition-colors motion-safe:duration-200 sm:px-5 lg:min-w-0",
                      i > 0 && "border-l border-v1-subtle",
                      active
                        ? "text-v1-frost"
                        : "text-v1-muted hover:bg-v1-frost/[0.03] hover:text-v1-frost"
                    )}
                  >
                    <span
                      className={cn(
                        "text-v1-label-sm tabular-nums",
                        active ? "text-v1-accent-salmon" : "text-v1-frost/40"
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="text-v1-label-sm truncate uppercase">
                      <span className="sm:hidden">{c.short}</span>
                      <span className="hidden sm:inline">{c.title}</span>
                    </span>
                    {active && (
                      <span
                        aria-hidden="true"
                        className="ml-auto hidden text-v1-frost/40 group-hover/ch:text-v1-frost lg:inline"
                      >
                        ↻
                      </span>
                    )}
                    {/* Progress: the share of this run's steps that have finished. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-v1-frost motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-v1-in",
                        active ? "opacity-100" : "opacity-0"
                      )}
                      style={{
                        transform: `scaleX(${
                          runState === "complete" ? 1 : progress
                        })`,
                      }}
                    />
                  </button>
                );
              })}
            </div>
            <a
              href={fullHref}
              title="Open the full playground"
              className="group/cta text-v1-label-sm hidden shrink-0 items-center gap-2 border-l border-v1-subtle px-5 uppercase text-v1-frost hover:bg-v1-frost/[0.03] motion-safe:transition-colors motion-safe:duration-200 md:flex"
            >
              <span className="hidden xl:inline">Full playground</span>
              <span
                aria-hidden="true"
                className="inline-block group-hover/cta:translate-x-[6px] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in"
              >
                →
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="border-b border-v1-subtle lg:border-b-0 lg:border-r">
              <CodePane key={chapter.id} chapter={chapter} steps={steps} />
            </div>
            <div className="relative" style={{ minHeight: frameH }}>
              {/* Placeholder until the frame has painted. */}
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-v1-surfaceBase",
                  // Appears at once when a chapter switches; only the
                  // uncover fades.
                  loaded
                    ? "opacity-0 motion-safe:transition-opacity motion-safe:duration-500"
                    : "opacity-100"
                )}
              >
                <span className="text-v1-label-sm uppercase text-v1-frost/40">
                  Loading the run…
                </span>
              </div>
              <iframe
                key={frameSrc}
                ref={frameRef}
                src={frameSrc}
                title={`Sandboxes playground: ${chapter.title}`}
                // The placeholder clears on the frame's first message
                // (see the message effect), not on load: the load event
                // fires while the playground still shows its full shell,
                // before it switches to embed mode. If no message comes
                // (an older playground build), the fallback uncovers it.
                onLoad={() => {
                  window.clearTimeout(uncoverTimer.current);
                  uncoverTimer.current = window.setTimeout(
                    () => setLoaded(true),
                    4000
                  );
                }}
                className="absolute inset-0 block h-full w-full bg-transparent"
                allow="clipboard-write"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

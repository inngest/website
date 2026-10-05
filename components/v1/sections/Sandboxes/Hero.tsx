"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import StatusTag from "@/components/v1/StatusTag";
import { setHeroPanel, clearHeroPanel } from "@/utils/v1/heroNav";
import { tweens } from "@/utils/v1/springs";
import { cn } from "@/utils/v1/cn";

/**
 * /platform/sandboxes hero — the real Sandboxes playground, embedded.
 *
 * The playground (inngest/sandboxes-playground) is a separate app served
 * under /try-sandboxes through a rewrite, so the same-origin iframe below
 * IS the product demo, 1:1: choose a command or a failure to inject,
 * press Run, watch the Inngest run and its trace unfold, click steps,
 * read the output, switch to the code tabs. The `?embed=1` flag asks the
 * playground to drop its own header, sidebar, page chrome and control
 * bar, start the run by itself, report its content height so the frame
 * fits without a scrollbar, and restart when this page posts
 * `try-sandboxes:replay`.
 *
 * Above the embed: a compact headline block on the brand-blue panel and
 * a segmented control that swaps which scenario the frame shows, plus a
 * link to the full playground for that scenario.
 */

const SIGNUP_URL = "/sign-up?ref=sandboxes";
const DOCS_URL = "/docs/sandboxes?ref=sandboxes";

// In production /try-sandboxes is rewritten to the playground deployment,
// so the frame is same-origin. Local dev has no rewrite configured, so it
// falls back to the live site (cross-origin: the demo still plays, but
// the parent can't read the frame).
const PLAYGROUND_BASE =
  process.env.NEXT_PUBLIC_TRY_SANDBOXES_BASE ??
  (process.env.NODE_ENV === "development"
    ? "https://www.inngest.com/try-sandboxes"
    : "/try-sandboxes");

const SCENARIOS = [
  {
    id: "create",
    label: "Create a sandbox",
    blurb:
      "Create a microVM, run a command, destroy it. Four steps, one trace.",
  },
  {
    id: "durability",
    label: "Durability",
    blurb: "Crash mid-run. Retry. Same sandbox, no lost work.",
  },
  {
    id: "ci",
    label: "CI pipeline",
    blurb:
      "One machine per job, cloned from a snapshot. Jobs that pass never rerun.",
  },
] as const;
type ScenarioId = typeof SCENARIOS[number]["id"];

const FRAME_MIN_H = 720;
const FRAME_MAX_H = 1400;

const entry = (delayMs: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { ...tweens.entry, delay: delayMs / 1000 },
});

export default function Hero() {
  const [scenario, setScenario] = useState<ScenarioId>("create");
  const [frameH, setFrameH] = useState(FRAME_MIN_H);
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const current = useMemo(
    () => SCENARIOS.find((s) => s.id === scenario) ?? SCENARIOS[0],
    [scenario]
  );
  const frameSrc = `${PLAYGROUND_BASE}/${current.id}?embed=1`;
  const fullHref = `/try-sandboxes/${current.id}?ref=sandboxes-hero`;

  // Tell the fixed header there is a blue panel under it (see heroNav).
  useEffect(() => {
    const token = {};
    setHeroPanel("blue", token);
    return () => clearHeroPanel(token);
  }, []);

  // The playground posts its content height in embed mode; size the
  // frame to it (clamped) so the demo never needs its own scrollbar.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      const d = e.data as { type?: string; height?: number } | null;
      if (d?.type !== "try-sandboxes:height" || typeof d.height !== "number")
        return;
      setFrameH(
        Math.round(Math.min(FRAME_MAX_H, Math.max(FRAME_MIN_H, d.height)))
      );
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const select = (id: ScenarioId) => {
    if (id === scenario) return;
    setLoaded(false);
    setScenario(id);
  };

  const replay = () => {
    frameRef.current?.contentWindow?.postMessage(
      { type: "try-sandboxes:replay" },
      "*"
    );
  };

  return (
    <section
      aria-labelledby="sandboxes-hero-headline"
      className="relative w-full overflow-hidden bg-v1-canvasBase"
    >
      {/* Brand-blue panel behind the headline block, edge to edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden bg-v1-accent-blue lg:h-[520px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/v1/ai-hero/grain.webp"
          alt=""
          className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover mix-blend-soft-light lg:block"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col px-6 pt-[104px] sm:px-9 lg:px-8 lg:pt-[128px]">
        {/* Headline block */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-x-16">
          <div className="flex flex-col gap-6">
            <motion.div
              {...entry(0)}
              className="text-v1-label-md flex flex-wrap items-center gap-x-3 gap-y-2 uppercase text-v1-frost"
            >
              <span className="pl-1">Sandboxes</span>
              <StatusTag size="md" tone="frost">
                Open beta
              </StatusTag>
            </motion.div>
            <h1
              id="sandboxes-hero-headline"
              className="text-v1-display-xs uppercase text-v1-frost lg:leading-[1] lg:tracking-[-0.01em] lg:[font-size:clamp(2.5rem,4vw,4rem)]"
            >
              <motion.span className="block" {...entry(60)}>
                A sandbox in your function.
              </motion.span>
              <motion.span className="block" {...entry(180)}>
                Not another service.
              </motion.span>
            </h1>
          </div>
          <motion.div {...entry(320)} className="flex flex-col gap-6 lg:pb-2">
            <p className="text-v1-body-lg max-w-[480px] !text-v1-frost">
              Your sandbox is a durable step, as easy to set up as any other.
              When it fails, or has to wait, you don&rsquo;t lose the run. Try
              it below: everything plays in your browser.
            </p>
            <div className="flex flex-col gap-[23px] sm:flex-row sm:items-center">
              <ButtonLink href={SIGNUP_URL} prefetch={false} variant="primary">
                Build for free
              </ButtonLink>
              <ButtonLink
                href={DOCS_URL}
                variant="primary"
                className="!border-v1-jetBlack !bg-v1-jetBlack !text-v1-frost !shadow-none hover:!border-v1-accent-salmon hover:!bg-v1-accent-salmon"
              >
                Read the docs
              </ButtonLink>
            </div>
          </motion.div>
        </div>

        {/* Scenario control + full-playground link */}
        <motion.div
          {...entry(440)}
          className="mt-12 flex flex-col gap-4 lg:mt-16 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="flex flex-col gap-3">
            <div
              role="tablist"
              aria-label="Playground scenarios"
              className="flex flex-wrap gap-2"
            >
              {SCENARIOS.map((s) => {
                const active = s.id === scenario;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => select(s.id)}
                    className={cn(
                      "text-v1-label-sm h-9 rounded-md border px-3 uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-frost/60 motion-safe:transition-colors motion-safe:duration-200",
                      active
                        ? "border-v1-frost bg-v1-frost text-v1-jetBlack"
                        : "border-v1-frost/50 text-v1-frost hover:border-v1-frost"
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
            <p
              key={current.id}
              className="text-v1-body-sm max-w-[560px] !text-v1-frost/80 motion-safe:animate-v1-nav-pop"
            >
              {current.blurb}
            </p>
          </div>
          <div className="text-v1-label-md flex flex-wrap items-center gap-x-6 gap-y-2 uppercase text-v1-frost">
            <button
              type="button"
              onClick={replay}
              className="group/cta inline-flex items-center gap-2 hover:opacity-70 focus:outline-none focus-visible:underline motion-safe:transition-opacity motion-safe:duration-200"
            >
              <span
                aria-hidden="true"
                className="inline-block group-hover/cta:-rotate-90 motion-safe:transition-transform motion-safe:duration-300"
              >
                ↻
              </span>
              Replay
            </button>
            <a
              href={fullHref}
              className="group/cta inline-flex w-fit items-center hover:opacity-70 motion-safe:transition-opacity motion-safe:duration-200"
            >
              Open the full playground
              <span
                aria-hidden="true"
                className="ml-2 inline-block group-hover/cta:translate-x-[6px] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in"
              >
                →
              </span>
            </a>
          </div>
        </motion.div>

        {/* The playground, embedded. The frame is the product demo. */}
        <motion.div
          {...entry(520)}
          className="relative mb-14 mt-6 overflow-hidden rounded-[10px] border border-v1-frost/[0.12] bg-v1-surfaceBase shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] lg:mb-20"
          style={{ height: frameH }}
        >
          {/* Placeholder until the frame has painted. */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center justify-center bg-v1-surfaceBase motion-safe:transition-opacity motion-safe:duration-500",
              loaded ? "opacity-0" : "opacity-100"
            )}
          >
            <span className="text-v1-label-sm uppercase text-v1-frost/40">
              Loading the playground…
            </span>
          </div>
          <iframe
            key={frameSrc}
            ref={frameRef}
            src={frameSrc}
            title={`Sandboxes playground: ${current.label}`}
            onLoad={() => setLoaded(true)}
            className="block h-full w-full"
            allow="clipboard-write"
          />
        </motion.div>
      </div>
    </section>
  );
}

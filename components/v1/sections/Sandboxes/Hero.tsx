"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import StatusTag from "@/components/v1/StatusTag";
import { setHeroPanel, clearHeroPanel } from "@/utils/v1/heroNav";
import { tweens } from "@/utils/v1/springs";
import { cn } from "@/utils/v1/cn";

/**
 * /platform/sandboxes hero — the Sandboxes playground, embedded and
 * abbreviated.
 *
 * The playground (inngest/sandboxes-playground) is a separate app served
 * under /try-sandboxes through a rewrite, so the iframe below IS the
 * product: a real Inngest run with its trace unfolding, steps you can
 * click for input/output, and the command output underneath. Its hero
 * embed level (`?embed=hero`) keeps just that — trace plus outcome — and
 * paints no background of its own, so the frame takes on this card's
 * surface instead of reading as a second app pasted onto the page. It
 * also reports its content height so the frame fits without a scrollbar,
 * starts the run by itself, and restarts when this page posts
 * `try-sandboxes:replay`.
 *
 * Everything the visitor controls lives in the card's own title bar:
 * which scenario plays, a one-line caption for it, replay, and the link
 * to the full playground. The card breaks out of the brand-blue headline
 * panel so headline and demo read as one composition.
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
    short: "Create",
    caption:
      "A microVM created, a command run, the VM destroyed. Four steps, one trace.",
  },
  {
    id: "durability",
    label: "Survive a crash",
    short: "Crash",
    caption:
      "The function dies mid-run. The retry picks up the same sandbox; no work is lost.",
  },
  {
    id: "ci",
    label: "Run a CI pipeline",
    short: "CI",
    caption:
      "One machine per job, cloned from a snapshot. Jobs that already passed never rerun.",
  },
] as const;
type ScenarioId = typeof SCENARIOS[number]["id"];

// The frame follows the playground's reported content height inside
// these bounds; past the max the playground scrolls inside the frame.
const FRAME_MIN_H = 360;
const FRAME_MAX_H = 680;

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
  const frameSrc = `${PLAYGROUND_BASE}/${current.id}?embed=hero`;
  const fullHref = `/try-sandboxes/${current.id}?ref=sandboxes-hero`;

  // Tell the fixed header there is a blue panel under it (see heroNav).
  useEffect(() => {
    const token = {};
    setHeroPanel("blue", token);
    return () => clearHeroPanel(token);
  }, []);

  // Size the frame to the playground's reported content height (clamped).
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
      {/* Brand-blue panel behind the headline; the demo card breaks out of
          its bottom edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden bg-v1-accent-blue lg:h-[600px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/v1/ai-hero/grain.webp"
          alt=""
          className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover mix-blend-soft-light lg:block"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col px-6 pt-[104px] sm:px-9 lg:px-8 lg:pt-[120px]">
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
            <p className="text-v1-body-lg max-w-[460px] !text-v1-frost">
              Your sandbox is a durable step, as easy to set up as any other.
              When it fails, or has to wait, you don&rsquo;t lose the run.
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

        {/* The demo card: title bar with the controls, then the playground. */}
        <motion.div
          {...entry(440)}
          className="mb-16 mt-10 overflow-hidden rounded-[10px] border border-v1-frost/[0.14] bg-v1-surfaceBase shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] lg:mb-24 lg:mt-14"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-v1-subtle px-4 py-3 sm:px-5">
            <div
              role="tablist"
              aria-label="Playground scenarios"
              className="inline-flex gap-1 rounded-md border border-v1-subtle bg-v1-canvasBase p-1"
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
                      "text-v1-label-sm h-8 rounded-[4px] px-3 uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-frost/60 motion-safe:transition-colors motion-safe:duration-200",
                      active
                        ? "bg-v1-frost text-v1-jetBlack"
                        : "text-v1-frost/70 hover:bg-v1-frost/10 hover:text-v1-frost"
                    )}
                  >
                    <span className="sm:hidden">{s.short}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                );
              })}
            </div>
            <p
              key={current.id}
              className="text-v1-body-sm order-last min-w-0 basis-full !text-v1-subtle motion-safe:animate-v1-nav-pop xl:order-none xl:flex-1 xl:basis-0 xl:truncate"
            >
              {current.caption}
            </p>
            <div className="text-v1-label-sm ml-auto flex items-center gap-5 uppercase text-v1-frost">
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
                className="group/cta inline-flex items-center hover:opacity-70 motion-safe:transition-opacity motion-safe:duration-200"
              >
                <span className="hidden sm:inline">Full playground</span>
                <span className="sm:hidden">Playground</span>
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block group-hover/cta:translate-x-[6px] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in"
                >
                  →
                </span>
              </a>
            </div>
          </div>

          <div
            className="relative motion-safe:transition-[height] motion-safe:duration-300 motion-safe:ease-v1-in"
            style={{ height: frameH }}
          >
            {/* Placeholder until the frame has painted. */}
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-v1-surfaceBase motion-safe:transition-opacity motion-safe:duration-500",
                loaded ? "opacity-0" : "opacity-100"
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
              title={`Sandboxes playground: ${current.label}`}
              onLoad={() => setLoaded(true)}
              className="block h-full w-full bg-transparent"
              allow="clipboard-write"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

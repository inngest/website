"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { V1_CYCLE_MS } from "@/utils/v1/springs";
import {
  onCursorSpotlightMove,
  CURSOR_SPOTLIGHT_SEED,
} from "@/utils/v1/cursorFx";
import {
  ILLUSTRATIONS,
  type IllustrationId,
} from "@/components/v1/sections/BackgroundJobs/ReliabilityIllustrations";
import { ArrowPreviewButton } from "@/components/v1/sections/shared/ArrowPreviewButton";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import MobileReelNav from "@/components/v1/sections/shared/MobileReelNav";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

/**
 * "Everything production apps require" — display headline + body, a
 * fixed-aspect illustration panel that swaps between 8 diagrams,
 * and a 4 × 2 feature grid below where every cell is a tab trigger
 * for its corresponding diagram. Active tab gets a salmon dot + full
 * white body copy; inactive tabs are carbon/300 grey-dotted with
 * muted body text.
 *
 * Navigation:
 *   - Desktop: prev/next `ArrowPreviewButton` pills pinned to the
 *     left/right edges of the illustration panel (preview the
 *     upcoming feature's title on hover).
 *   - Mobile: a `<nav>` row above the panel with two 40 × 40 chevron
 *     buttons flanking the current title (mirrors AI/UseCases'
 *     MobileNavButton pattern).
 *
 * Auto-cycles through the 8 tabs on V1_CYCLE_MS while the section
 * is in view + not hovered (same vocabulary as SeeItInAction and
 * AI/Lifecycle).
 */

interface Feature {
  id: IllustrationId;
  title: string;
  body: string;
  href: string;
}

const FEATURES: Feature[] = [
  {
    id: "retries",
    title: "Automatic retries",
    body: "Failed steps retry with configurable exponential backoff. Set max attempts per function or per individual step — no boilerplate required.",
    href: "https://www.inngest.com/docs/guides/error-handling",
  },
  {
    id: "checkpointing",
    title: "Step-level checkpointing",
    body: "When a step fails, only that step retries. Completed steps are memoized — no duplicate side effects from work that already succeeded.",
    href: "https://www.inngest.com/docs/setup/checkpointing",
  },
  {
    id: "traces",
    title: "Full run traces and logs",
    body: "Every run has a complete trace. See inputs, outputs, timing, and error details for every step — without a separate logging service.",
    href: "https://www.inngest.com/docs/platform/monitor/traces",
  },
  {
    id: "concurrency",
    title: "Concurrency and throttling",
    body: "Cap parallel executions globally or per-user/tenant with one line of config. Prevent thundering herds and protect downstream services.",
    href: "https://www.inngest.com/docs/guides/concurrency",
  },
  {
    id: "priority",
    title: "Priority queuing",
    body: "High-priority jobs run first. Assign dynamic priority based on user tier, plan, or any attribute in the event payload.",
    href: "https://www.inngest.com/docs/guides/priority#configuration-reference",
  },
  {
    id: "replay",
    title: "Bulk replay",
    body: "Deployed a bug? Re-run failed functions in bulk from the dashboard. No dead-letter queues to drain. No scripts to write.",
    href: "https://www.inngest.com/docs/platform/replay",
  },
  {
    id: "devServer",
    title: "Local dev server",
    body: "Run npx inngest-cli dev for a local UI with real-time traces, event payloads, and step outputs. No cloud account needed.",
    href: "https://www.inngest.com/docs/local-development",
  },
  {
    id: "typescript",
    title: "TypeScript-native",
    body: "Define event payload types once. End-to-end type safety from the event sender all the way into your function body.",
    href: "https://www.inngest.com/docs/reference/typescript/v4/intro",
  },
];

export default function Reliability() {
  const [active, setActive] = useState<IllustrationId>(FEATURES[0].id);
  const [inView, setInView] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [cycleNonce, setCycleNonce] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  // IntersectionObserver — pause the auto-cycle when out of view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const advance = (next: IllustrationId) => {
    setActive(next);
    setCycleNonce((n) => n + 1);
  };

  const currentIdx = FEATURES.findIndex((f) => f.id === active);
  // Wrap-around index helper — shared by the auto-cycle, the prev/
  // next buttons, and the mobile nav so the modulo math lives once.
  const featureAt = (offset: number) =>
    FEATURES[(currentIdx + offset + FEATURES.length) % FEATURES.length];
  const prevFeature = () => advance(featureAt(-1).id);
  const nextFeature = () => advance(featureAt(1).id);

  const running = inView && !hovering;

  // `cycleNonce` is in the deps so explicit clicks (which bump it)
  // restart the timer cleanly instead of inheriting elapsed time.
  useEffect(() => {
    if (!running) return;
    if (typeof window === "undefined") return;
    // Respect prefers-reduced-motion: don't tug the panel through
    // diagrams the user hasn't asked to see.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      advance(featureAt(1).id);
    }, V1_CYCLE_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, running, cycleNonce]);
  const ActiveIllustration = ILLUSTRATIONS[active];

  return (
    <Section
      ref={sectionRef}
      aria-labelledby="bg-jobs-reliability-heading"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      // Section bg carbon/500 + opacity-20 grain overlay. The
      // page-wide v1 grain handles the texture here so we just keep the
      // dark canvas; the standard <Section> box owns padding + gutters.
      className="relative"
    >
      <SectionHeader
        id="bg-jobs-reliability-heading"
        title={
          <>
            Everything production
            <br className="hidden lg:inline" />
            {" apps require."}
          </>
        }
        body="Reliability, observability, and flow control — all colocated within your code, not spread across separate services that drop context."
        bodyClassName="max-w-[572px]"
      />

      {/* Mobile-only prev/next row — the desktop side-pinned
          ArrowPreviewButtons hide below lg, so on small screens we
          surface arrows + the current title as a header above the
          illustration. Mirrors AI/UseCases' MobileNavButton row. */}
      <MobileReelNav
        activeTitle={FEATURES[currentIdx].title}
        prevTitle={featureAt(-1).title}
        nextTitle={featureAt(1).title}
        itemNoun="feature"
        onPrev={prevFeature}
        onNext={nextFeature}
        className="mt-v1-stack mb-3 flex items-center justify-between gap-3 lg:hidden"
      />

      {/* Illustration panel — uses the shared GradientFrame chrome
          (same as Home/TrustedInBigLeagues VisualizationCard and
          SeeItInAction code panel). Illustrations are tuned for the
          desktop panel width, so we scale them down on mobile to
          keep the inner content inside the 460 px tall card. */}
      <motion.div
        {...reveals.item(2)}
        role="region"
        aria-live="polite"
        aria-label={`Illustration for ${FEATURES[currentIdx].title}`}
        className="relative lg:mt-v1-stack"
      >
        <GradientFrame
          variant="black"
          className="w-full rounded-[6px]"
          innerClassName="relative flex h-[348px] w-full items-center justify-center overflow-hidden rounded-[6px] md:h-[467px]"
        >
          {/* Outer wrapper owns the responsive scale-down (a CSS
              `transform`). The inner motion.div owns the y/opacity
              swap (also a `transform`). Keeping them on separate
              elements prevents motion's inline transform from
              clobbering the Tailwind `scale-*` utility. */}
          <div className="origin-center scale-[0.67] sm:scale-[0.7] md:scale-[0.8] lg:scale-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] as const }}
              >
                <ActiveIllustration />
              </motion.div>
            </AnimatePresence>
          </div>
          <ArrowPreviewButton
            direction="prev"
            title={featureAt(-1).title}
            onClick={prevFeature}
          />
          <ArrowPreviewButton
            direction="next"
            title={featureAt(1).title}
            onClick={nextFeature}
          />
        </GradientFrame>
      </motion.div>

      {/* Feature grid — 4 cols × 2 rows at lg. Hover vocabulary
          mirrors AI/UseCases. */}
      <motion.ul
        {...reveals.item(3)}
        role="tablist"
        aria-label="Production features"
        className="mt-8 grid grid-cols-1 gap-x-[38px] gap-y-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-y-9 lg:gap-x-2"
      >
        {FEATURES.map((feature) => {
          const isActive = feature.id === active;
          return (
            <li key={feature.id} className="flex flex-col">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => advance(feature.id)}
                onPointerMove={onCursorSpotlightMove}
                style={CURSOR_SPOTLIGHT_SEED}
                className="group/row relative isolate flex w-full items-start gap-[10px] rounded-md px-[22px] py-[10px] text-left motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-v1-out hover:bg-v1-frost/[0.035] focus-visible:bg-v1-frost/[0.035]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-0 rounded-md opacity-0 motion-safe:transition-opacity motion-safe:duration-[420ms] group-hover/row:opacity-100"
                  style={{
                    background:
                      "radial-gradient(280px circle at var(--mx) var(--my), rgba(232, 234, 237, 0.07), transparent 65%)",
                  }}
                />
                <span className="relative flex h-[40px] shrink-0 items-center">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative size-2 motion-safe:transition-[background-color,transform] motion-safe:duration-300 motion-safe:ease-v1-out",
                      isActive
                        ? "bg-v1-accent-salmon"
                        : "bg-v1-steel group-hover/row:translate-x-[3px] group-hover/row:bg-v1-frost group-focus-visible/row:translate-x-[3px]"
                    )}
                  />
                </span>
                <span className="flex flex-1 flex-col gap-1.5">
                  <span className="font-v1Heading text-[16px] leading-[1.25] tracking-[-0.01em] text-v1-frost">
                    {feature.title}
                  </span>
                  <span
                    className={cn(
                      "font-v1Body text-[13px] leading-[1.55] motion-safe:transition-colors motion-safe:duration-300",
                      isActive ? "text-v1-frost" : "text-v1-frost/50 group-hover/row:text-v1-frost/80"
                    )}
                  >
                    {feature.body}
                  </span>
                </span>
              </button>
              <a
                href={feature.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pl-[40px] pr-[22px] pb-2 pt-1 font-v1Label text-[12px] text-v1-frost/40 hover:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-200"
              >
                Read the docs →
              </a>
            </li>
          );
        })}
      </motion.ul>
    </Section>
  );
}

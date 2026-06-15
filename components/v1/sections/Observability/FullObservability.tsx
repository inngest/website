"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { tweens } from "@/utils/v1/springs";
import { cn } from "@/utils/v1/cn";
import { ArrowPreviewButton } from "@/components/v1/sections/shared/ArrowPreviewButton";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import MobileReelNav from "@/components/v1/sections/shared/MobileReelNav";
import ReelDirectoryRow from "@/components/v1/sections/shared/ReelDirectoryRow";
import { useReelCarousel } from "@/components/v1/sections/shared/useReelCarousel";

interface Feature {
  id: string;
  title: string;
  body: string;
  href?: string;
}

const FEATURES: Feature[] = [
  {
    id: "metrics-dashboard",
    title: "Metrics Dashboard",
    body: "Check system health and drill down into the function causing problems without losing context.",
    href: "/docs/platform/monitor/observability-metrics",
  },
  {
    id: "run-search",
    title: "Run search",
    body: "Filter across millions of runs with the same context your log stack uses: event payload, function output, user ID.",
    href: "/docs/platform/monitor/inspecting-function-runs#searching-function-runs",
  },
  {
    id: "waterfall-traces",
    title: "Waterfall traces",
    body: "Show every run, side by side, with the names you wrote in code. Timing, input, output, queue delay, retries—all in one place.",
    href: "/docs/platform/monitor/traces",
  },
  {
    id: "replay",
    title: "Replay without Queues",
    body: "Forget dead-letter queues and manual ID tracking. Re-run jobs in bulk with one action.",
    href: "/docs/platform/replay",
  },
  {
    id: "insights",
    title: "Insights",
    body: "Query event and run data without SQL. No exporting, no one-off scripts.",
    href: "/docs/platform/monitor/insights",
  },
];

// Per-feature product UI exports — self-contained dashboard
// screenshots on a transparent fill, designed to sit on the
// GradientFrame's dark gradient panel. Most are bordered SVGs (white
// 0.883px frame); run-search is a transparent WebP screenshot.
const ILLUSTRATIONS: Record<string, string> = {
  "metrics-dashboard": "/assets/v1/observability/metrics-dashboard.svg",
  "run-search": "/assets/v1/observability/run-search.webp",
  "waterfall-traces": "/assets/v1/observability/waterfall-traces.svg",
  replay: "/assets/v1/observability/replay.svg",
  insights: "/assets/v1/observability/insights.svg",
};

// Per-feature display-height caps. Most illustrations fill the 556px
// stage via object-contain (`max-h-full`). run-search is a 2× raster
// whose intrinsic size (934×618) would over-fill — the design sizes it
// at 467×309 centred in the stage, so cap it to ~309px at the 1440
// design width, scaling on the same 44vw slope as the stage.
const ILLUSTRATION_SIZE: Record<string, string> = {
  "run-search": "max-h-[clamp(133px,24.4vw,309px)]",
};

export default function FullObservability() {
  const total = FEATURES.length;
  const {
    active,
    select: onSelect,
    next,
    prev,
    cycling,
    sectionRef,
    pause: onHoverEnter,
    resume: onHoverLeave,
  } = useReelCarousel(total);

  const prevIndex = (active - 1 + total) % total;
  const nextIndex = (active + 1) % total;
  const current = FEATURES[active];

  return (
    <Section ref={sectionRef} aria-labelledby="ob-full-heading" className="relative">
      <SectionHeader
        id="ob-full-heading"
        title={
          <>
            <span className="block">Full observability.</span>
            <span className="block">No extra instrumentation.</span>
          </>
        }
      />

      <MobileReelNav
        activeTitle={current.title}
        prevTitle={FEATURES[prevIndex].title}
        nextTitle={FEATURES[nextIndex].title}
        itemNoun="observability feature"
        onPrev={prev}
        onNext={next}
      />

      {/* Graphic. Like /webhooks-events, the bordered gradient panel is
          STATIC — only the dashboard inside crossfades on switch, so the
          frame and the edge-pinned chevrons never flash. There's no
          title above it; the active feature reads off the salmon marker. */}
      <motion.div {...reveals.body} className="relative mt-4 lg:mt-20">
        <GradientFrame
          variant="black"
          className="rounded-md"
          innerClassName="relative"
        >
          {/* Fixed-height slot so the panel doesn't jump between the five
              illustrations' different aspect ratios (4 is portrait, the
              rest landscape) — each one centers via object-contain. */}
          <div className="flex h-[clamp(240px,44vw,556px)] items-center justify-center p-3 sm:p-4 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={tweens.entry}
                className="flex h-full w-full items-center justify-center"
              >
                <FeatureIllustration
                  src={ILLUSTRATIONS[current.id]}
                  title={current.title}
                  sizeClassName={ILLUSTRATION_SIZE[current.id]}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <ArrowPreviewButton
            direction="prev"
            title={FEATURES[prevIndex].title}
            onClick={prev}
          />
          <ArrowPreviewButton
            direction="next"
            title={FEATURES[nextIndex].title}
            onClick={next}
          />
        </GradientFrame>
      </motion.div>

      {/* Directory row at the bottom — same vocabulary as /ai
          UseCases. Text rows with a small salmon dot on the active
          item (pulse halo while auto-cycling). */}
      <ul className="mt-10 grid list-none grid-cols-1 items-stretch gap-x-[38px] gap-y-8 pl-0 sm:grid-cols-2 sm:gap-y-[18px] lg:mt-[44px] lg:grid-cols-3 lg:gap-y-[18px]">
        {FEATURES.map((f, i) => {
          const isActive = i === active;
          return (
            <motion.li
              key={f.id}
              {...reveals.item(i)}
              className="h-full list-none"
            >
              <ReelDirectoryRow
                isActive={isActive}
                cycling={cycling}
                onSelect={() => onSelect(i)}
                onHoverEnter={onHoverEnter}
                onHoverLeave={onHoverLeave}
                className="lg:py-[18px]"
                dotAnchorClassName="lg:h-[calc(clamp(1.25rem,1.75vw,1.625rem)*1.2)]"
              >
                <span className="flex flex-1 flex-col gap-2 font-v1Heading">
                  {f.href ? (
                    <Link
                      href={f.href}
                      prefetch={false}
                      className="flex flex-col gap-2 hover:opacity-80 motion-safe:transition-opacity motion-safe:duration-200"
                    >
                      <span className="text-[28px] leading-[40px] tracking-[-0.01em] lg:leading-[1.2] lg:[font-size:clamp(1.25rem,1.75vw,1.625rem)]">
                        {f.title}
                      </span>
                      <span
                        className={cn(
                          "text-pretty text-[18px] leading-[1.5] tracking-[-0.01em] motion-safe:transition-colors motion-safe:duration-300 lg:[font-size:clamp(0.8125rem,1.05vw,1rem)]",
                          isActive ? "text-v1-frost" : "text-v1-frost/80"
                        )}
                      >
                        {f.body}
                      </span>
                    </Link>
                  ) : (
                    <>
                      <span className="text-[28px] leading-[40px] tracking-[-0.01em] lg:leading-[1.2] lg:[font-size:clamp(1.25rem,1.75vw,1.625rem)]">
                        {f.title}
                      </span>
                      <span
                        className={cn(
                          "text-pretty text-[18px] leading-[1.5] tracking-[-0.01em] motion-safe:transition-colors motion-safe:duration-300 lg:[font-size:clamp(0.8125rem,1.05vw,1rem)]",
                          isActive ? "text-v1-frost" : "text-v1-frost/80"
                        )}
                      >
                        {f.body}
                      </span>
                    </>
                  )}
                </span>
              </ReelDirectoryRow>
            </motion.li>
          );
        })}
      </ul>
    </Section>
  );
}

// ─── Feature illustration ────────────────────────────────────────
// Per-feature product UI screenshot. Rendered as
// a plain <img> from the public asset path (keeps the bundle slim —
// the assets are 15-230KB each, served and cached separately).
// Static for now; the outer AnimatePresence still crossfades between
// slides as the carousel advances.

function FeatureIllustration({
  src,
  title,
  sizeClassName,
}: {
  src: string;
  title: string;
  /** Per-feature height cap. Defaults to `max-h-full` (fill the stage);
   *  overridden for rasters that must render at a fixed design size. */
  sizeClassName?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      data-feature={title}
      className={cn("max-w-full select-none", sizeClassName ?? "max-h-full")}
    />
  );
}

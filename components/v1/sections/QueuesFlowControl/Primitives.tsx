"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import { useReelCarousel } from "@/components/v1/sections/shared/useReelCarousel";
import { AdvanceClick } from "@/components/v1/sections/shared/AdvanceClick";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import MobileReelNav from "@/components/v1/sections/shared/MobileReelNav";
import ReelDirectoryRow from "@/components/v1/sections/shared/ReelDirectoryRow";
import { ArrowPreviewButton } from "@/components/v1/sections/shared/ArrowPreviewButton";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

// "Primitives you declare in code." Reuses the AI page's "What users
// are building" reel chrome (useReelCarousel +
// ReelDirectoryRow + GradientFrame featured card with prev/next
// arrow-preview pills, click/drag-to-advance, and sliding cards),
// populated with the six flow-control primitives. The featured card
// shows each primitive's exported SVG illustration.

interface Primitive {
  id: string;
  title: string;
  body: string;
  illustration: string;
}

const ASSET_BASE = "/assets/v1/queues-flow-control/primitives";

const PRIMITIVES: Primitive[] = [
  {
    id: "concurrency",
    title: "Concurrency Control",
    body: "Stack multiple limits together: a global ceiling plus per-tenant caps. Every tenant gets their fair share, no matter how much work one of them throws at it.",
    illustration: `${ASSET_BASE}/q1.svg`,
  },
  {
    id: "throttling",
    title: "Throttling & Rate Limiting",
    body: "Decide how often a function runs. Absorb traffic spikes without dropping work—excess runs queue and drain at the rate you set.",
    illustration: `${ASSET_BASE}/q2.svg`,
  },
  {
    id: "debouncing",
    title: "Debouncing",
    body: "Don't burn compute on redundant work. Collapse bursts of identical events into a single execution.",
    illustration: `${ASSET_BASE}/q3.svg`,
  },
  {
    id: "prioritization",
    title: "Dynamic Prioritization",
    body: "Set high priority work without starving everything else. Onboarding jobs jump ahead of bulk syncs; transactional emails jump ahead of marketing sends.",
    illustration: `${ASSET_BASE}/q4.svg`,
  },
  {
    id: "batching",
    title: "Batch Processing",
    body: "Dramatically reduce invocation costs on high-volume workloads by ensuring that whatever comes first triggers the run.",
    illustration: `${ASSET_BASE}/q5.svg`,
  },
  {
    id: "cancellation",
    title: "Declarative Cancellation",
    body: "Cancel in-flight runs automatically if a matching event occurs. Declare the condition on the function, Inngest does the rest.",
    illustration: `${ASSET_BASE}/q6.svg`,
  },
];

export default function Primitives() {
  const {
    active: activeIndex,
    select,
    next,
    prev,
    cycling,
    sectionRef,
  } = useReelCarousel(PRIMITIVES.length, { threshold: 0.2 });

  const current = PRIMITIVES[activeIndex] ?? PRIMITIVES[0];

  // Clicking a row swaps the featured card and latches the reel (stops
  // auto-advance). No scroll-into-view — the page must not jump.
  const handleSelect = (id: string) => {
    select(PRIMITIVES.findIndex((p) => p.id === id));
  };

  return (
    <Section
      ref={sectionRef}
      aria-labelledby="qfc-primitives-headline"
      className="relative"
      containerClassName="flex flex-col gap-v1-stack"
    >
      {/* Intro is intentionally Body/Small (16), overriding the
          SectionHeader 18px default via bodyClassName. */}
      <SectionHeader
        id="qfc-primitives-headline"
        title="Primitives you declare in code."
        body="Flow control lives in your function definition — no middleware, no separate systems, no infrastructure topology to design."
        bodyClassName="max-w-[554px] text-v1-body-sm"
      />

      {/* Graphic sits directly under the title/subtitle; the directory
          grid (tabs) follows below it. */}
      <FeaturedCard primitive={current} onPrev={prev} onNext={next} />

      <Grid activeId={current.id} onSelect={handleSelect} cycling={cycling} />
    </Section>
  );
}

function FeaturedCard({
  primitive,
  onPrev,
  onNext,
}: {
  primitive: Primitive;
  onPrev: () => void;
  onNext: () => void;
}) {
  const currentIndex = PRIMITIVES.findIndex((p) => p.id === primitive.id);
  const prevIndex = (currentIndex - 1 + PRIMITIVES.length) % PRIMITIVES.length;
  const nextIndex = (currentIndex + 1) % PRIMITIVES.length;
  return (
    <>
      <AdvanceClick
        onAdvance={onNext}
        onPrev={onPrev}
        ariaLabel="Show next or previous primitive based on cursor position"
        hideCursor
        className="relative w-full cursor-grab select-none"
      >
        <GradientFrame
          variant="black"
          className="rounded-md"
          innerClassName="relative"
        >
          {/* Mobile: only the current card renders, in natural flow. */}
          <div className="flex h-[clamp(300px,72vw,460px)] items-center justify-center px-6 pb-12 pt-8 lg:hidden">
            <CardContent primitive={primitive} />
          </div>

          {/* Lg+: all cards mounted, stacked in place. The active card
              crossfades in while the others fade out — the graphic stays
              centered and never slides/moves position on change. */}
          <div className="relative hidden w-full items-center justify-center lg:flex lg:min-h-[535px] lg:px-20 lg:pb-20 lg:pt-[60px]">
            {PRIMITIVES.map((p) => {
              const isCurrent = p.id === primitive.id;
              return (
                <motion.div
                  key={p.id}
                  aria-hidden={!isCurrent}
                  className="absolute inset-0 flex items-center justify-center px-20 pb-[60px] pt-[60px] [&>*]:flex [&>*]:max-h-full [&>*]:max-w-full [&>*]:items-center [&>*]:justify-center"
                  initial={false}
                  animate={{ opacity: isCurrent ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  style={{
                    pointerEvents: isCurrent ? "auto" : "none",
                    willChange: "opacity",
                  }}
                >
                  <CardContent primitive={p} />
                </motion.div>
              );
            })}
          </div>
          {/* Side-pinned arrow pills — hover expands inward to preview
              the prev / next primitive's title. data-cursor-hide fades
              the AdvanceClick follower disk near each. */}
          <ArrowPreviewButton
            direction="prev"
            title={PRIMITIVES[prevIndex].title}
            onClick={onPrev}
          />
          <ArrowPreviewButton
            direction="next"
            title={PRIMITIVES[nextIndex].title}
            onClick={onNext}
          />
        </GradientFrame>
      </AdvanceClick>

      {/* Mobile nav row — sits BELOW the card (the graphic stays pinned
          directly under the subtitle so it doesn't shift as you slide).
          Replaces the desktop side-pinned arrow pills, which would
          overlap the illustration on narrow viewports. */}
      <MobileReelNav
        activeTitle={primitive.title}
        prevTitle={PRIMITIVES[prevIndex].title}
        nextTitle={PRIMITIVES[nextIndex].title}
        itemNoun="primitive"
        onPrev={onPrev}
        onNext={onNext}
        className="mt-4 flex items-center justify-between gap-3 lg:hidden"
      />
    </>
  );
}

function CardContent({ primitive }: { primitive: Primitive }) {
  return (
    <img
      src={primitive.illustration}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      className="block max-h-full max-w-full select-none"
    />
  );
}

function Grid({
  activeId,
  onSelect,
  cycling,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  cycling: boolean;
}) {
  return (
    <ul className="grid grid-cols-1 items-stretch gap-x-[38px] gap-y-8 sm:grid-cols-2 sm:gap-y-[18px] lg:grid-cols-3 lg:gap-y-[18px]">
      {PRIMITIVES.map((item, i) => {
        const isActive = item.id === activeId;
        return (
          <motion.li key={item.id} {...reveals.item(i)} className="h-full">
            <ReelDirectoryRow
              isActive={isActive}
              cycling={cycling}
              showProgress
              onSelect={() => onSelect(item.id)}
              className="lg:py-[18px]"
              dotAnchorClassName="lg:h-[calc(clamp(1.25rem,1.75vw,1.625rem)*1.2)]"
            >
              <span className="flex flex-1 flex-col gap-2 font-v1Heading">
                <span className="text-[28px] leading-[40px] tracking-[-0.01em] lg:leading-[1.2] lg:[font-size:clamp(1.25rem,1.75vw,1.625rem)]">
                  {item.title}
                </span>
                <span
                  className={cn(
                    "text-pretty text-[18px] leading-[1.5] tracking-[-0.01em] motion-safe:transition-colors motion-safe:duration-300 lg:[font-size:clamp(0.8125rem,1.05vw,1rem)]",
                    isActive ? "text-v1-frost" : "text-v1-frost/80",
                  )}
                >
                  {item.body}
                </span>
              </span>
            </ReelDirectoryRow>
          </motion.li>
        );
      })}
    </ul>
  );
}

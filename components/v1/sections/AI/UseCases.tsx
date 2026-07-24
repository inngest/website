"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { springs } from "@/utils/v1/springs";
import { useReelCarousel } from "@/components/v1/sections/shared/useReelCarousel";
import { AdvanceClick } from "@/components/v1/sections/shared/AdvanceClick";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import MobileReelNav from "@/components/v1/sections/shared/MobileReelNav";
import ReelDirectoryRow from "@/components/v1/sections/shared/ReelDirectoryRow";
import { ArrowPreviewButton } from "@/components/v1/sections/shared/ArrowPreviewButton";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import AgentsCard from "@/components/v1/sections/AI/use-cases/AgentsCard";
import ChatBotsCard from "@/components/v1/sections/AI/use-cases/ChatBotsCard";
import ContentMediaCard from "@/components/v1/sections/AI/use-cases/ContentMediaCard";
import HumanInTheLoopCard from "@/components/v1/sections/AI/use-cases/HumanInTheLoopCard";
import MultiStepLLMCard from "@/components/v1/sections/AI/use-cases/MultiStepLLMCard";
import ScheduledCronCard from "@/components/v1/sections/AI/use-cases/ScheduledCronCard";
import { cn } from "@/utils/v1/cn";

/**
 * AI page "What users are building on Inngest" — a carousel of six
 * use cases. The featured card on top shows the active use case's
 * code snippet alongside a bespoke illustration; the 3×2 grid below
 * acts both as a directory and as tabs (clicking a row swaps the
 * featured card, and the active row's accent dot turns salmon).
 *
 * Prev / next arrows on the card wrap in both directions.
 *
 * Per-card visualizations are coded natively (not exported images)
 * so they share design tokens and stay crisp at any density.
 */

const USE_CASES = [
  {
    id: "ai-agents",
    label: "AGENTS & AUTONOMOUS WORKFLOWS",
    title: "AI Agents",
    body: "Step-level retries with exponential backoff. No boilerplate required.",
  },
  {
    id: "multi-step-llm",
    label: "MULTI-STEP LLM",
    title: "Multi-step LLM",
    body: "One failure shouldn't restart the chain. Each model call runs as an independent step.",
  },
  {
    id: "chat-bots",
    label: "CHAT BOTS & COMPLETION",
    title: "Chat bots & completion",
    body: "Don't pay for idle serverless compute. Inngest pauses your function during inference.",
  },
  {
    id: "content-media",
    label: "CONTENT & MEDIA GENERATION",
    title: "Content & media generation",
    body: "Generation jobs are long. Serverless timeouts are short. Inngest keeps them running until completion.",
  },
  {
    id: "scheduled",
    label: "SCHEDULED & CRON JOBS",
    title: "Scheduled & cron jobs",
    body: "Missed runs should never stay missed. Every execution is logged and recoverable.",
  },
  {
    id: "human-in-the-loop",
    label: "HUMAN-IN-THE-LOOP",
    title: "Human-in-the-loop",
    body: "Agents shouldn't guess when humans must decide. Pause execution indefinitely, resume on approval.",
  },
] as const;

type UseCaseId = typeof USE_CASES[number]["id"];

/**
 * Reusable across landing pages. Defaults to the AI-page heading
 * ("What users / are Building on Inngest"); pass `headingLines` to
 * override (e.g. /webhooks-events uses a different two-liner).
 * `ariaLabel` mirrors the heading for screen readers.
 */
export default function UseCases({
  headingLines = ["What users", "are Building on Inngest"],
  ariaLabel = "What users are building on Inngest",
}: {
  headingLines?: [string, string];
  ariaLabel?: string;
} = {}) {
  const {
    active: activeIndex,
    select,
    next,
    prev,
    cycling,
    sectionRef,
  } = useReelCarousel(USE_CASES.length, { threshold: 0.2 });

  const current = USE_CASES[activeIndex] ?? USE_CASES[0];

  // Clicking a row just swaps the featured card (and latches the reel,
  // stopping auto-advance). No scroll-into-view — the page must not jump
  // down to the diagram on selection.
  const handleSelect = (id: UseCaseId) => {
    select(USE_CASES.findIndex((u) => u.id === id));
  };

  return (
    <Section ref={sectionRef} aria-label={ariaLabel} className="relative">
      {/* Mobile wraps title + featured card + grid in a single
          bordered/gradient container. At lg+ the wrapper is
          transparent and uses the original flow: title above,
          featured-card-plus-grid below. */}
      <div className="relative isolate flex flex-col gap-v1-stack overflow-hidden rounded-md border border-v1-strong/[0.35] bg-v1-gradient-charcoal px-4 pb-[72px] pt-[44px] lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-none lg:p-0">
        <SectionHeader
          title={
            <>
              {headingLines[0]}
              <br />
              {headingLines[1]}
            </>
          }
        />

        {/* Grid + featured card keep their own (tighter) rhythm; only the
            header → content gap is the standard v1-stack (48), set above. */}
        <div className="flex flex-col gap-[29px] lg:gap-[44px]">
          {/* No SCROLL_REVEAL_STYLE wrapper here — its translate3d
              breaks position: fixed for the AdvanceClick cursor disk
              inside. Entrance reveal is owned by the grid below. */}
          <FeaturedCard useCase={current} onPrev={prev} onNext={next} />

          <Grid
            activeId={current.id}
            onSelect={handleSelect}
            cycling={cycling}
          />
        </div>
      </div>
    </Section>
  );
}

function FeaturedCard({
  useCase,
  onPrev,
  onNext,
}: {
  useCase: typeof USE_CASES[number];
  onPrev: () => void;
  onNext: () => void;
}) {
  const currentIndex = USE_CASES.findIndex((u) => u.id === useCase.id);
  const prevIndexRef = useRef(currentIndex);
  const isWrap = Math.abs(currentIndex - prevIndexRef.current) > 1;
  useEffect(() => { prevIndexRef.current = currentIndex; }, [currentIndex]);
  const prevIndex = (currentIndex - 1 + USE_CASES.length) % USE_CASES.length;
  const nextIndex = (currentIndex + 1) % USE_CASES.length;
  return (
    <>
      {/* Mobile nav row — sits ABOVE the card so the label reads as a
        header for the illustration that follows, and the relationship
        between the card and the body copy below it stays uncluttered.
        The arrows + label here replace the desktop side-pinned pills,
        which would overlap the illustration on narrow viewports. */}
      <MobileReelNav
        activeTitle={useCase.title}
        prevTitle={USE_CASES[prevIndex].title}
        nextTitle={USE_CASES[nextIndex].title}
        itemNoun="use case"
        onPrev={onPrev}
        onNext={onNext}
        className="mb-4 mt-3 flex items-center justify-between gap-3 lg:hidden"
      />
      <AdvanceClick
        onAdvance={onNext}
        onPrev={onPrev}
        ariaLabel="Show next or previous use case based on cursor position"
        hideCursor
        className="relative w-full cursor-grab select-none"
      >
        <GradientFrame
          variant="black"
          className="rounded-md"
          innerClassName="relative"
        >
          {/* Mobile: only the current card renders, in natural flow, so
            tall illustrations (code + diagram stacked) get their full
            content height instead of being squeezed into an absolute
            slide container that has no min-height below lg. */}
          <div className="px-6 pb-12 pt-8 lg:hidden">
            <CardContent useCase={useCase} />
          </div>

          {/* Lg+: all cards mounted, slide horizontally on activeId change
            via translateX (offset * 100%) on `springs.glide`. No remount
            so each card's internal animations stay alive. */}
          <div className="relative hidden w-full items-center justify-center lg:flex lg:min-h-[642px] lg:px-20 lg:pb-20 lg:pt-[60px]">
            {USE_CASES.map((u, i) => {
              const offset = i - currentIndex;
              const isCurrent = u.id === useCase.id;
              return (
                <motion.div
                  key={u.id}
                  aria-hidden={!isCurrent}
                  className="absolute inset-0 flex items-center justify-center px-20 pb-[60px] pt-[60px] [&>*]:flex [&>*]:max-h-full [&>*]:max-w-full [&>*]:items-center [&>*]:justify-center"
                  initial={false}
                  animate={{ x: `${offset * 100}%` }}
                  transition={isWrap ? { duration: 0 } : springs.glide}
                  style={{
                    pointerEvents: isCurrent ? "auto" : "none",
                    willChange: "transform",
                  }}
                >
                  <CardContent useCase={u} />
                </motion.div>
              );
            })}
          </div>
          {/* data-cursor-hide on each arrow so the AdvanceClick follower
            disk fades out as the cursor approaches the prev/next
            buttons. On hover each pill EXPANDS inward via a JS-driven
            spring to reveal the prev / next card's title — gives the
            user a preview of where they're going before they click. */}
          <ArrowPreviewButton
            direction="prev"
            title={USE_CASES[prevIndex].title}
            onClick={onPrev}
          />
          <ArrowPreviewButton
            direction="next"
            title={USE_CASES[nextIndex].title}
            onClick={onNext}
          />
        </GradientFrame>
      </AdvanceClick>
    </>
  );
}

function CardContent({ useCase }: { useCase: typeof USE_CASES[number] }) {
  switch (useCase.id) {
    case "ai-agents":
      return <AgentsCard label={useCase.label} />;
    case "multi-step-llm":
      return <MultiStepLLMCard label={useCase.label} />;
    case "chat-bots":
      return <ChatBotsCard label={useCase.label} />;
    case "content-media":
      return <ContentMediaCard label={useCase.label} />;
    case "scheduled":
      return <ScheduledCronCard label={useCase.label} />;
    case "human-in-the-loop":
      return <HumanInTheLoopCard label={useCase.label} />;
  }
}

function Grid({
  activeId,
  onSelect,
  cycling,
}: {
  activeId: UseCaseId;
  onSelect: (id: UseCaseId) => void;
  cycling: boolean;
}) {
  return (
    <ul className="grid grid-cols-1 items-stretch gap-x-[38px] gap-y-8 sm:grid-cols-2 sm:gap-y-[18px] lg:grid-cols-3 lg:gap-y-[18px]">
      {USE_CASES.map((item, i) => {
        const isActive = item.id === activeId;
        return (
          <motion.li key={item.id} {...reveals.item(i)} className="h-full">
            <ReelDirectoryRow
              isActive={isActive}
              cycling={cycling}
              showProgress
              onSelect={() => onSelect(item.id)}
              // Active-row background now lives in ReelDirectoryRow.
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
                    isActive ? "text-v1-frost" : "text-v1-frost/80"
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

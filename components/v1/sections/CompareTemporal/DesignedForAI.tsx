"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import ReelCarousel from "@/components/v1/sections/shared/ReelCarousel";
import ReelDirectoryRow from "@/components/v1/sections/shared/ReelDirectoryRow";
import { useReelCarousel } from "@/components/v1/sections/shared/useReelCarousel";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { DEFAULT_TOKEN_COLOR } from "@/components/v1/sections/shared/CodeBlock";
import {
  tokenizeCode,
  renderTokens,
} from "@/components/v1/sections/shared/codeHighlight";

/**
 * "Designed for AI, not retrofitted". A
 * line-numbered code carousel (prev/next arrows) over a 2×2 grid of
 * feature blurbs that double as slide selectors. Built on the shared
 * reel system (ReelCarousel + ReelDirectoryRow): the panel crossfades
 * between each primitive's visual while the directory rows auto-cycle
 * with the salmon progress rail. The other three slides' code is
 * authored pending copy.
 */

interface Slide {
  id: string;
  title: string;
  blurb: string;
  href?: string;
  code?: string;
  /** Render the per-user "Queued Runs" bar chart instead of a code box. */
  chart?: boolean;
  /** Render the Temporal-vs-Inngest observability segment timeline. */
  segments?: boolean;
}

const SLIDES: Slide[] = [
  {
    id: "step-memoization",
    title: "Step memoization",
    blurb:
      "Completed steps aren’t re-executed on retry. Temporal retries the whole activity — there’s no per-step cache.",
    href: "https://www.inngest.com/docs/learn/versioning#step-based-memoization",
    code: `const summary = await
step.run('summarize', async () => {
return llm.complete(transcript) })
// On retry, this step is skipped.
// The LLM is not called again.`,
  },
  {
    id: "human-in-the-loop",
    title: "Human-in-the-loop",
    blurb:
      "A native primitive in Inngest. In Temporal, its an assembly of Signals, channels, and Slectors – pattern, not platform.",
    href: "https://www.inngest.com/docs/ai-patterns/human-in-the-loop",
    code: `const decision
= await step.waitForEvent('review', {
event: 'agent/reviewed',
timeout: '7d' }) // Temporal
equivalent: Signal, channel, //
Selector, and handler — all manual.`,
  },
  {
    id: "per-user-concurrency",
    title: "Per-user concurrency and rate limiting",
    blurb:
      "Temporal has no built-in rate limiting. Concurrency is worker-level, not per-user. Both require custom code.",
    href: "https://www.inngest.com/docs/guides/concurrency",
    chart: true,
  },
  {
    id: "step-observability",
    title: "Step-level observability",
    blurb:
      "— queue delay, step timing, flow control — so you know exactly what happened, and why.",
    href: "https://www.inngest.com/docs/platform/monitor/observability-metrics",
    segments: true,
  },
];

// ---- highlighter --------------------------------------------------
// Comments are handled per-line in CodeContent (these mocks wrap a trailing
// comment across several lines), so the shared tokenizer is only fed
// comment-free fragments. This snippet colours just keywords + strings;
// numbers / object-keys stay plain (kinds absent from this map render
// uncoloured).
const COMMENT_COLOR = DEFAULT_TOKEN_COLOR.cmt;
const TOKEN_COLORS = {
  kw: DEFAULT_TOKEN_COLOR.kw,
  str: DEFAULT_TOKEN_COLOR.str,
};

function CodeContent({ code }: { code: string }) {
  const lines = code.split("\n");
  // Once a `//` appears, the rest of the snippet is a trailing comment
  // (these mocks end with a comment that wraps across lines) — dim
  // everything from there to the end.
  let inComment = false;
  const rendered = lines.map((line, i) => {
    if (inComment) {
      return (
        <div key={i} style={{ color: COMMENT_COLOR }}>
          {line || " "}
        </div>
      );
    }
    const idx = line.indexOf("//");
    if (idx === -1) {
      const toks = renderTokens(tokenizeCode(line), TOKEN_COLORS);
      return <div key={i}>{toks.length ? toks : " "}</div>;
    }
    inComment = true;
    return (
      <div key={i}>
        {renderTokens(tokenizeCode(line.slice(0, idx)), TOKEN_COLORS)}
        <span style={{ color: COMMENT_COLOR }}>{line.slice(idx)}</span>
      </div>
    );
  });
  return (
    <div className="flex gap-[18px] font-v1Mono text-[14px] leading-[1.7] lg:text-[15px]">
      <div className="select-none text-right text-v1-frost/25">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <pre className="overflow-x-auto whitespace-pre text-v1-frost">{rendered}</pre>
    </div>
  );
}

// "Queued Runs" grouped bar chart — without vs with Inngest, per user.
const CHART = {
  max: 65,
  ticks: [50, 25, 0],
  orange: "#FB5536",
  green: "#0BDD48",
  groups: [
    { label: "USER A", without: 60, with: 10 },
    { label: "USER B", without: 8, with: 13 },
    { label: "USER C", without: 9, with: 14 },
  ],
};

function ChartContent() {
  const H = 200;
  return (
    <div className="w-full max-w-[600px]">
      <div className="mb-[28px] font-v1Label text-[13px] uppercase tracking-[0.02em] text-v1-frost/70">
        Queued Runs
      </div>
      <div className="flex gap-[10px] sm:gap-[14px]">
        {/* y-axis */}
        <div
          className="relative w-[22px] text-right font-v1Label text-[12px] text-v1-frost/40"
          style={{ height: H }}
        >
          {CHART.ticks.map((tk) => (
            <div
              key={tk}
              className="absolute right-0 translate-y-1/2 leading-none"
              style={{ bottom: (tk / CHART.max) * H }}
            >
              {tk}
            </div>
          ))}
        </div>
        {/* plot */}
        <div className="flex-1">
          <div className="relative" style={{ height: H }}>
            {CHART.ticks.map((tk) => (
              <div
                key={tk}
                aria-hidden="true"
                className="absolute inset-x-0 border-t border-v1-frost/10"
                style={{ bottom: (tk / CHART.max) * H }}
              />
            ))}
            <div className="absolute inset-0 flex items-end justify-around">
              {CHART.groups.map((g) => (
                <div key={g.label} className="flex items-end gap-1.5 sm:gap-[10px]">
                  <span
                    className="w-[26px] sm:w-[40px] lg:w-[50px]"
                    style={{
                      height: (g.without / CHART.max) * H,
                      backgroundColor: CHART.orange,
                    }}
                  />
                  <span
                    className="w-[26px] sm:w-[40px] lg:w-[50px]"
                    style={{
                      height: (g.with / CHART.max) * H,
                      backgroundColor: CHART.green,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-around font-v1Label text-[12px] uppercase tracking-[0.02em] text-v1-frost/60">
            {CHART.groups.map((g) => (
              <span key={g.label}>{g.label}</span>
            ))}
          </div>
        </div>
      </div>
      {/* legend */}
      <div className="mt-[28px] flex flex-wrap items-center gap-x-6 gap-y-[10px] pl-0 font-v1Label text-[12px] text-v1-frost/70 sm:pl-[34px]">
        <span className="flex items-center gap-2">
          <span className="block size-[10px]" style={{ backgroundColor: CHART.orange }} />
          Without Inngest
        </span>
        <span className="flex items-center gap-2">
          <span className="block size-[10px]" style={{ backgroundColor: CHART.green }} />
          With Inngest
        </span>
      </div>
    </div>
  );
}

// "Step-level observability" timeline — Temporal exposes one opaque
// workflow run; Inngest breaks the same run into labelled segments
// (queue delay, step timing, flow control). Accent-coloured on the
// queue (salmon) + flow-control (green) segments; the rest are neutral.
const SEG_SALMON = "#FB5536";
const SEG_GREEN = "#0BDD48";
const SEG_BLUE = "#013CF6";

const SEGMENTS: {
  label: string;
  sub: string;
  dot: string;
  border: string;
  text?: string;
}[] = [
  { label: "QUEUE", sub: "delay", dot: SEG_SALMON, border: "rgba(251,85,54,0.55)", text: SEG_SALMON },
  { label: "STEP 1", sub: "248ms", dot: "rgba(255,255,255,0.4)", border: "rgba(255,255,255,0.14)" },
  { label: "FLOW", sub: "ctrl", dot: SEG_GREEN, border: "rgba(11,221,72,0.55)", text: SEG_GREEN },
  { label: "STEP 2", sub: "1.2s", dot: "rgba(255,255,255,0.4)", border: "rgba(255,255,255,0.14)" },
  { label: "STEP 3", sub: "891ms", dot: "rgba(255,255,255,0.4)", border: "rgba(255,255,255,0.14)" },
];

function SegmentsContent() {
  return (
    <div className="w-full max-w-[600px] font-v1Mono">
      {/* Temporal — one opaque run */}
      <div className="text-[12px] uppercase tracking-[0.08em] text-v1-frost/50">
        Temporal
      </div>
      <div
        className="mt-[14px] flex items-center gap-3 rounded-[8px] border px-[18px] py-[18px]"
        style={{ borderColor: "rgba(1,60,246,0.55)" }}
      >
        <span
          aria-hidden="true"
          className="block size-[8px] shrink-0"
          style={{ backgroundColor: SEG_BLUE }}
        />
        <span className="text-[13px] uppercase tracking-[0.04em] text-v1-frost">
          Workflow run
        </span>
      </div>

      {/* Inngest — segmented timeline */}
      <div className="mt-[28px] text-[12px] uppercase tracking-[0.08em] text-v1-frost/50">
        Inngest
      </div>
      <div className="mt-[14px] flex gap-2 sm:gap-[10px]">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.label}
            className="flex min-w-0 flex-1 flex-col gap-2 rounded-[8px] border px-2 py-3 sm:px-3 sm:py-[14px]"
            style={{ borderColor: seg.border }}
          >
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span
                aria-hidden="true"
                className="block size-[8px] shrink-0"
                style={{ backgroundColor: seg.dot }}
              />
              <span
                className="truncate text-[12px] uppercase tracking-[0.04em] text-v1-frost sm:text-[13px]"
                style={seg.text ? { color: seg.text } : undefined}
              >
                {seg.label}
              </span>
            </span>
            <span className="truncate pl-[14px] text-[11px] text-v1-frost/45 sm:text-[12px]">
              {seg.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideVisual({ slide }: { slide: Slide }) {
  if (slide.chart) return <ChartContent />;
  if (slide.segments) return <SegmentsContent />;
  return <CodeContent code={slide.code ?? ""} />;
}

export default function DesignedForAI() {
  // External controller so the IntersectionObserver in-view gate anchors
  // to the <section> (the reel only auto-advances while on screen).
  const controller = useReelCarousel(SLIDES.length, { threshold: 0.2 });

  return (
    <Section
      ref={controller.sectionRef}
      aria-labelledby="ct-ai-heading"
      className="relative"
    >
      <SectionHeader
        id="ct-ai-heading"
        // The title sits on a single line in the design, so lift the
        // title's measure at lg.
        titleClassName="lg:max-w-none lg:whitespace-nowrap"
        title="Designed for AI, not retrofitted."
        body={
          <>
            Temporal was architected for deterministic workflows.
            <br className="hidden sm:block" /> The primitives it exposes
            reflect that – and so do the gaps.
          </>
        }
        bodyClassName="max-w-[572px]"
      />

      <div className="mt-v1-stack">
        <ReelCarousel
          items={SLIDES}
          getTitle={(s) => s.title}
          controller={controller}
        >
          <ReelCarousel.MobileNav
            itemNoun="primitive"
            className="mb-4 flex items-center justify-between gap-3 lg:hidden"
          />
          <ReelCarousel.Panel<Slide>
            heightClass="min-h-[300px] lg:min-h-[350px]"
            paddingClass="px-4 py-10 sm:px-6"
            frameClassName="rounded-[6px]"
          >
            {(slide) => <SlideVisual slide={slide} />}
          </ReelCarousel.Panel>
          {/* 2×2 feature grid / slide selectors. Custom grid (instead of
              ReelCarousel.Directory) so each cell can hold both the
              interactive button and a "Read the docs →" anchor as
              siblings — anchors cannot be nested inside buttons. */}
          <ul className="mt-[44px] grid list-none grid-cols-1 items-stretch gap-x-4 gap-y-8 pl-0 sm:grid-cols-2">
            {SLIDES.map((slide, i) => {
              const isActive = i === controller.active;
              return (
                <motion.li
                  key={slide.id}
                  {...reveals.item(i)}
                  className="flex list-none flex-col"
                >
                  <ReelDirectoryRow
                    isActive={isActive}
                    cycling={controller.cycling}
                    onSelect={() => controller.select(i)}
                    onHoverEnter={controller.pause}
                    onHoverLeave={controller.resume}
                    dotAnchorClassName=""
                  >
                    <span className="flex flex-1 flex-col gap-2">
                      <span
                        className={cn(
                          "flex min-h-[40px] items-center text-v1-heading-sm motion-safe:transition-colors",
                          isActive
                            ? "text-v1-frost"
                            : "text-v1-frost/70 group-hover/row:text-v1-frost",
                        )}
                      >
                        {slide.title}
                      </span>
                      <span
                        className={cn(
                          "text-v1-body-sm motion-safe:transition-colors",
                          isActive ? "text-v1-frost" : "text-v1-frost/80",
                        )}
                      >
                        {slide.blurb}
                      </span>
                    </span>
                  </ReelDirectoryRow>
                  {slide.href && (
                    <Link
                      href={slide.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-[22px] pb-2 pt-1 font-v1Label text-[13px] text-v1-frost/50 hover:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-200"
                    >
                      Read the docs →
                    </Link>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </ReelCarousel>
      </div>
    </Section>
  );
}

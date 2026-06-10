"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { tweens, V1_CYCLE_MS } from "@/utils/v1/springs";
import Link from "@/components/v1/Link";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { cn } from "@/utils/v1/cn";
import { appendRef } from "@/utils/v1/ref";
import { useIsDesktop } from "@/utils/v1/hooks/useIsDesktop";

/**
 * "Scale instantly, fix fast" + "Stuff your CISO needs to see"
 * share one charcoal outer card.
 */

type TopicId = "guardrails" | "traces" | "troubleshoot";

interface Topic {
  id: TopicId;
  title: string;
  /** Single line of copy; wraps naturally within the column. */
  body: string;
  visualization: ReactNode;
  docsHref: string;
}

const TOPICS: Topic[] = [
  {
    id: "guardrails",
    title: "Guardrails for scale",
    body: "Set concurrency, ensure fairness, and handle every blip, burst, and bounce without babysitting.",
    visualization: <ThroughputChart />,
    docsHref: "/docs/guides/flow-control",
  },
  {
    id: "traces",
    title: "Full traces and metrics",
    body: "Replay failures in bulk for step-level insight into what went wrong. No spans required.",
    visualization: <TraceWaterfall />,
    docsHref: "/docs/platform/monitor/inspecting-function-runs",
  },
  {
    id: "troubleshoot",
    title: "Faster troubleshooting",
    body: "Store and track everything that happens in your product inside your own OLAP environment.",
    visualization: <SqlBlock />,
    docsHref: "/docs/platform/replay",
  },
];

const CYCLE_MS = V1_CYCLE_MS;

export default function TrustedInBigLeagues() {
  const [active, setActive] = useState<TopicId>("guardrails");
  // Bumped on every topic change so the progress bar + viz replay
  // their keyframes via key change — decoupled from `active` so
  // re-selecting the same topic doesn't replay.
  const [cycleNonce, setCycleNonce] = useState(0);
  const [userTookControl, setUserTookControl] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasEnteredRef = useRef(false);
  const current = TOPICS.find((t) => t.id === active) ?? TOPICS[0];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Replay the initial viz draw-in once the section enters view, so
  // it doesn't finish silently while scrolling.
  useEffect(() => {
    if (inView && !hasEnteredRef.current) {
      hasEnteredRef.current = true;
      setCycleNonce((n) => n + 1);
    }
  }, [inView]);

  // Auto-cycle topics; stops permanently once the user takes control.
  useEffect(() => {
    if (!inView) return;
    if (userTookControl) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setActive((prev) => {
        const idx = TOPICS.findIndex((t) => t.id === prev);
        const next = TOPICS[(idx + 1) % TOPICS.length].id;
        return next;
      });
      setCycleNonce((n) => n + 1);
    }, CYCLE_MS);
    return () => window.clearInterval(interval);
  }, [userTookControl, inView]);

  const handleSelect = (id: TopicId) => {
    setActive(id);
    setCycleNonce((n) => n + 1);
    setUserTookControl(true);
  };

  return (
    <Section
      ref={sectionRef}
      aria-label="Scale instantly, fix fast"
      className="relative"
    >
      <GradientFrame
        variant="black"
        className="rounded-[10px]"
        innerClassName="flex flex-col gap-[52px] py-11 px-4 lg:pt-16 lg:pb-2.5 lg:px-8"
      >
        <TrustedBlock
          active={active}
          onSelect={handleSelect}
          current={current}
          cycleNonce={cycleNonce}
          showProgress={!userTookControl}
        />
        <CisoBlock />
      </GradientFrame>
    </Section>
  );
}

function TrustedBlock({
  active,
  onSelect,
  current,
  cycleNonce,
  showProgress,
}: {
  active: TopicId;
  onSelect: (id: TopicId) => void;
  current: Topic;
  cycleNonce: number;
  showProgress: boolean;
}) {
  return (
    <div className="flex flex-col gap-[52px]">
      <motion.h2
        {...reveals.heading}
        className={cn("text-balance", V1_SECTION_TITLE)}
      >
        Scale instantly, fix fast
      </motion.h2>

      <div className="flex flex-col gap-[28px] lg:pb-[19px]">
        <TopicRow
          active={active}
          onSelect={onSelect}
          cycleNonce={cycleNonce}
          showProgress={showProgress}
        />

        {/* AnimatePresence + mode="wait" coordinates the swap-out and
            swap-in so they don't overlap in flow. Keyed on the viz id
            (cycleNonce isn't needed — replaying the SAME viz is fine
            via internal IO + key on the inner div). */}
        <VisualizationCard>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${current.id}-${cycleNonce}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={tweens.entry}
              className="flex w-full justify-center"
            >
              {current.visualization}
            </motion.div>
          </AnimatePresence>
        </VisualizationCard>
      </div>
    </div>
  );
}

function TopicRow({
  active,
  onSelect,
  cycleNonce,
  showProgress,
}: {
  active: TopicId;
  onSelect: (id: TopicId) => void;
  cycleNonce: number;
  showProgress: boolean;
}) {
  return (
    <div
      className="
        grid grid-cols-1 gap-[45px]
        md:grid-cols-3 md:items-stretch
      "
    >
      {TOPICS.map((topic) => (
        <TopicItem
          key={topic.id}
          topic={topic}
          isActive={topic.id === active}
          onSelect={() => onSelect(topic.id)}
          cycleNonce={cycleNonce}
          showProgress={showProgress}
        />
      ))}
    </div>
  );
}

/**
 * "See docs →" — sits at the bottom of each topic card. Visual
 * matches the FAQ "Quick-start guide →" link exactly: same font
 * token, salmon hover, arrow nudge on group-hover/cta. Always mounted
 * so swapping topics doesn't reflow the column.
 *
 * Stop-propagation on click — the surrounding TopicItem is a
 * role="button" that switches the active card; without it, clicking
 * the docs link would also trigger a no-op selection of the already-
 * active card.
 */
function SeeDocsLink({ href, active }: { href: string; active: boolean }) {
  // "See docs" is always visible (and keyboard-focusable) on every
  // topic card. Unselected cards dim their link to match their dimmed
  // (frost/70) title + body text; the active card shows it full.
  const reachable = true;
  return (
    <Link
      href={appendRef(href, "home")}
      underline={false}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "group/cta relative z-10 mt-auto inline-flex w-fit items-center pl-8 text-v1-label-md uppercase",
        "motion-safe:transition-[color,opacity] motion-safe:duration-300",
        "hover:text-v1-accent-salmon",
        active ? "opacity-100" : "opacity-70"
      )}
      tabIndex={reachable ? 0 : -1}
      aria-hidden={!reachable}
    >
      <span>See docs</span>
      <span
        aria-hidden="true"
        className="ml-2 inline-block motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover/cta:translate-x-[6px]"
      >
        →
      </span>
    </Link>
  );
}

function TopicItem({
  topic,
  isActive,
  onSelect,
  cycleNonce,
  showProgress,
}: {
  topic: Topic;
  isActive: boolean;
  onSelect: () => void;
  cycleNonce: number;
  showProgress: boolean;
}) {
  const ease =
    "motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-v1-out";

  // role="button" rather than a real <button> so the nested <Link>
  // (the per-card "See docs →") is valid HTML — interactive elements
  // can't nest inside each other.
  //
  // Grid rows [auto / 1fr / auto] (title / body / link) park the
  // docs link at the bottom of EVERY card uniformly, regardless of
  // how many body lines each topic has. `mt-auto` alone failed here
  // because the tallest-body card had no slack left to distribute
  // — the 1 fr middle row absorbs the slack identically per card.
  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={isActive ? "true" : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "group/topic relative grid h-full w-full cursor-pointer grid-rows-[auto_1fr_auto] gap-3 rounded-md px-2 py-6 text-left",
        ease,
        "hover:bg-v1-frost/[0.035] focus-visible:bg-v1-frost/[0.04] focus-visible:outline-none"
      )}
    >
      <div className="flex w-full items-start gap-2 md:items-center">
        <span
          aria-hidden="true"
          className="flex h-[32px] w-[24px] shrink-0 items-center justify-center md:h-auto"
        >
          <span
            className={cn(
              "size-2 motion-safe:transition-[background-color,transform] motion-safe:duration-300 motion-safe:ease-v1-out",
              isActive
                ? "bg-v1-accent-salmon motion-safe:animate-pulse"
                : "bg-v1-steel group-hover/topic:translate-x-[2px] group-hover/topic:bg-v1-frost"
            )}
          />
        </span>
        <span
          className={cn(
            "font-v1Heading tracking-[-0.01em] text-[24px] leading-[32px] md:whitespace-nowrap md:text-[length:clamp(1.125rem,1.85vw,1.625rem)] md:leading-[1.2]",
            ease,
            isActive
              ? "text-v1-frost"
              : "text-v1-frost/70 group-hover/topic:text-v1-frost"
          )}
        >
          {topic.title}
        </span>
      </div>
      <p
        className={cn(
          "pl-8 font-v1Body leading-[1.5] text-[16px] tracking-[-0.01em] md:text-[length:clamp(0.8rem,1.15vw,1rem)] md:tracking-normal",
          ease,
          isActive
            ? "text-[#B3B3B3]"
            : "text-v1-frost/70 group-hover/topic:text-v1-frost/90"
        )}
      >
        {topic.body}
      </p>

      <SeeDocsLink href={topic.docsHref} active={isActive} />

      {/* Active-topic progress bar — keyed by nonce so the fill
          replays at each cycle tick. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2 top-0 block h-[2px] overflow-hidden bg-v1-frost/[0.08]"
        style={{ opacity: isActive && showProgress ? 1 : 0 }}
      >
        {isActive && showProgress && (
          <span
            key={`progress-${topic.id}-${cycleNonce}`}
            className="v1-trusted-progress block h-full w-full bg-v1-accent-salmon"
            style={{ ["--cycle-ms" as string]: `${CYCLE_MS}ms` }}
          />
        )}
      </span>
    </div>
  );
}

interface CisoFeature {
  title: string;
  body: ReactNode;
}

const CISO_FEATURES: CisoFeature[] = [
  {
    title: "SOC 2 Compliant",
    body: (
      <>
        Regular security audits and compliance with SOC 2 standards.{" "}
        <Link href={appendRef("/security", "home")} underline>
          Read more here
        </Link>
        .
      </>
    ),
  },
  {
    title: "E2E Encryption",
    body: "Encrypt all data that passes through Inngest with end-to-end encryption middleware.",
  },
  {
    title: "SSO & SAML",
    body: "Single sign-on and SAML support for enterprise customers.",
  },
  {
    title: "100K+ Execution per second",
    body: "Designed for your heavy workloads with capacity for bursting.",
  },
  {
    title: "Low Latency",
    body: "Inngest is designed to be low latency for all functions.",
  },
  {
    title: "HIPAA BAA Available",
    body: "Ready to handle sensitive data.",
  },
];

function CisoBlock() {
  return (
    <div className="flex flex-col gap-[62px] lg:pb-16">
      <div className="flex flex-col gap-6">
        {/* Secondary card title — display-xs (40px) at lg for a smaller
            hierarchy below the section h2; the 24px mobile size has no
            matching token, so it stays a bespoke step-down. */}
        <h2 className="max-w-[290px] text-[24px] leading-[1.25] tracking-[-0.01em] uppercase text-v1-frost lg:max-w-none lg:text-balance lg:text-v1-display-xs">
          Stuff your CISO needs to see
        </h2>
        {/* !tracking-normal overrides the token's baked-in -0.01em. */}
        <p className="text-v1-body-lg !tracking-normal text-v1-frost">
          No fancy animations here&mdash;just the facts. We serve heavily
          regulated industries, and have the certs to prove it.
        </p>
      </div>

      <CisoGrid />
    </div>
  );
}

function CisoGrid() {
  return (
    <ul
      className="
        grid grid-cols-1 gap-x-8 gap-y-6
        sm:grid-cols-2 sm:gap-y-[58px]
        lg:grid-cols-3
      "
    >
      {CISO_FEATURES.map((feature, i) => (
        <motion.li
          key={feature.title}
          {...reveals.item(i)}
          className="flex flex-col gap-4"
        >
          <h3 className="text-v1-heading-xs-loose text-v1-frost lg:text-v1-heading-sm">
            {feature.title}
          </h3>
          <p className="text-pretty text-v1-body-sm !tracking-normal text-v1-frost">
            {feature.body}
          </p>
        </motion.li>
      ))}
    </ul>
  );
}

function VisualizationCard({ children }: { children: ReactNode }) {
  return (
    <GradientFrame
      variant="charcoal"
      className="w-full rounded-[9.026px]"
      innerClassName="
        relative flex w-full min-h-[220px] items-center justify-center
        px-4 py-6
        lg:h-[645px] lg:px-[36px] lg:py-12
      "
    >
      {children}
    </GradientFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  Throughput line chart — native SVG
// ─────────────────────────────────────────────────────────────────────

const CHART_W = 1173;
// Mobile uses a taller viewBox so the plot has real vertical room
// after the bumped axis fonts + stacked legend eat the bottom pad.
// Both heights include the title headroom (CHART_PAD_T_*) below, so
// growing that pad grows the viewBox 1:1 and the plot keeps its size.
const CHART_H_DESKTOP = 537;
const CHART_H_MOBILE = 996;
const CHART_PAD_L = 32;
const CHART_PAD_R = 16;
// Top pad reserves room for the chart title above the plot's first
// gridline. Responsive because the mobile title font is ~2.5x desktop
// (15 → 38px) and would otherwise crowd the top "15" axis label.
const CHART_PAD_T_DESKTOP = 60;
const CHART_PAD_T_MOBILE = 132;
const CHART_PAD_B_DESKTOP = 72;
const CHART_PAD_B_MOBILE = 220;
const CHART_LEGEND_ROW_H_MOBILE = 70;
const CHART_Y_MAX = 15;
const CHART_Y_TICKS = [0, 3, 6, 9, 12, 15];
const CHART_X_LABELS = ["16:00", "22:30", "05:00", "11:30"];
const CHART_POINTS = 70;

const CHART_SERIES = [
  // Each series is generated deterministically from a sine mix so the
  // chart looks chaotic but stable across renders / SSR.
  { label: "Create chat completion", colour: "#5fc34a", base: 6.0, amp: 3.2, seed: 1 },
  { label: "Data warehouse sync",     colour: "#1b34c9", base: 2.6, amp: 1.0, seed: 2 },
  { label: "Delete integration data", colour: "#e6443f", base: 8.0, amp: 2.6, seed: 3 },
  { label: "Generate video",          colour: "#ff8c80", base: 8.4, amp: 2.6, seed: 4 },
] as const;

function makeSeries(seed: number, base: number, amp: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < CHART_POINTS; i++) {
    const t = i / (CHART_POINTS - 1);
    const v =
      base +
      Math.sin(t * 9.7 + seed * 1.13) * amp * 0.5 +
      Math.sin(t * 27.3 + seed * 2.41) * amp * 0.35 +
      Math.sin(t * 53.9 + seed * 3.67) * amp * 0.22;
    arr.push(Math.max(0, Math.min(CHART_Y_MAX, v)));
  }
  return arr;
}

function ThroughputChart() {
  // SVG scales with container width via viewBox. At mobile widths
  // (~313 px) the scale is ~0.27x, which shrinks desktop-tuned 13 px
  // labels to ~3.5 px (unreadable). Bump every font + the legend
  // swatch on mobile and stack the legend 2x2 so labels stay legible.
  const isDesktop = useIsDesktop();
  const fs = isDesktop
    ? { title: 15, axis: 13, legend: 13, swatch: 14 }
    : { title: 38, axis: 32, legend: 30, swatch: 30 };
  const chartH = isDesktop ? CHART_H_DESKTOP : CHART_H_MOBILE;
  const padT = isDesktop ? CHART_PAD_T_DESKTOP : CHART_PAD_T_MOBILE;
  const padB = isDesktop ? CHART_PAD_B_DESKTOP : CHART_PAD_B_MOBILE;
  const legendCols = isDesktop ? 4 : 2;
  const legendRowH = isDesktop ? 0 : CHART_LEGEND_ROW_H_MOBILE;

  const plotW = CHART_W - CHART_PAD_L - CHART_PAD_R;
  const plotH = chartH - padT - padB;
  const xAt = (i: number) => CHART_PAD_L + (plotW * i) / (CHART_POINTS - 1);
  const yAt = (v: number) => padT + plotH - (plotH * v) / CHART_Y_MAX;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${CHART_W} ${chartH}`}
        // Cap to the fixed card's content box (645px − py-12) so the
        // chart fits the shared height instead of overflowing it; the
        // viewBox meets/centres within whatever width remains.
        className="block h-auto w-full lg:max-h-[549px]"
        role="img"
        aria-label="Total runs throughput chart across a 24-hour window with four series."
      >
        {/* Title */}
        <text
          x={CHART_PAD_L}
          y={fs.title + 7}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize={fs.title}
          fill="#bfc1c8"
        >
          Total runs throughput
        </text>

        {/* Y-axis ticks + horizontal gridlines */}
        {CHART_Y_TICKS.map((v) => {
          const y = yAt(v);
          return (
            <g key={v}>
              <line
                x1={CHART_PAD_L}
                x2={CHART_W - CHART_PAD_R}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
              <text
                x={CHART_PAD_L - 6}
                y={y + 4}
                textAnchor="end"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize={fs.axis}
                fill="#7d7f88"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {CHART_X_LABELS.map((lbl, i) => {
          const x =
            CHART_PAD_L + (plotW * i) / (CHART_X_LABELS.length - 1);
          return (
            <text
              key={lbl}
              x={x}
              y={padT + plotH + fs.axis + 16}
              textAnchor={i === 0 ? "start" : i === CHART_X_LABELS.length - 1 ? "end" : "middle"}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize={fs.axis}
              fill="#7d7f88"
            >
              {lbl}
            </text>
          );
        })}

        {/* Series lines. `pathLength=1` normalises stroke-dasharray
            so all four animate uniformly regardless of actual length. */}
        {CHART_SERIES.map((s, idx) => {
          const data = makeSeries(s.seed, s.base, s.amp);
          const d = data
            .map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`)
            .join(" ");
          return (
            <path
              key={s.label}
              d={d}
              fill="none"
              stroke={s.colour}
              strokeWidth={1.8}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              className="v1-chart-line"
              style={{
                ["--len" as string]: "1",
                animationDelay: `${idx * 500}ms`,
              }}
            />
          );
        })}

        {/* Legend — 4 cols on desktop, 2x2 grid on mobile so labels
            don't compress into illegible chips. */}
        {CHART_SERIES.map((s, i) => {
          const col = i % legendCols;
          const row = Math.floor(i / legendCols);
          const x = CHART_PAD_L + (plotW * col) / legendCols;
          const y = chartH - 18 - (legendRowH * (Math.ceil(CHART_SERIES.length / legendCols) - 1 - row));
          return (
            <g key={`legend-${s.label}`}>
              <rect x={x} y={y - fs.swatch + 4} width={fs.swatch} height={fs.swatch} fill={s.colour} />
              <text
                x={x + fs.swatch + 8}
                y={y + 1}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize={fs.legend}
                fill="#bfc1c8"
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  Trace waterfall — native HTML grid
// ─────────────────────────────────────────────────────────────────────

interface WaterfallRow {
  label: string;
  indent: 0 | 1 | 2;
  /** Span duration, shown in the column between label and bar. */
  duration: string;
  /** % of the timeline where the bar starts. */
  start: number;
  /** % of the timeline the bar occupies. */
  width: number;
  /** Bullet glyph for the row label. */
  glyph?: "check" | "caret";
}

// Positions, widths, and durations are lifted 1:1 from the design's
// trace. Timeline origin x=545.15, track width=565.56; each bar's
// start%/width% is its offset over that track. The leaf spans cascade
// as a staircase — that's the intended waterfall read.
const WATERFALL_ROWS: WaterfallRow[] = [
  { label: "Run", indent: 0, duration: "11.580s", start: 0, width: 100, glyph: "check" },
  { label: "Insights Event Matcher", indent: 0, duration: "1.702s", start: 0, width: 15.78 },
  {
    label: "generate-thread-id",
    indent: 1,
    duration: "1ms",
    start: 8.53,
    width: 1.28,
    glyph: "caret",
  },
  {
    label: "generate-target-channel",
    indent: 1,
    duration: "1ms",
    start: 12.8,
    width: 1.28,
    glyph: "caret",
  },
  {
    label: "generate-network-id",
    indent: 1,
    duration: "1ms",
    start: 17.06,
    width: 1.28,
    glyph: "caret",
  },
  {
    label: "publish:user:insights:user_2UdJajr…",
    indent: 1,
    duration: "7ms",
    start: 20.68,
    width: 1.28,
    glyph: "caret",
  },
  {
    label: "generate-agent-ids-0",
    indent: 1,
    duration: "1ms",
    start: 24.95,
    width: 1.28,
    glyph: "caret",
  },
  {
    label: "publish: user:insights:user_2UdJajr…",
    indent: 1,
    duration: "5ms",
    start: 29.21,
    width: 1.28,
    glyph: "caret",
  },
  { label: "Insights Query Writer", indent: 0, duration: "5.024s", start: 35.17, width: 53.09 },
  {
    label: "generate-tool-part-id-c9561480-999…",
    indent: 1,
    duration: "1ms",
    start: 46.27,
    width: 1.28,
    glyph: "caret",
  },
  {
    label: "publish:user:insights:user_2UdJajr…",
    indent: 1,
    duration: "4ms",
    start: 48.4,
    width: 1.28,
    glyph: "caret",
  },
  {
    label: "publish:user:insights:user_2UdJajr…",
    indent: 1,
    duration: "5ms",
    start: 51.82,
    width: 1.28,
    glyph: "caret",
  },
];

const WATERFALL_GREEN = "#0bdd48";
// The whole trace plays over this window. Each bar's delay + duration
// are pinned to its real start% / width% on the timeline so the spans
// fire at their actual moments — Run keeps drawing through the entire
// window, children blip in at their points in time.
const WATERFALL_TOTAL_MS = 3000;
// Minimum animation duration so 1–2 % width bars don't snap in (a real
// trace's short spans still take a perceptible beat to "land").
const WATERFALL_MIN_BAR_MS = 160;
// Row pitch in px (row-to-row spacing is 43.41). Fixed across
// breakpoints so the absolutely-positioned tree spine stays aligned.
const WATERFALL_ROW_H = 43;
// Label vs duration colours: labels read as muted carbon/300,
// durations pop as carbon/50.
const WATERFALL_LABEL = "#7c7c7c"; // carbon/300
const WATERFALL_DURATION = "#fefefe"; // carbon/50

// Success glyph fronting the root "Run" row: a solid green disc with a
// dark tick cut through it (filled circle, not an outline ring).
function RunCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill={WATERFALL_GREEN} opacity="0.1" />
      <path
        d="M5.2 9.2 8 12 12.8 6.2"
        stroke="#0BDD48"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TraceWaterfall() {
  return (
    <div className="relative w-full">
      {/* Vertical tree spine: runs from the Insights Event Matcher row
          down to the last span. Anchored to the fixed row pitch so it
          stays aligned across breakpoints. */}
      <span
        aria-hidden="true"
        className="absolute left-[10px] w-px bg-v1-frost/25"
        style={{
          top: WATERFALL_ROW_H,
          height:
            (WATERFALL_ROWS.length - 1) * WATERFALL_ROW_H - WATERFALL_ROW_H / 2,
        }}
      />
      <div
        role="img"
        aria-label="Trace waterfall showing a Run with nested Insights Event Matcher and Insights Query Writer spans firing in real time."
        className="relative grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)] gap-x-4 font-v1Mono text-[15px] sm:text-[16px] lg:text-[16.88px]"
        style={{ lineHeight: `${WATERFALL_ROW_H}px`, color: WATERFALL_LABEL }}
      >
        {WATERFALL_ROWS.map((row, i) => {
          const delay = (row.start / 100) * WATERFALL_TOTAL_MS;
          const animMs = Math.max(
            WATERFALL_MIN_BAR_MS,
            (row.width / 100) * WATERFALL_TOTAL_MS
          );
          return (
            <div key={i} className="contents">
              <div
                className="flex items-center whitespace-nowrap"
                style={{ paddingLeft: row.indent === 0 ? 0 : 35 }}
              >
                {/* fixed gutter so parent labels align at the same x
                    whether or not they carry a glyph */}
                <span className="flex w-7 shrink-0 items-center">
                  {row.glyph === "check" && <RunCheck />}
                  {row.glyph === "caret" && (
                    <span aria-hidden="true" className="pl-[3px] text-v1-frost/45">
                      ▸
                    </span>
                  )}
                </span>
                <span className="truncate">{row.label}</span>
              </div>
              <div
                className="whitespace-nowrap text-right tabular-nums"
                style={{ color: WATERFALL_DURATION }}
              >
                {row.duration}
              </div>
              <div
                className="relative flex items-center"
                style={{ height: WATERFALL_ROW_H }}
              >
                {/* faint baseline so the row's lane reads as a track */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-v1-frost/[0.07]"
                />
                <span
                  className="v1-trace-bar absolute h-[22px] rounded-[2px]"
                  style={{
                    left: `${row.start}%`,
                    // min-width so 1.5 %–width bars aren't a single pixel.
                    width: `max(${row.width}%, 6px)`,
                    background: WATERFALL_GREEN,
                    ["--delay" as string]: `${delay}ms`,
                    ["--dur" as string]: `${animMs}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Preserves the designer-authored "toUnixTimestamo" typo for visual parity.
const SQL_GREEN = "#0bdd48";
const SQL_SALMON = "#fb5536";
const SQL_GRAY = "#7c7c7c";

type SqlSegment = { text: string; color: string };
interface SqlLine {
  indent: 0 | 1;
  segments: SqlSegment[];
}

// Structured form so the typewriter can slice the rendered output by
// character count without re-walking React children. Each segment is
// rendered as one coloured span; only the prefix up to `revealCount`
// is painted.
const SQL_LINES: SqlLine[] = [
  { indent: 0, segments: [{ text: "SELECT DISTINCT", color: SQL_GREEN }] },
  {
    indent: 1,
    segments: [
      { text: "data.user.email AS ", color: SQL_GREEN },
      { text: "USER", color: SQL_SALMON },
    ],
  },
  { indent: 0, segments: [{ text: "FROM", color: SQL_GREEN }] },
  { indent: 1, segments: [{ text: "events", color: SQL_GREEN }] },
  { indent: 0, segments: [{ text: "WHERE", color: SQL_GREEN }] },
  {
    indent: 1,
    segments: [
      { text: "name = ", color: SQL_GREEN },
      { text: "‘insights/query.executed’", color: SQL_SALMON },
    ],
  },
  {
    indent: 1,
    segments: [
      { text: "AND ", color: SQL_GRAY },
      { text: "ts > multiply", color: SQL_GREEN },
      { text: " (", color: SQL_GRAY },
      { text: "toUnixTimestamo", color: SQL_GREEN },
      { text: " (", color: SQL_GRAY },
      { text: "subtractDays", color: SQL_GREEN },
      { text: " (", color: SQL_GRAY },
      { text: "now", color: SQL_GREEN },
      { text: " (), ", color: SQL_GRAY },
      { text: "90", color: SQL_SALMON },
      { text: ")), ", color: SQL_GRAY },
      { text: "1000", color: SQL_SALMON },
      { text: ")", color: SQL_GRAY },
    ],
  },
];

const SQL_TOTAL_CHARS = SQL_LINES.reduce(
  (acc, line) =>
    acc + line.segments.reduce((sum, seg) => sum + seg.text.length, 0),
  0
);
const SQL_MS_PER_CHAR = 12;
const SQL_TOTAL_MS = SQL_TOTAL_CHARS * SQL_MS_PER_CHAR;

function SqlBlock() {
  const [revealCount, setRevealCount] = useState(0);
  const ref = useRef<HTMLPreElement>(null);
  // Gate the typewriter on intersection so a user who lands mid-page
  // (or clicks the troubleshoot topic and immediately scrolls away)
  // still sees the animation play when the block enters view, rather
  // than finishing silently off-screen.
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
            return;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealCount(SQL_TOTAL_CHARS);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SQL_TOTAL_MS);
      // Slight ease-out so the typewriter slows as it finishes the
      // last statement — feels more deliberate than a flat cadence.
      const eased = 1 - Math.pow(1 - t, 1.6);
      setRevealCount(Math.round(eased * SQL_TOTAL_CHARS));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  // First pass: find the line the caret sits on — the line where the
  // revealed prefix currently ends. Must be computed up-front (not while
  // mapping) because the caret's JSX condition is evaluated eagerly per
  // line; mutating it mid-map would leave it stuck on line 0. Once every
  // char is typed this resolves to the last line, so the caret blinks at
  // the end of the query.
  let caretLine = SQL_LINES.length - 1;
  let caretAccum = revealCount;
  for (let i = 0; i < SQL_LINES.length; i++) {
    const lineLen = SQL_LINES[i].segments.reduce(
      (sum, seg) => sum + seg.text.length,
      0
    );
    if (caretAccum <= lineLen) {
      caretLine = i;
      break;
    }
    caretAccum -= lineLen;
  }

  // Second pass (during render): slice each line's segments by revealCount.
  let remaining = revealCount;

  return (
    <pre ref={ref} className="text-v1-code w-full overflow-x-auto">
      <code className="block min-w-max">
        {SQL_LINES.map((line, i) => {
          let lineLen = 0;
          for (const seg of line.segments) lineLen += seg.text.length;
          const lineStartRemaining = remaining;

          // Slice this line's segments by remaining count.
          const slicedSegments: SqlSegment[] = [];
          let segRemaining = remaining;
          for (const seg of line.segments) {
            if (segRemaining <= 0) break;
            const take = Math.min(seg.text.length, segRemaining);
            slicedSegments.push({ ...seg, text: seg.text.slice(0, take) });
            segRemaining -= take;
          }
          remaining = Math.max(0, remaining - lineLen);

          // Gutter is always lit so the line numbers don't pop in late.
          return (
            <div key={i} className="flex">
              <span
                aria-hidden="true"
                className="w-[15px] shrink-0 select-none text-center"
                style={{ color: SQL_GRAY }}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "whitespace-pre",
                  line.indent === 0 ? "ml-[26px]" : "ml-[43px]"
                )}
              >
                {slicedSegments.length === 0 && lineStartRemaining === 0 ? (
                  // Line hasn't been reached yet — render an
                  // empty span so the row reserves its height.
                  <span>&nbsp;</span>
                ) : (
                  slicedSegments.map((seg, sj) => (
                    <Tk key={sj} c={seg.color}>
                      {seg.text}
                    </Tk>
                  ))
                )}
                {caretLine === i && (
                  <span
                    aria-hidden="true"
                    className="v1-sql-caret"
                    style={{ color: SQL_GREEN }}
                  >
                    &nbsp;
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </code>
    </pre>
  );
}

function Tk({ c, children }: { c: string; children: ReactNode }) {
  return <span style={{ color: c }}>{children}</span>;
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import { appendRef } from "@/utils/v1/ref";
import { WipeLabel } from "@/components/v1/sections/shared/WipeLabel";
import { tweens, V1_CYCLE_MS } from "@/utils/v1/springs";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import SetupGraphic from "@/components/v1/sections/AI/lifecycle/SetupGraphic";
import ReliabilityGraphic from "@/components/v1/sections/AI/lifecycle/ReliabilityGraphic";
import ScaleGraphic from "@/components/v1/sections/AI/lifecycle/ScaleGraphic";
import ObserveGraphic from "@/components/v1/sections/AI/lifecycle/ObserveGraphic";

/**
 * AI page "First function to full production" section — a 4-tab story
 * that walks through Setup → Reliability → Scale → Observe. Selecting
 * a tab swaps the title / body / CTA and the right-column screenshot.
 *
 * Layout:
 *   - Headline pair ("FIRST FUNCTION" left, "TO FULL PRODUCTION" right)
 *   - Tab nav (4 equal columns, orange underline on active)
 *   - 2-col body: copy left (1/3), screenshot right (2/3)
 *
 * Below `lg`, the body collapses to a single column with the screenshot
 * below the copy. The headline pair stays side-by-side until very
 * narrow viewports, then stacks.
 *
 * Typography: headline + tab labels use raw font utilities (a
 * `lh = font-size`-tight headline and a 20px Mono label with no
 * equivalent design-system class). Title and body use the matching v1
 * tokens (text-v1-heading-card and text-v1-body-sm).
 */

interface Tab {
  id: string;
  number: string;
  label: string;
  title: string;
  body: ReactNode;
  ctaLabel: string;
  ctaHref: string;
  /**
   * Code-rendered illustration for this tab. Replaces the raster
   * /assets/v1/lifecycle/N.webp images so the chrome stays crisp at
   * any density and the colours stay tied to the v1 token set.
   */
  graphic: ReactNode;
}

// `\n` in `title` / `body` preserves designer-authored line breaks —
// rendered via `whitespace-pre-line`. `\n\n` produces a blank-line
// paragraph break.
const TABS: Tab[] = [
  {
    id: "setup",
    number: "01",
    label: "Setup",
    title: "Wrap functions. No rewrites.\nYour existing code, your\nexisting infra.",
    body: "Install the SDK.\nServe one HTTP endpoint.\nWrap any async function.",
    ctaLabel: "Quick Start",
    ctaHref: "/docs/getting-started/python-quick-start",
    graphic: <SetupGraphic />,
  },
  {
    id: "reliability",
    number: "02",
    label: "Reliability",
    title: "Avoid wasteful reruns",
    // `step.run()` renders as inline salmon-mono code so the sentence
    // flows naturally; only the `\n\n` paragraph break is preserved via
    // the body's `whitespace-pre-line`.
    body: (
      <>
        Each <code className="font-v1Mono text-v1-accent-salmon">step.run()</code>{" "}
        is an atomic checkpoint. A failure at step 7 retries only step 7 — the
        tokens and API calls from steps 1–6 are never respent.
        {"\n\n"}The core problem is solved.
      </>
    ),
    ctaLabel: "Step Functions Docs",
    ctaHref: "/docs/learn/inngest-functions",
    graphic: <ReliabilityGraphic />,
  },
  {
    id: "scale",
    number: "03",
    label: "Scale",
    title: "Control who gets what.",
    body: "Per-user concurrency limits, global throttles, and priority queuing for premium tiers — all in config. One user's burst can't exhaust your rate limits for everyone else.",
    ctaLabel: "Flow Control Docs",
    ctaHref: "/docs/guides/flow-control",
    graphic: <ScaleGraphic />,
  },
  {
    id: "observe",
    number: "04",
    label: "Observe",
    title: "See everything.\nFix fast.",
    body: "Every step, every LLM prompt and response, every token cost — captured automatically in a live trace UI. See exactly what failed, replay it in bulk after a fix, and ship with confidence.",
    ctaLabel: "Observability & Traces Docs",
    ctaHref: "/docs/platform/monitor/observability-metrics",
    graphic: <ObserveGraphic />,
  },
];

const CYCLE_MS = V1_CYCLE_MS;

export default function Lifecycle() {
  const [active, setActive] = useState(0);
  // Bumped each time inView flips true and on every auto-advance so
  // the active tab's progress bar can replay from 0 even when the
  // index doesn't visibly change (e.g. wrapping back to 0).
  const [cycleNonce, setCycleNonce] = useState(0);
  // User clicks on a tab → stop auto-cycling permanently. They've
  // taken control; we don't fight them.
  const [userTookControl, setUserTookControl] = useState(false);
  const [inView, setInView] = useState(false);
  // Hover anywhere on the tab nav pauses the reel without ending
  // it. Ref-counted because pointermove between tabs would fire
  // leave-then-enter and could otherwise drop the count to 0.
  const hoverCountRef = useRef(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasEnteredRef = useRef(false);

  // IO gate — don't burn the cycle on a section that's offscreen.
  // First entry seeds cycleNonce so the progress bar starts in sync
  // with the user reaching the section.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setInView(e.isIntersecting);
          if (e.isIntersecting && !hasEnteredRef.current) {
            hasEnteredRef.current = true;
            setCycleNonce((n) => n + 1);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Read inside an effect (and subscribe to changes) so SSR and the
  // first client render agree — reading window.matchMedia in the
  // render body causes a hydration mismatch.
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // The auto-advance interval. Always progresses while in view (and
  // before the user clicks) — hovering a tab no longer pauses the
  // cycle, since users were stalling on step 1 just by reading
  // the body copy. Same fix applied to TrustedInBigLeagues.
  useEffect(() => {
    if (userTookControl || !inView || reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % TABS.length);
      setCycleNonce((n) => n + 1);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [userTookControl, inView, reduceMotion]);

  const onSelect = (i: number) => {
    setActive(i);
    setUserTookControl(true);
  };
  const onHoverEnter = () => {
    hoverCountRef.current += 1;
  };
  const onHoverLeave = () => {
    hoverCountRef.current = Math.max(0, hoverCountRef.current - 1);
  };

  const tab = TABS[active];
  const showProgress = !userTookControl && inView && !reduceMotion;

  return (
    <Section
      ref={sectionRef}
      aria-label="From first function to full production"
      className="relative"
      containerClassName="flex flex-col gap-12"
    >
      <Headline />
      <TabNav
        tabs={TABS}
        activeIndex={active}
        onSelect={onSelect}
        onHoverEnter={onHoverEnter}
        onHoverLeave={onHoverLeave}
        showProgress={showProgress}
        cycleNonce={cycleNonce}
      />
      {/* AnimatePresence coordinates the out → in transition between
          tabs so the body, copy, and screenshot fade together on the
          shared `tweens.entry` curve. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={tweens.entry}
        >
          <TabBody tab={tab} />
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

function Headline() {
  // One-shot IO so the four-word stagger only plays on first entry —
  // no re-trigger on scroll back, no Schmitt-trigger flicker.
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Per-word motion. Each word uses the shared `tweens.entry` curve
  // with the legacy hand-tuned delay so the cadence is unchanged but
  // the physics now lives in the v1 vocabulary instead of a one-off
  // CSS keyframe.
  const word = (text: string, delay: number) => (
    <motion.span
      className="block"
      initial={{ opacity: 0, y: 14 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ ...tweens.entry, delay: delay / 1000 }}
    >
      {text}
    </motion.span>
  );

  return (
    <div ref={wrapRef} className="relative">
      {/* Mobile: single left-aligned headline. Lg+: two-bookend pair
          anchored to opposite edges of the wide row. */}
      <p className="font-v1Display text-[32px] uppercase leading-[1.05] tracking-[-0.01em] text-v1-frost sm:text-[52px] sm:leading-[0.9] lg:hidden">
        {word("First", 60)}
        {word("Function", 180)}
        {word("To Full", 320)}
        {word("Production", 460)}
      </p>
      <div className="hidden lg:flex lg:flex-wrap lg:items-start lg:justify-between lg:gap-x-12 lg:gap-y-4">
        <p className="font-v1Display uppercase tracking-[-0.01em] text-v1-frost lg:text-[64px] lg:leading-[0.9]">
          {word("First", 60)}
          {word("Function", 180)}
        </p>
        <p className="font-v1Display text-right uppercase tracking-[-0.01em] text-v1-frost lg:text-[64px] lg:leading-[0.9]">
          {word("To Full", 320)}
          {word("Production", 460)}
        </p>
      </div>
    </div>
  );
}

function TabNav({
  tabs,
  activeIndex,
  onSelect,
  onHoverEnter,
  onHoverLeave,
  showProgress,
  cycleNonce,
}: {
  tabs: Tab[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  showProgress: boolean;
  cycleNonce: number;
}) {
  return (
    // Tab rail mirrors the carousel progress-rail vocabulary EXACTLY:
    // flex with 6 px gap, each segment h-1 frost/20 base with frost
    // fill, animation via the shared `v1-carousel-progress` keyframe
    // over `V1_CYCLE_MS` (7 s). Labels sit above the rail; both
    // labels paint salmon left-to-right on tab hover.
    <div role="tablist" className="flex flex-col gap-[10px]">
      <div className="flex gap-1.5">
        {tabs.map((tab, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`lifecycle-panel-${tab.id}`}
              id={`lifecycle-tab-${tab.id}`}
              onClick={() => onSelect(i)}
              onPointerEnter={onHoverEnter}
              onPointerLeave={onHoverLeave}
              className={cn(
                "group/tab relative flex flex-1 flex-col items-center justify-center gap-1 py-3 font-v1Mono text-[12px] uppercase tracking-[-0.01em] sm:flex-row sm:gap-2 sm:text-[13px] lg:text-[14px] motion-safe:transition-opacity motion-safe:duration-200",
                isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
              )}
            >
              {/* Both number + label wrap in WipeLabel. Hovering the
                  tab triggers the left-to-right salmon fill on BOTH
                  labels at once (WipeLabel listens for `button:hover`).
                  Active tab pins the wipe to 100 %. */}
              <WipeLabel
                style={
                  isActive
                    ? ({
                        ["--v1-wipe-fill" as string]:
                          "rgb(var(--color-v1-salmon-200))",
                        backgroundSize: "100% 100%, 100% 100%",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                {tab.number}
              </WipeLabel>
              <WipeLabel
                style={
                  isActive
                    ? ({
                        ["--v1-wipe-fill" as string]:
                          "rgb(var(--color-v1-salmon-200))",
                        backgroundSize: "100% 100%, 100% 100%",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                {tab.label}
              </WipeLabel>
            </button>
          );
        })}
      </div>
      {/* Progress rail — N segments matching the carousel rails in
          line + gap + timing. Active tab paints SALMON (not frost):
          these are tabs, not a timeline. The bar only auto-fills
          while the user hasn't clicked yet — once they take control
          (`showProgress=false`) the active segment is a static
          salmon fill marking the selected tab. */}
      <div className="flex gap-1.5">
        {tabs.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={i}
              className="relative h-[2px] flex-1 overflow-hidden bg-v1-frost/20"
            >
              {isActive && showProgress && (
                <div
                  key={cycleNonce}
                  className="absolute inset-0 origin-left bg-v1-accent-salmon motion-reduce:hidden"
                  style={{
                    animation: `v1-carousel-progress ${CYCLE_MS}ms linear forwards`,
                  }}
                />
              )}
              {isActive && !showProgress && (
                <div className="absolute inset-0 bg-v1-accent-salmon" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabBody({ tab }: { tab: Tab }) {
  return (
    <div
      role="tabpanel"
      id={`lifecycle-panel-${tab.id}`}
      aria-labelledby={`lifecycle-tab-${tab.id}`}
      className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:items-center lg:gap-x-12"
    >
      <TabImage tab={tab} />
      <div className="flex flex-col items-start gap-8 lg:order-first lg:gap-[72px]">
        <h3 className="whitespace-pre-line text-v1-heading-card text-v1-frost">
          {tab.title}
        </h3>
        <p className="whitespace-pre-line text-v1-body-lg lg:text-v1-body-sm">{tab.body}</p>
        <ButtonLink href={appendRef(tab.ctaHref, "ai")} variant="primary">
          {tab.ctaLabel}
        </ButtonLink>
      </div>
    </div>
  );
}

// Width of the canvas the graphics were tuned for (≈ the desktop
// 2/3 column). The mobile renderer paints each graphic at this width
// — so its container-query (`cqw`) fonts and fixed-px elements keep
// their authored proportions — then scales the whole thing to fit the
// phone column. Dense code/trace layouts never reflow or clip; they
// read as a faithful, shrunk-down product-UI preview.
const GRAPHIC_DESIGN_W = 720;
const GRAPHIC_AR = "1600 / 1293";

function TabImage({ tab }: { tab: Tab }) {
  // Both wrappers are layout-only — each graphic component already
  // carries its own `role="img"` + `aria-label`, so adding one here
  // too would nest redundant image roles.
  return (
    <>
      {/* lg+ : graphic fills the 2/3 column, sized by container query. */}
      <div
        style={{ containerType: "inline-size" }}
        className="relative ml-auto hidden w-full overflow-hidden lg:col-span-2 lg:block lg:max-w-[88%]"
      >
        {tab.graphic}
      </div>
      {/* < lg : same graphic, scaled to fit (see GRAPHIC_DESIGN_W). */}
      <ScaledGraphic>{tab.graphic}</ScaledGraphic>
    </>
  );
}

/**
 * Mobile-only graphic frame. Measures its own width and renders the
 * graphic on a fixed `GRAPHIC_DESIGN_W` canvas scaled down to fit, so
 * the desktop-tuned composition stays intact at phone width instead of
 * clipping or reflowing. Hidden at `lg+`, where TabImage's fluid
 * container-query version takes over. Layout-only — the graphic child
 * provides the `role="img"` / label.
 */
function ScaledGraphic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / GRAPHIC_DESIGN_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden lg:hidden"
      style={{ aspectRatio: GRAPHIC_AR }}
    >
      <div
        style={{
          width: GRAPHIC_DESIGN_W,
          aspectRatio: GRAPHIC_AR,
          containerType: "inline-size",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          // Stay hidden until the first measurement lands so users
          // never see the unscaled (overflowing) canvas flash.
          visibility: scale > 0 ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

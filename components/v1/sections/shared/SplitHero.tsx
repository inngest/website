"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import ButtonLink from "@/components/v1/ButtonLink";
import { useIsDesktop } from "@/utils/v1/hooks/useIsDesktop";
import { tweens } from "@/utils/v1/springs";
import { CURSOR_SPOTLIGHT_SEED } from "@/utils/v1/cursorFx";
import { setHeroPanel, clearHeroPanel } from "@/utils/v1/heroNav";
import { cn } from "@/utils/v1/cn";

/**
 * Shared layout shell for landing-page heroes: a coloured panel on the
 * left, stippled canvas right, headline + body + CTAs in a 3-col grid.
 * Used by /ai, /webhooks-events, /scheduled-jobs (salmon) and
 * /observability, /queues-flow-control (blue). Per-page parts (canvas
 * component, headline copy, body lines) are passed as slots; the left
 * panel + spotlight + CTA styling switch on the `palette` prop.
 *
 * The Home hero does NOT use this — it diverges in layout and animation.
 */

// Per-palette chrome. Salmon = the AI/webhooks/scheduled look (outline
// "Read", white "Build", warm spotlight). Blue = the observability /
// flow-control look (flat blue/200 panel, white spotlight, dark "Read"
// + white "Build"). The panel is flat colour + the shared grain
// overlay in both — no gradient.
const PALETTE = {
  salmon: {
    panel: "bg-v1-accent-salmon",
    spotlight:
      "radial-gradient(280px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.16), transparent 78%)",
    readVariant: "secondary" as const,
    readClassName:
      "!w-full sm:!w-auto hover:!bg-v1-jetBlack hover:!border-v1-jetBlack hover:!text-v1-frost",
    buildVariant: "primary" as const,
    buildClassName:
      "!w-full sm:!w-auto hover:!bg-v1-jetBlack hover:!border-v1-jetBlack hover:!text-v1-frost",
  },
  blue: {
    panel: "bg-v1-accent-blue",
    spotlight:
      "radial-gradient(320px circle at var(--mx) var(--my), rgba(255, 255, 255, 0.18), transparent 78%)",
    readVariant: "primary" as const,
    readClassName:
      "!w-full !bg-v1-jetBlack !border-v1-jetBlack !text-v1-frost !shadow-none hover:!bg-v1-accent-salmon hover:!border-v1-accent-salmon sm:!w-auto",
    buildVariant: "primary" as const,
    buildClassName: "!w-full sm:!w-auto",
  },
} as const;

export type HeroPalette = keyof typeof PALETTE;

// SSR-renders the from-state inline so the word is at opacity 0 / y +14
// before hydration. `initial={false}` lets motion animate straight to
// `animate` without a post-hydration snap.
const heroWordEntry = (delay: number) => ({
  style: {
    opacity: 0,
    transform: "translateY(14px)",
    willChange: "transform, opacity",
  } as const,
  initial: false as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { ...tweens.entry, delay: delay / 1000 },
});

/** 0..1 scroll progress mapped over the section's own height. Single
 *  rAF, passive listener. Clamped so values past the hero stop growing. */
function useHeroScroll() {
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = rect.height || 1;
      const p = Math.min(1, Math.max(0, -rect.top / h));
      setProgress(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return { ref, progress };
}

const DOCS_URL = "/docs?ref=hero";
const SIGNUP_URL = "/sign-up?ref=hero";

export interface HeroBreadcrumbItem {
  /** Visible crumb text — rendered uppercase via the label token. */
  label: string;
  /** When present, the crumb is a link. The current (last) crumb omits
   *  this and renders as inert `aria-current` text. */
  href?: string;
}

export interface SplitHeroProps {
  /** Section → page trail above the headline (Platform / Use Case
   *  pages). Last item is treated as the current page. Omit to render
   *  no breadcrumb. */
  breadcrumbs?: HeroBreadcrumbItem[];
  headlineId: string;
  /** sr-only h1 text — the visible headline is split across columns. */
  srHeadline: string;
  /** Left-column headline lines. Each line is rendered as a staggered
   *  motion.span with delay `60 + i * 120` ms. */
  leftHeadlineLines: ReactNode[];
  /** Extra classes appended to the left headline `<p>` wrapper. */
  leftHeadlineClassName?: string;
  /** Right-column headline children — rendered inside a motion.p that
   *  fires at delay 320ms by default. */
  rightHeadline: ReactNode;
  /** Extra classes appended to the right headline motion.p wrapper. */
  rightHeadlineClassName?: string;
  /** Body copy as discrete lines. Each line is rendered into a
   *  `lg:block lg:whitespace-nowrap` span so the designer-locked line
   *  breaks hold at lg+ but the text reflows naturally on mobile. The whole
   *  paragraph fires its entry animation at delay 620ms. */
  bodyLines: ReactNode[];
  /** Canvas slot — receives `isDesktop` so the caller can gate the
   *  particle manifest off mobile. Rendered inside the right 1/3
   *  surface with the readability gradient on top. */
  canvas: (api: { isDesktop: boolean }) => ReactNode;
  /** Left-panel + CTA colourway. Defaults to the salmon look. */
  palette?: HeroPalette;
  docsHref?: string;
  signupHref?: string;
}

/**
 * Hero breadcrumb — a single uppercase mono trail ("Section / Page")
 * above the headline on Platform and Use Case heroes. Label/Md (16px
 * WhyteMono, cap-trimmed), 8px gaps, "/" dividers, frost on the
 * coloured panel. Enters with the headline
 * cascade via the shared `heroWordEntry` (reduced-motion is handled
 * centrally by the page shell's <MotionConfig reducedMotion="user">).
 */
function HeroBreadcrumb({
  items,
  delayMs = 0,
}: {
  items: HeroBreadcrumbItem[];
  delayMs?: number;
}) {
  return (
    <motion.nav
      aria-label="Breadcrumb"
      className="text-v1-label-md uppercase text-v1-frost"
      {...heroWordEntry(delayMs)}
    >
      <ol className="flex flex-wrap items-center gap-2 pl-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="select-none">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-opacity duration-200 hover:opacity-70"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}

export default function SplitHero({
  breadcrumbs,
  headlineId,
  srHeadline,
  leftHeadlineLines,
  leftHeadlineClassName,
  rightHeadline,
  rightHeadlineClassName,
  bodyLines,
  canvas,
  palette = "salmon",
  docsHref = DOCS_URL,
  signupHref = SIGNUP_URL,
}: SplitHeroProps) {
  const pal = PALETTE[palette];
  const { ref, progress } = useHeroScroll();
  const isDesktop = useIsDesktop();
  // Tell the fixed header which coloured left panel this hero paints, so
  // its nav-hover wipe stays visible over it (the header darkens the wipe
  // over the salmon panel). The opaque token lets the store ignore this
  // hero's late unmount cleanup if a newer hero has already claimed the
  // slot during a route change.
  const heroToken = useRef<object>({});
  useEffect(() => {
    const token = heroToken.current;
    setHeroPanel(palette, token);
    return () => clearHeroPanel(token);
  }, [palette]);
  const grainShift = `translate3d(0, ${(-progress * 28).toFixed(2)}px, 0)`;
  const trianglesShift = `translate3d(0, ${(progress * 18).toFixed(2)}px, 0)`;
  // Left-panel ref — needed because the section-level pointermove
  // handler computes the cursor position RELATIVE TO THE PANEL (not
  // the section). The content grid above sits at z-10 and intercepts
  // events on the panel directly, so we catch the bubble at the
  // section and write --mx/--my onto the panel itself.
  const panelRef = useRef<HTMLDivElement | null>(null);
  const handleHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  return (
    <section
      ref={ref}
      aria-labelledby={headlineId}
      onPointerMove={handleHeroPointerMove}
      className="relative w-full overflow-hidden bg-v1-canvasBase lg:min-h-[799px]"
    >
      {/* Coloured panel + grain overlay — left 2/3 (full-width mobile).
          Cursor-spotlight overlay sits on top of the grain; the
          pointermove handler lives on the SECTION (not the panel)
          because the content grid above intercepts events. */}
      <div
        ref={panelRef}
        aria-hidden="true"
        style={CURSOR_SPOTLIGHT_SEED}
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-full overflow-hidden lg:w-2/3",
          pal.panel,
        )}
      >
        <img
          src="/assets/v1/ai-hero/grain.webp"
          alt=""
          className="pointer-events-none absolute left-0 top-[-221%] h-[727%] w-[150%] max-w-none mix-blend-soft-light motion-safe:[will-change:transform]"
          style={{ transform: grainShift }}
        />
        {/* Smallish circle keeps repaints cheap; larger sizes were
            visibly jerky on the bright panel because the per-frame
            --mx/--my updates were repainting a much larger region. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: pal.spotlight }}
        />
      </div>

      {/* Canvas surface — right 1/3, desktop only. Caller is
          responsible for gating its canvas component on `isDesktop`
          so the particle manifest never ships to mobile. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 z-20 hidden h-full w-1/3 bg-v1-surfaceElevated motion-safe:[will-change:transform] lg:block"
        style={{ transform: trianglesShift }}
      >
        <div className="relative h-full w-full overflow-hidden">
          {canvas({ isDesktop })}
          {/* Top-down readability gradient — solid #1F1F1F fading to
              #202020 at 0% alpha, 143px tall. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[143px]"
            style={{
              background:
                "linear-gradient(to bottom, #1F1F1F 0%, rgba(32, 32, 32, 0) 100%)",
            }}
          />
        </div>
      </div>

      <h1 id={headlineId} className="sr-only">
        {srHeadline}
      </h1>

      {/* At mobile/sm the headline is one block — the split into two
          columns only applies at lg+. The full text comes from
          `srHeadline` so the mobile render and SR text stay in sync
          automatically. */}
      <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-x-4 gap-y-[30px] px-6 pb-8 pt-[87px] sm:px-9 lg:h-[799px] lg:grid-cols-3 lg:gap-y-0 lg:py-0 min-[1500px]:max-w-[95%] min-[1900px]:max-w-[80%]">
        {/* Mobile single-block headline. Hidden at lg+ where the split
            versions take over. The breadcrumb, when present, sits above
            it with the same 24px gap as the desktop left column. */}
        <div className="flex flex-col gap-6 lg:hidden">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <HeroBreadcrumb items={breadcrumbs} />
          )}
          <motion.p
            aria-hidden="true"
            className="text-v1-display-xs uppercase text-v1-frost"
            {...heroWordEntry(60)}
          >
            {srHeadline}
          </motion.p>
        </div>

        {/* Desktop-only left column — breadcrumb stacked above the
            headline with a 24px gap, the whole column offset 162px from
            the top. */}
        <div className="hidden lg:flex lg:flex-col lg:gap-6 lg:pt-[162px]">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <HeroBreadcrumb items={breadcrumbs} />
          )}
          <p
            aria-hidden="true"
            className={cn(
              "text-v1-display-xs uppercase text-v1-frost lg:leading-[1] lg:tracking-[-0.01em] lg:[font-size:clamp(2.5rem,4.4vw,4rem)]",
              leftHeadlineClassName,
            )}
          >
            {leftHeadlineLines.map((line, i) => (
              <motion.span
                key={i}
                className="block"
                {...heroWordEntry(60 + i * 120)}
              >
                {line}
              </motion.span>
            ))}
          </p>
        </div>

        <div className="flex flex-col gap-[30px] lg:gap-12 lg:pt-[338px]">
          {/* Desktop-only right column headline. */}
          <motion.p
            aria-hidden="true"
            className={cn(
              "hidden text-v1-display-xs uppercase text-v1-frost lg:block lg:leading-[1] lg:tracking-[-0.01em] lg:[font-size:clamp(2.5rem,4.4vw,4rem)]",
              rightHeadlineClassName,
            )}
            {...heroWordEntry(320)}
          >
            {rightHeadline}
          </motion.p>
          <motion.div
            className="flex w-full flex-col gap-[38px] sm:max-w-[321px] lg:max-w-[480px]"
            {...heroWordEntry(620)}
          >
            <p className="text-v1-body-lg !text-v1-frost lg:tracking-[-0.01em] lg:[font-size:clamp(0.7rem,1.35vw,1.125rem)] lg:[line-height:1.5]">
              {bodyLines.map((line, i) => (
                <span key={i}>
                  <span className="lg:block lg:whitespace-nowrap">{line}</span>
                  {i < bodyLines.length - 1 ? " " : null}
                </span>
              ))}
            </p>
            <div className="flex flex-col gap-[23px] lg:flex-row lg:flex-nowrap lg:items-center">
              <ButtonLink
                href={docsHref}
                variant={pal.readVariant}
                className={pal.readClassName}
              >
                Read the docs
              </ButtonLink>
              <ButtonLink
                href={signupHref}
                prefetch={false}
                variant={pal.buildVariant}
                className={pal.buildClassName}
              >
                Build for free
              </ButtonLink>
            </div>
          </motion.div>
        </div>

        {/* Spacer for the third grid column — the absolute canvas
            surface above occupies this region visually. */}
        <div aria-hidden="true" className="hidden lg:block" />
      </div>
    </section>
  );
}

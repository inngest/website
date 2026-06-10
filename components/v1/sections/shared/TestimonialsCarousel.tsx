"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AdvanceClick } from "@/components/v1/sections/shared/AdvanceClick";
import ButtonLink from "@/components/v1/ButtonLink";
import { CarouselArrow } from "@/components/v1/sections/shared/CarouselArrow";
import { useReveal } from "@/utils/v1/useReveal";
import { useInView } from "@/utils/v1/hooks/useInView";
import { cn } from "@/utils/v1/cn";
import { EASE_V1_ENTRY, EASE_V1_WIPE } from "@/utils/v1/easings";
import { V1_CYCLE_MS } from "@/utils/v1/springs";

/**
 * Testimonials carousel — three-up brand logos act as tabs, with a
 * stippled portrait paired with quote / author / CTAs and a paginated
 * rail. Stacks vertically below `sm`, two-column above. Index wraps
 * in both directions. Outer chrome (padding, headings, decoration) is
 * owned by the consuming page.
 */

export interface SlideLogo {
  src: string;
  width: number;
  height: number;
  /** Resting opacity for the inactive logo (default 0.25). Bump it for
   *  thin marks that read too faint at the default. */
  inactiveOpacity?: number;
}

export interface SlideTestimonial {
  quote: string;
  /** Optional pill rendered above the quote (e.g. "Switched from Temporal"). */
  tag?: string;
  /**
   * Optional designer-locked line breaks. When provided, each entry
   * renders as a `lg:block lg:whitespace-nowrap` span at lg+ so the
   * breaks land exactly here regardless of viewport; below lg they
   * collapse to inline flow for natural wrap. `quote` remains the
   * single-string fallback (and the source of truth for SR text).
   */
  quoteLines?: string[];
  authorName: string;
  authorTitle: string;
  caseStudyHref: string;
  portrait: string;
  portraitAlt: string;
}

export interface Slide {
  /** Stable id used for React keys and the logo's aria-label. */
  id: string;
  /** Brand name used in the logo button's accessible label. */
  label: string;
  logo: SlideLogo;
  testimonial: SlideTestimonial;
}

interface TestimonialsCarouselProps {
  slides: Slide[];
  /** Extra classes for the portrait container — e.g. blend modes. */
  portraitClassName?: string;
  /** Milliseconds each slide is held before auto-advancing. */
  autoAdvanceMs?: number;
  /**
   * Slide-direction policy.
   *   - "auto" (default, live): direction depends on prev/next —
   *     forward pulls from the left, backward pulls from the right.
   *   - "always-left": every transition slides in from the left
   *     regardless of direction. Used by the always-left testimonial
   *     rails (home / webhooks / queues) for a uniform-direction feel.
   */
  directionMode?: "auto" | "always-left";
  /**
   * Delay (ms) on the second byline line (authorTitle). 80 ms by
   * default (live cascade). Set to 0 to fire authorName + authorTitle
   * + the rest of the slide elements simultaneously.
   */
  bylineStaggerMs?: number;
  /**
   * Skip the black paint-bar that sweeps across the portrait on
   * initial reveal and on every slide rotation. Used by the test
   * pages where the user removed the "black swipe on images
   * loading in." Default false preserves live behavior.
   */
  disablePortraitReveal?: boolean;
}

// Match the HowItWorks rail + Lifecycle tab nav cadence
// (V1_CYCLE_MS = 7000) so every progress rail on the site ticks
// together.
const DEFAULT_AUTO_ADVANCE_MS = V1_CYCLE_MS;

export default function TestimonialsCarousel({
  slides,
  portraitClassName,
  autoAdvanceMs = DEFAULT_AUTO_ADVANCE_MS,
  directionMode = "auto",
  bylineStaggerMs = 80,
  disablePortraitReveal = false,
}: TestimonialsCarouselProps) {
  const [active, setActive] = useState(0);
  // Auto-advance only while the carousel is on screen, so a user who
  // scrolls past doesn't return to find the deck silently rotated.
  const [rootRef, inView] = useInView<HTMLDivElement>();
  // Track previous active index so the Portrait can pick a slide-in
  // direction (left vs right) based on the logo's position relative
  // to where we were. In "always-left" mode the direction is locked
  // so every rotation reads the same regardless of prev/next.
  const prevActiveRef = useRef(active);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    directionMode === "always-left" ? "left" : "right",
  );
  useEffect(() => {
    if (active !== prevActiveRef.current) {
      if (directionMode === "always-left") {
        setSlideDirection("left");
      } else {
        // Swiping direction is OPPOSITE of click direction — clicking
        // a logo to the right (forward) pulls the new image in from
        // the LEFT (sweeping right), and clicking left brings it in
        // from the right. Reads like physical inertia of a carousel.
        setSlideDirection(active > prevActiveRef.current ? "left" : "right");
      }
      prevActiveRef.current = active;
    }
  }, [active, directionMode]);
  const total = slides.length;
  const current = slides[active];
  const next = () => setActive((i) => (i + 1) % total);
  const prev = () => setActive((i) => (i - 1 + total) % total);

  return (
    <AdvanceClick
      ref={rootRef}
      onAdvance={next}
      ariaLabel="Show next testimonial"
      hideCursor
      className="grid cursor-grab select-none grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:items-center sm:gap-10 sm:gap-x-[clamp(16px,2vw,32px)]"
    >
      <div className="py-6 sm:py-0">
        <Portrait
          slide={current}
          className={portraitClassName}
          activeKey={active}
          slideDirection={slideDirection}
          disableReveal={disablePortraitReveal}
        />
      </div>
      <div className="flex flex-col justify-between gap-7 sm:min-h-[clamp(320px,32vw,460px)] sm:gap-[clamp(20px,3.5vw,45px)]">
        <LogoNav slides={slides} activeIndex={active} onSelect={setActive} />
        <Quote
          slide={current}
          slides={slides}
          activeKey={active}
          slideDirection={slideDirection}
          bylineStaggerMs={bylineStaggerMs}
        />
        <PaginationRail
          active={active}
          total={total}
          durationMs={autoAdvanceMs}
          running={inView && total > 1}
          onPrev={prev}
          onNext={next}
          onAdvance={next}
          prevLabel="Previous testimonial"
          nextLabel="Next testimonial"
        />
      </div>
    </AdvanceClick>
  );
}

function Portrait({
  slide,
  className,
  slideDirection,
  disableReveal = false,
}: {
  slide: Slide;
  className?: string;
  activeKey: number;
  slideDirection: "left" | "right";
  disableReveal?: boolean;
}) {
  // Smooth slide-to-slide transition: the image stays mounted at all
  // times (no remount, no blank moment between slides). On every
  // slide change a new black bar paints over the current image,
  // then collapses off — and exactly halfway through (the bar's
  // fully-covering moment) the image src swaps to the new slide so
  // when the bar slides off the right, the new image is revealed.
  const [displayedSlide, setDisplayedSlide] = useState<Slide>(slide);
  const [incomingSlide, setIncomingSlide] = useState<Slide | null>(null);
  const [barVersion, setBarVersion] = useState(0);
  const [hasFirstFired, setHasFirstFired] = useState(false);
  // The image only becomes visible AFTER the bar fully covers it,
  // and the bar only starts its sweep once the image has actually
  // finished decoding. Without that gate the bar can paint off the
  // right edge while the <img> is still blank, leaving a visible
  // empty frame for a few hundred ms on slow connections.
  const [imageReady, setImageReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const reveal = useReveal<HTMLDivElement>({
    rootMargin: "0px 0px -10% 0px",
  });

  // Initial reveal — gate on BOTH `reveal.visible` (section scrolled
  // into view) AND `imageLoaded` (the portrait has decoded). The bar
  // then sweeps over the loaded image; the image flips visible at
  // the bar's 50 % mark via a 350 ms timer (matches the bar's 700 ms
  // keyframe). Fire-and-forget timer; the component never unmounts
  // in normal use.
  //
  // When `disableReveal` is set (test pages), skip the paint-bar
  // entirely — the image flips to visible as soon as it decodes.
  useEffect(() => {
    if (disableReveal) {
      if (imageLoaded && !imageReady) setImageReady(true);
      if (imageLoaded && !hasFirstFired) setHasFirstFired(true);
      return;
    }
    if (!reveal.visible) return;
    if (!imageLoaded) return;
    if (hasFirstFired) return;
    setHasFirstFired(true);
    setBarVersion((v) => v + 1);
    window.setTimeout(() => setImageReady(true), 350);
  }, [reveal.visible, imageLoaded, hasFirstFired, disableReveal, imageReady]);

  // Subsequent slide changes — slide the new image in from the left
  // to overtake the current one. After the slide-in completes
  // (700 ms), the new slide becomes the displayedSlide and the
  // incomingSlide unmounts. No paint-collapse on rotations.
  const SLIDE_IN_MS = 700;
  useEffect(() => {
    if (slide.id === displayedSlide.id) return;
    if (!hasFirstFired) {
      setDisplayedSlide(slide);
      return;
    }
    setIncomingSlide(slide);
    const t = window.setTimeout(() => {
      setDisplayedSlide(slide);
      setIncomingSlide(null);
    }, SLIDE_IN_MS);
    return () => window.clearTimeout(t);
  }, [slide, displayedSlide.id, hasFirstFired]);

  return (
    <div
      ref={reveal.ref}
      className={cn(
        "relative aspect-[332/375] w-full overflow-hidden",
        // Mobile cap is the width that yields a ~200px height at the
        // 332/375 ratio (200 × 332/375 ≈ 177px), so the portrait stays
        // width-driven everywhere and never distorts.
        "max-w-[177px] sm:max-w-[clamp(220px,22vw,332px)]",
        className,
      )}
    >
      <Image
        src={displayedSlide.testimonial.portrait}
        alt={displayedSlide.testimonial.portraitAlt}
        fill
        sizes="332px"
        className="object-cover"
        style={{ opacity: imageReady ? undefined : 0 }}
        onLoad={() => setImageLoaded(true)}
      />
      {incomingSlide && (
        <Image
          src={incomingSlide.testimonial.portrait}
          alt={incomingSlide.testimonial.portraitAlt}
          fill
          sizes="332px"
          className="object-cover"
          style={{
            animation: `${slideDirection === "right" ? "v1PortraitSlideInRight" : "v1PortraitSlideInLeft"} ${SLIDE_IN_MS}ms ${EASE_V1_WIPE} forwards`,
            willChange: "transform",
          }}
        />
      )}
      {!disableReveal && (
        <PortraitBar key={barVersion} active={barVersion > 0} />
      )}
    </div>
  );
}

function BylineReveal({
  text,
  hasSwitched,
  swapDelayMs,
  swapKey,
  slideDirection,
}: {
  text: string;
  hasSwitched: boolean;
  swapDelayMs: number;
  swapKey: string;
  slideDirection: "left" | "right";
}) {
  // Byline slides in from the same side as the portrait on every
  // rotation. Wrapped in overflow-hidden so the off-axis text
  // doesn't paint past its column.
  const slideKeyframe =
    slideDirection === "right" ? "v1TextSlideInRight" : "v1TextSlideInLeft";
  return (
    <p className="overflow-hidden">
      <span
        key={swapKey}
        className="block"
        style={{
          animation: hasSwitched
            ? `${slideKeyframe} 700ms ${EASE_V1_WIPE} ${swapDelayMs}ms both`
            : undefined,
        }}
      >
        {text}
      </span>
    </p>
  );
}

function PortraitBar({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-black"
      style={{
        transform: active ? undefined : "scaleX(0)",
        transformOrigin: "left",
        animation: active
          ? `v1QuoteLineReveal 700ms ${EASE_V1_WIPE} 0ms both`
          : undefined,
        willChange: "transform",
      }}
    />
  );
}

function LogoNav({
  slides,
  activeIndex,
  onSelect,
}: {
  slides: Slide[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  // Below sm the logo row becomes a horizontal snap-scroller so any
  // number of wide brand wordmarks coexist with a 393 px viewport
  // without compressing. When activeIndex changes we center the active
  // logo in the viewport (only when overflowing — desktop is a no-op).
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (container.scrollWidth <= container.clientWidth) return;
    const el = container.querySelector<HTMLElement>(
      `[data-logo-index="${activeIndex}"]`,
    );
    if (!el) return;
    const target =
      el.offsetLeft + el.offsetWidth / 2 - container.clientWidth / 2;
    container.scrollTo({ left: target, behavior: "smooth" });
  }, [activeIndex]);
  return (
    <div
      ref={containerRef}
      className="-mx-6 flex snap-x snap-mandatory flex-nowrap items-center overflow-x-auto px-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:overflow-x-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      style={{ columnGap: "clamp(12px, 2.6vw, 41px)" }}
    >
      {slides.map((slide, i) => (
        <LogoButton
          key={slide.id}
          slide={slide}
          index={i}
          isActive={i === activeIndex}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

/**
 * Inactive logos sit at 25% opacity. On hover, a full-brightness
 * overlay is revealed via a radial mask growing from the cursor
 * entry point (`useRadialBleed` writes `--x`/`--y`/`--r`).
 */
function LogoButton({
  slide,
  index,
  isActive,
  onSelect,
}: {
  slide: Slide;
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
}) {
  // Radial-from-cursor bleed retired. Inactive logos light up via a
  // pure-CSS left-to-right wipe on hover (mask-size: 0% → 100%) so
  // the reveal direction is always the same, regardless of where the
  // cursor enters the logo.
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      data-logo-index={index}
      aria-label={`Show ${slide.label} testimonial`}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "group/logo relative min-w-0 shrink-0 cursor-pointer snap-center overflow-hidden sm:shrink",
        "motion-safe:transition-transform motion-safe:duration-[420ms] motion-safe:ease-v1-in",
        "motion-safe:active:scale-[0.97]",
        // Mobile shows only the active customer's logo (the arrows +
        // progress dots already drive navigation); the 3-up "tabs" row
        // returns at sm+. Avoids the clipped, overflowing logo strip.
        !isActive && "hidden focus-visible:opacity-70 sm:inline-block"
      )}
      style={{
        width: slide.logo.width,
        height: "auto",
        aspectRatio: `${slide.logo.width}/${slide.logo.height}`,
        maxWidth: "100%",
      }}
    >
      <img
        src={slide.logo.src}
        alt=""
        aria-hidden="true"
        width={slide.logo.width}
        height={slide.logo.height}
        className="block h-full w-full motion-safe:transition-opacity motion-safe:duration-[500ms] motion-safe:ease-v1-in"
        style={{ opacity: isActive ? 1 : slide.logo.inactiveOpacity ?? 0.25 }}
      />
      <img
        src={slide.logo.src}
        alt=""
        aria-hidden="true"
        width={slide.logo.width}
        height={slide.logo.height}
        className={cn(
          "pointer-events-none absolute inset-0 block h-full w-full motion-safe:transition-[mask-size,-webkit-mask-size] motion-safe:duration-[420ms] motion-safe:ease-v1-out",
          isActive
            ? "opacity-0"
            : "[mask-size:0%_100%] group-hover/logo:[mask-size:100%_100%]"
        )}
        style={{
          maskImage: "linear-gradient(to right, black, black)",
          WebkitMaskImage: "linear-gradient(to right, black, black)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    </button>
  );
}

// Shared quote-paragraph styling — used by BOTH the visible quote and
// the invisible height sizers so they wrap to identical heights.
const QUOTE_TEXT_CLASS =
  "text-pretty text-v1-frost font-whyte font-normal text-[16px] leading-[1.4] sm:text-[clamp(24px,2.5vw,36px)] sm:leading-[1.5]";

// Quote body. Below lg it's a single naturally-wrapping string; at lg+
// it honours the designer-locked `quoteLines` breaks when provided.
// Kept standalone so the sizer paragraphs render the exact same markup.
function QuoteText({
  quote,
  quoteLines,
}: {
  quote: string;
  quoteLines?: string[];
}) {
  if (!quoteLines) return <>{quote}</>;
  return (
    <>
      <span className="block lg:hidden">{quote}</span>
      <span className="hidden lg:contents">
        {quoteLines.map((line, i) => (
          <span key={i} aria-hidden="true" className="block whitespace-nowrap">
            {line}
            {i < quoteLines.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </>
  );
}

function Quote({
  slide,
  slides,
  activeKey,
  slideDirection,
  bylineStaggerMs,
}: {
  slide: Slide;
  slides: Slide[];
  activeKey: number;
  slideDirection: "left" | "right";
  bylineStaggerMs: number;
}) {
  const { quote, quoteLines, tag, authorName, authorTitle, caseStudyHref } =
    slide.testimonial;
  // Per-line black-bar paint-collapse removed — only the portrait
  // carries the wipe vocabulary on the testimonial. The lg+
  // per-line stagger still fires on slide changes via
  // `v1QuoteLineSwap` (16 px lift + blur clearing), gated on
  // `hasSwitched` so it never plays on initial load.
  const [hasSwitched, setHasSwitched] = useState(false);
  const prevKeyRef = useRef(activeKey);
  useEffect(() => {
    if (prevKeyRef.current !== activeKey) {
      setHasSwitched(true);
    }
    prevKeyRef.current = activeKey;
  }, [activeKey]);
  // On slide change the whole quote slides in from the same side as
  // the portrait. Wrapped in overflow-hidden so the off-axis text
  // doesn't paint past its column.
  const slideKeyframe =
    slideDirection === "right" ? "v1TextSlideInRight" : "v1TextSlideInLeft";
  return (
    <div className="flex flex-col gap-[33px]">
      {tag && (
        <span
          key={`tag-${activeKey}`}
          className="inline-flex w-fit items-center rounded-full px-[14px] py-1.5 font-v1Label text-[11px] uppercase leading-none tracking-[0.04em] text-v1-frost"
          style={{ backgroundColor: "#013CF6", marginBottom: -16 }}
        >
          {tag}
        </span>
      )}
      {/* Quote text box — Whyte 36 / 1.5, no tracking. When
          `quoteLines` is supplied (other carousels) the designer-locked
          breaks render as lg+ nowrap blocks; otherwise the quote wraps
          naturally within the column, mirroring the home testimonial.

          Height stability: every slide's quote is stacked invisibly into
          the SAME grid cell (`[grid-area:1/1]`), so the box always
          reserves the tallest quote's height and the section never
          reflows on slide change. The visible quote sits in the same
          cell on top and slides in as one unit on swap. */}
      <div className="grid">
        {slides.map((s) => (
          <p
            key={s.id}
            aria-hidden="true"
            className={cn(QUOTE_TEXT_CLASS, "invisible [grid-area:1/1]")}
          >
            <QuoteText
              quote={s.testimonial.quote}
              quoteLines={s.testimonial.quoteLines}
            />
          </p>
        ))}
        <div className="overflow-hidden [grid-area:1/1]">
          <p
            key={`q-${activeKey}`}
            className={QUOTE_TEXT_CLASS}
            aria-label={quote}
            style={{
              animation: hasSwitched
                ? `${slideKeyframe} 700ms ${EASE_V1_WIPE} 0ms both`
                : undefined,
            }}
          >
            <QuoteText quote={quote} quoteLines={quoteLines} />
          </p>
        </div>
      </div>
      {/* Byline + CTAs container — kept on one row from sm so the
          layout matches the rest of the carousel's "hold shape
          until mobile" behaviour. Buttons gap clamps so they tuck
          tighter on small laptops without stacking. */}
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="text-v1-byline text-v1-frost max-sm:text-[18px] max-sm:leading-[1.2]">
          {/* Slide-to-slide swaps inherit the subtle v1BylineSwap
              (8 px lift + blur clearing, 80 ms stagger) keyed by
              activeKey. No initial paint bar — only the portrait
              carries the wipe vocabulary now. */}
          <BylineReveal
            text={authorName}
            hasSwitched={hasSwitched}
            swapDelayMs={0}
            swapKey={`name-${activeKey}`}
            slideDirection={slideDirection}
          />
          <BylineReveal
            text={authorTitle}
            hasSwitched={hasSwitched}
            swapDelayMs={bylineStaggerMs}
            swapKey={`role-${activeKey}`}
            slideDirection={slideDirection}
          />
        </div>
        <div
          className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-y-3"
          style={{ columnGap: "clamp(12px, 1.5vw, 32px)" }}
        >
          <ButtonLink
            href={caseStudyHref}
            variant="primary"
            className="!w-full sm:!w-auto"
          >
            View case study
          </ButtonLink>
          <ButtonLink
            href="/customers?ref=testimonials"
            variant="secondary"
            className="!w-full sm:!w-auto"
          >
            View all
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export function PaginationRail({
  active,
  total,
  durationMs,
  running,
  onPrev,
  onNext,
  onAdvance,
  prevLabel = "Previous",
  nextLabel = "Next",
}: {
  active: number;
  total: number;
  durationMs: number;
  running: boolean;
  onPrev: () => void;
  onNext: () => void;
  onAdvance: () => void;
  prevLabel?: string;
  nextLabel?: string;
}) {
  // Rail is split into `total` equal slots. Already-completed slots
  // stay filled; the active slot's animated layer mounts only while
  // the carousel is `running` (in viewport, more than one slide), and
  // its `animationend` event is the single source of truth for auto-
  // advance — no parallel setTimeout to keep in sync with the CSS
  // animation.
  const completed = (active / total) * 100;
  const segment = 100 / total;
  const arrowBtn =
    "group inline-flex shrink-0 items-center justify-center rounded-full bg-v1-frost/[0.04] backdrop-blur-md text-v1-frost motion-safe:transition-[background-color,color] motion-safe:duration-300 motion-safe:ease-v1-in hover:bg-v1-frost/[0.12] focus-visible:bg-v1-frost/[0.12]";
  return (
    <div
      data-cursor-hide
      className="flex items-center gap-6"
    >
      <button
        type="button"
        onClick={onPrev}
        aria-label={prevLabel}
        className={arrowBtn}
      >
        <CarouselArrow className="size-[31px] rotate-180 sm:size-10" />
      </button>
      {/* Segmented rail — N separate 1 px bars with a 6 px gap
          between them. Same vocabulary as HowItWorks' progress rail. */}
      <div className="flex flex-1 gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="relative h-1 flex-1 overflow-hidden bg-v1-frost/20"
          >
            {i < active && (
              <div className="absolute inset-0 bg-v1-frost" />
            )}
            {i === active && running && (
              <div
                key={active}
                onAnimationEnd={onAdvance}
                className="absolute inset-0 origin-left bg-v1-frost motion-reduce:hidden"
                style={{
                  animation: `v1-carousel-progress ${durationMs}ms linear forwards`,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onNext}
        aria-label={nextLabel}
        className={arrowBtn}
      >
        <CarouselArrow className="size-[31px] sm:size-10" />
      </button>
    </div>
  );
}


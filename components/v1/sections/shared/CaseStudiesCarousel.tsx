"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import Image from "next/image";
import ButtonLink from "@/components/v1/ButtonLink";
import { CarouselArrow } from "@/components/v1/sections/shared/CarouselArrow";
import {
  CURSOR_SPOTLIGHT_SEED,
  onCursorSpotlightMove,
} from "@/utils/v1/cursorFx";
import { reveals } from "@/utils/v1/reveals";
import { V1_CYCLE_MS } from "@/utils/v1/springs";
import { useInView } from "@/utils/v1/hooks/useInView";
import { cn } from "@/utils/v1/cn";

/**
 * Horizontally-paginated Emblá carousel of case-study cards. The
 * outer frame (all four sides) is a 1 px `border-v1-strong` on the
 * Embla viewport; each card adds a single `border-r` divider, so the
 * row reads as one contiguous outlined strip with no double borders
 * at the seams regardless of loop position. Cards reveal
 * the filled `bg-v1-surfaceElevated` + greydient texture +
 * cursor spotlight on hover only — the carousel's "active" card
 * has no visual treatment of its own; the pagination rail (with a
 * Home-style timer-fill on the active segment) is the source of
 * truth for which one is current.
 *
 * Each card is a Link covering its full surface: clicking anywhere
 * navigates to the CTA href.
 */

export interface CaseStudyItem {
  id: string;
  title: string;
  body: ReactNode;
  logo?: { src: string; alt: string; width: number; height: number };
  cta: { label: string; href: string };
}

interface CaseStudiesCarouselProps {
  ariaLabelledBy: string;
  studies: CaseStudyItem[];
  /** Top heading + intro CTA block. */
  header?: ReactNode;
  /** Right-aligned CTA below the pagination rail. */
  footerCta?: { label: ReactNode; href: string };
}

const CARD_TEXTURE = "/assets/v1/case-studies-card-texture.webp";

// Same arrow chrome as Home/HowItWorks: borderless, round hover
// background, chevron nudges 3 px right on hover.
const ARROW_BTN =
  "group inline-flex shrink-0 items-center justify-center rounded-full text-v1-frost motion-safe:transition-[background-color,color] motion-safe:duration-300 motion-safe:ease-v1-out hover:bg-v1-frost/[0.06] focus-visible:bg-v1-frost/[0.06]";
const ARROW_SVG =
  "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-v1-out group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]";

export default function CaseStudiesCarousel({
  ariaLabelledBy,
  studies,
  header,
  footerCta,
}: CaseStudiesCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    duration: 28,
  });
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  // Exactly one card carries the elevated bg + texture: the hovered card
  // when the row is being hovered, otherwise the carousel's current card.
  const litIndex = hovered ?? active;
  // Pause auto-advance only while the section is offscreen (so the
  // timer-fill doesn't burn through unseen cards) or mid-drag (a
  // transient pause that clears on pointer-up). Crucially we do NOT
  // pause on focus: clicking an arrow or pagination dot focuses that
  // button, and a focus-pause would silently stop autoplay until the
  // user clicked elsewhere — the carousel keeps running through
  // interaction, matching the testimonials carousel.
  const [rootRef, inView] = useInView<HTMLElement>();

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActive(emblaApi.selectedScrollSnap());
    const onPointerDown = () => setDragging(true);
    const onPointerUp = () => setDragging(false);
    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
    };
  }, [emblaApi]);

  const running = inView && !dragging && studies.length > 1;

  return (
    <section
      ref={rootRef}
      aria-labelledby={ariaLabelledBy}
      className="relative mx-auto w-full max-w-[1440px] py-20 text-v1-frost lg:py-40"
    >
      {header}

      {/* Horizontal padding lives on this outer wrapper, NOT the
          Embla viewport, so the viewport's `overflow-hidden` clips
          exactly at the cards' edges. Otherwise the next card's left
          border peeks into the right padding. */}
      <motion.div
        {...reveals.item(2)}
        className={cn(
          "px-6 lg:px-8",
          header && "mt-v1-stack"
        )}
      >
        {/* The full outer frame lives on this viewport, NOT the cards:
            an element's own `overflow-hidden` never clips its own
            border, and the viewport doesn't move, so all four edges
            stay crisp and symmetric regardless of scroll/loop position.
            `overflow-hidden` clips the track to whole cards per view:
            one on mobile, two on tablet (md), three on desktop (xl).
            Each card draws a single
            `border-r` divider (see CaseStudyCard); the track is 1px
            wider than the viewport so the rightmost card's `border-r`
            falls past the clip edge instead of doubling the viewport's
            right border. No per-card border overlap, so loop reordering
            can't produce double borders. */}
        <div
          ref={emblaRef}
          className="touch-pan-y overflow-hidden border border-v1-strong"
        >
          <div
            className="flex w-[calc(100%_+_1px)] select-none items-stretch"
            style={{ cursor: dragging ? "grabbing" : "grab" }}
          >
            {studies.map((study, i) => (
              <div
                key={study.id}
                className="shrink-0 basis-full md:basis-1/2 xl:basis-1/3"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              >
                <CaseStudyCard study={study} lit={i === litIndex} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pagination rail + arrows — timer-fill mirrors Home/HowItWorks:
          past segments stay solid frost, the active segment animates
          left→right over V1_CYCLE_MS, and `onAnimationEnd` advances
          the carousel. Pauses when offscreen or while dragging. */}
      <motion.div
        {...reveals.item(3)}
        className="mt-16 flex items-center gap-[13px] px-[19px] lg:px-[45px]"
      >
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous case study"
          className={ARROW_BTN}
        >
          <CarouselArrow
            className={`size-[31px] rotate-180 sm:size-10 ${ARROW_SVG}`}
          />
        </button>
        <div className="flex flex-1 gap-1.5">
          {studies.map((study, i) => (
            <button
              key={study.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to case study ${i + 1} of ${studies.length}`}
              aria-current={i === active ? "true" : undefined}
              className="group relative h-1 flex-1 overflow-hidden bg-v1-frost/20 motion-safe:transition-colors motion-safe:duration-200 hover:bg-v1-frost/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v1-frost/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {i < active && <span className="absolute inset-0 bg-v1-frost" />}
              {i === active && running && (
                <span
                  key={active}
                  onAnimationEnd={() => emblaApi?.scrollNext()}
                  className="absolute inset-0 origin-left bg-v1-frost motion-reduce:hidden"
                  style={{
                    animation: `v1-carousel-progress ${V1_CYCLE_MS}ms linear forwards`,
                  }}
                />
              )}
              {i === active && !running && (
                <span className="absolute inset-0 bg-v1-frost" />
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next case study"
          className={ARROW_BTN}
        >
          <CarouselArrow className={`size-[31px] sm:size-10 ${ARROW_SVG}`} />
        </button>
      </motion.div>

      {footerCta && (
        <motion.div
          {...reveals.item(4)}
          className="mt-10 flex justify-end px-6 lg:px-8"
        >
          <ButtonLink href={footerCta.href} variant="primary">
            {footerCta.label}
          </ButtonLink>
        </motion.div>
      )}
    </section>
  );
}

function CaseStudyCard({
  study,
  lit = false,
}: {
  study: CaseStudyItem;
  /** The single lit card shows the elevated bg + dots texture: the hovered
      card while the row is hovered, otherwise the carousel's current card. */
  lit?: boolean;
}) {
  return (
    <Link
      href={study.cta.href}
      aria-label={`${study.title}: ${study.cta.label}`}
      onPointerMove={onCursorSpotlightMove}
      style={CURSOR_SPOTLIGHT_SEED}
      className={cn(
        // Mobile: tighter padding + an explicit 44px rhythm between the
        // header, body, and footer (button). lg restores the fixed-height
        // row where justify-between anchors the three slots top/mid/bottom.
        "group/card relative flex h-full w-full flex-col gap-[44px] overflow-hidden border-r border-v1-strong p-[28px] lg:h-[520px] lg:justify-between lg:gap-0 lg:p-16",
        "motion-safe:transition-colors motion-safe:duration-700 motion-safe:ease-v1-out",
        lit ? "bg-v1-surfaceElevated" : "bg-transparent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v1-frost/60 focus-visible:ring-offset-2 focus-visible:ring-offset-v1-canvasBase"
      )}
    >
      {/* Texture cross-fades + zooms onto whichever card is lit (hovered
          card, else the carousel's current card). Always mounted so the
          800 ms fade isn't gated on first paint. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 motion-safe:transition-[opacity,transform] motion-safe:duration-[800ms] motion-safe:ease-v1-out",
          lit ? "scale-100 opacity-100" : "scale-105 opacity-0"
        )}
        style={{
          backgroundImage: `url(${CARD_TEXTURE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "soft-light",
        }}
      />

      {/* Cursor-tracking spotlight — radial gradient anchored to the
          shared --mx/--my vars from cursorFx. Sits above the texture
          so it lifts the dots where the cursor hovers. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-v1-out group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx) var(--my), rgba(255,255,255,0.10), rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="relative flex flex-col gap-3">
        <h3 className="font-v1Heading text-[32px] leading-[40px] tracking-[-0.01em] text-v1-frost">
          {study.title}
        </h3>
      </div>

      <p className="relative font-v1Heading text-[18px] leading-[1.5] tracking-[-0.01em] text-v1-frost">
        {study.body}
      </p>

      {/* Logo + CTA share the card's bottom slot so the logo sits at a
          fixed height above the CTA on every card — keeping the customer
          logos vertically aligned across the row regardless of body
          length. Logos are sized by height (width auto from the artwork's
          true aspect ratio); `max-w-full` clamps very wide marks to the
          card. The CTA is visual only — the parent Link owns the click
          target; its salmon-flood hover is driven by `group-hover/card`
          so it activates from anywhere on the card. */}
      <div className="relative mt-auto flex flex-col gap-10 lg:mt-0">
        {study.logo && (
          <Image
            src={study.logo.src}
            alt={study.logo.alt}
            width={study.logo.width}
            height={study.logo.height}
            style={{ height: study.logo.height, width: "auto" }}
            className="block max-w-full object-contain object-left opacity-90"
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-10 min-w-[144px] shrink-0 items-center justify-center self-start whitespace-nowrap rounded-md px-5 font-v1Label text-[12px] font-semibold uppercase text-v1-frost",
            "shadow-[inset_0_0_0_2px_rgb(255_255_255)] motion-safe:transition-[background-color,box-shadow,color] motion-safe:duration-300 motion-safe:ease-v1-out",
            "group-hover/card:bg-v1-accent-salmon group-hover/card:text-v1-frost group-hover/card:shadow-none"
          )}
        >
          {study.cta.label}
        </span>
      </div>
    </Link>
  );
}

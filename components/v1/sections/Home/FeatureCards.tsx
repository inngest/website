"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onCursorSpotlightMove, CURSOR_SPOTLIGHT_SEED } from "@/utils/v1/cursorFx";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { springs } from "@/utils/v1/springs";

/**
 * Three feature cards. Inactive cards sit on the dark elevated surface
 * with a frost/60 border; hover swaps in the salmon gradient + soft-
 * light noise overlay and grows the visible card vertically.
 *
 * Layout: flush stack at every breakpoint (vertical below sm,
 * horizontal 3-col at sm+). Cards share their seam border so the
 * stack reads as one outlined container with internal divisions.
 * Surface + hover overlays live on absolute spans behind the
 * content so type never reflows when the card grows.
 *
 * Hover geometry (whole-card lift + surface grow) is gated to lg+
 * via CSS-var indirection (`--lift-y` / `--surface-y`) so touch
 * surfaces don't bleed translates into flush-stacked siblings.
 * Visual hover effects (salmon flood, noise, spotlight, icon lift,
 * accent line wipes) still fire at every size.
 */

export interface FeatureCard {
  label: string;
  vector: string;
  vectorWidth: number;
  vectorHeight: number;
  /** Optional URL — when set the entire card becomes a clickable link. */
  href?: string;
  /** Designer-locked breaks at lg+ (rendered as `block whitespace-nowrap`). */
  bodyLines: string[];
}

const CARDS: FeatureCard[] = [
  {
    label: "Retries & Reliability",
    href: "/platform/durable-execution",
    vector: "/assets/v1/feature-cards/retries.svg",
    vectorWidth: 85,
    vectorHeight: 70.51, // viewBox 208.397 × 172.823
    bodyLines: [
      "Your code has to work no matter what. Add steps",
      "to any codebase to automate retries from failure—",
      "not from scratch."
    ],
  },
  {
    label: "Flow Control",
    href: "/platform/flow-control",
    vector: "/assets/v1/feature-cards/flow-control.svg",
    vectorWidth: 85,
    vectorHeight: 59.4, // viewBox 205.865 × 143.85
    bodyLines: [
      "Don’t let one needy user starve the rest. Add rate",
      "limits, per-tenant concurrency, and throttling with",
      "one line of code."
    ],
  },
  {
    label: "Observability",
    href: "/platform/observability",
    vector: "/assets/v1/feature-cards/observability.svg",
    vectorWidth: 85,
    vectorHeight: 69.7, // viewBox 205.848 × 168.771
    bodyLines: [
      "Your APM is missing context. Trace everything,",
      "and replay anything, so you know exactly what",
      "failed and why."
    ],
  },
];

// How many px the surface extends above and below the row when a
// card is active. Driven by motion's imperative `animate()` writing
// `--surface-extra-y` on the article; sibling overlays read the
// gated `--surface-y` view so geometry stays 0 below lg.
const SURFACE_EXTRA_Y_PX = 12;

// Hover-OUT release uses `springs.glide` — over-damped spring with
// zero overshoot, so the card and icon settle cleanly without any
// post-release jello wobble.
const RELEASE_BOUNCE = springs.glide;
const ICON_RELEASE = springs.glide;

// `top` / `bottom` inline style for every overlay span that extends
// with the surface. `--surface-y` is the gated view of
// `--surface-extra-y` (see article className) — zeroed below lg so
// the spring's geometry doesn't bleed into flush-stacked siblings.
const followsExtraY: React.CSSProperties = {
  top: "calc(0px - var(--surface-y, 0px))",
  bottom: "calc(0px - var(--surface-y, 0px))",
};

// Retract window for the serialised hover hand-off — the current
// active card finishes shrinking before the next one grows.
const RETRACT_MS = 360;

export default function FeatureCards() {
  return (
    <section
      aria-label="Platform features"
      className="relative z-10 isolate mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 py-20 sm:px-8"
    >
      <FeatureCardsGrid cards={CARDS} />
    </section>
  );
}

/**
 * The card row + serialised hover hand-off, extracted from the default
 * section so it can be reused under a different heading/section (e.g.
 * CompareTemporal/WhyChoose) without inheriting this section's padding
 * or aria-label. Supply your own `cards`.
 */
export function FeatureCardsGrid({ cards }: { cards: FeatureCard[] }) {
  // Serialised hover hand-off: pendingId tracks intent, activeId is
  // what's on screen. Switching siblings retracts first then expands
  // after RETRACT_MS — beats the dual-spring fight on rapid sweeps.
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    if (pendingId === activeId) return;
    if (activeId === null) {
      setActiveId(pendingId);
      return;
    }
    setActiveId(null);
    if (pendingId === null) return;
    const t = window.setTimeout(() => setActiveId(pendingId), RETRACT_MS);
    return () => window.clearTimeout(t);
  }, [pendingId, activeId]);

  return (
    <div className="has-hover-dim grid w-full grid-cols-1 sm:grid-cols-3 sm:items-stretch sm:[width:round(down,100%,3px)]">
      {cards.map((card, idx) => (
        <Card
          key={card.label}
          card={card}
          isFirst={idx === 0}
          isLast={idx === cards.length - 1}
          isActive={activeId === card.label}
          onEnter={() => setPendingId(card.label)}
          onLeave={() =>
            setPendingId((prev) => (prev === card.label ? null : prev))
          }
        />
      ))}
    </div>
  );
}

function Card({
  card,
  isFirst,
  isLast,
  isActive,
  onEnter,
  onLeave,
}: {
  card: FeatureCard;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  // Shared-seam border collapse so card-to-card joins are one 1 px
  // stroke, not two stacked. Mobile (vertical): non-last cards drop
  // their BOTTOM border — the card below draws the seam as its own
  // top border, which renders on top of its own bg. (Reversing this
  // direction — having the card above draw it — lets the below card's
  // bg cover the line at fractional pixel positions, a subpixel
  // rendering hazard.) Sm+ (horizontal): non-first cards drop their
  // left border, same idea rotated 90°.
  const innerEdgeFlat = [
    "rounded-none",
    isLast ? "" : "border-b-0 sm:border-b",
    isFirst ? "" : "sm:border-l-0",
  ]
    .filter(Boolean)
    .join(" ");
  // Overlay layers (salmon / noise / spotlight) inherit the corner-
  // flattening but MUST NOT get the surface's `border-b` utility —
  // without an explicit `border-color`, that utility falls back to
  // `currentcolor` which inherits as near-white, producing a 1 px
  // white line at the bottom of every hovered card. Strip the
  // border-edge classes for these layers.
  const overlayEdgeFlat = "rounded-none";

  const ease = "ease-v1-in";
  const dur = "motion-safe:duration-[600ms]";

  // Hold z-elevation through the lift + grow + shrink window so the
  // card stays above its neighbours throughout the full hover
  // transition (springs settle inside ~700 ms).
  const [elevated, setElevated] = useState(false);
  useEffect(() => {
    if (isActive) {
      setElevated(true);
      return;
    }
    const t = setTimeout(() => setElevated(false), 700);
    return () => clearTimeout(t);
  }, [isActive]);
  // Surface grow drives `--surface-extra-y` so 5 sibling overlays
  // (border, salmon gradient, noise, spotlight, accent line) extend
  // in lockstep with the article. Asymmetric spring: snappy `lift`
  // on hover-in, long `jelly` on hover-OUT — matches the article's
  // own translate so the geometry and translate settle together.
  // Imperative `animate()` here (not `useSpring`) so each direction
  // can supply its own transition; `useSpring` bakes config on mount.
  const surfaceY = useMotionValue(0);
  useEffect(() => {
    const controls = animate(
      surfaceY,
      isActive ? SURFACE_EXTRA_Y_PX : 0,
      isActive ? springs.lift : RELEASE_BOUNCE,
    );
    return () => controls.stop();
  }, [isActive, surfaceY]);
  const surfaceYVar = useTransform(surfaceY, (v) => `${v}px`);

  // Whole-card translate driven as a CSS var so it can be gated to
  // lg+ via the same indirection as the surface growth.
  const liftY = useMotionValue(0);
  useEffect(() => {
    const controls = animate(
      liftY,
      isActive ? -8 : 0,
      isActive ? springs.lift : RELEASE_BOUNCE,
    );
    return () => controls.stop();
  }, [isActive, liftY]);
  const liftYVar = useTransform(liftY, (v) => `${v}px`);

  return (
    <motion.article
      data-feature-card
      tabIndex={-1}
      onPointerMove={onCursorSpotlightMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      // Per-card entry fade: each card waits for its own viewport
      // entry so a card below the fold doesn't burn through its
      // animation before the user scrolls to it.
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px", amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.27, 1] }}
      style={{
        ...CURSOR_SPOTLIGHT_SEED,
        ["--lift" as string]: liftYVar,
        ["--surface-extra-y" as string]: surfaceYVar,
        // Read the gated views (--lift-y / --surface-y) so geometry
        // stays 0 below lg even while the springs run.
        transform: "translateY(var(--lift-y, 0px))",
        willChange: "transform",
      }}
      // [--lift-y]/[--surface-y] zero the spring's geometry on mobile
      // so the lift + grow don't bleed into flush-stacked siblings.
      // Lg+ maps them to the live spring values; visual hover effects
      // (salmon flood, noise, spotlight, icon lift) still fire at
      // every size.
      className={`group relative isolate flex flex-col items-start justify-center gap-4 p-4 [--lift-y:0px] [--surface-y:0px] sm:gap-[25px] sm:p-5 lg:[--lift-y:var(--lift)] lg:[--surface-y:var(--surface-extra-y)] ${
        isActive ? "z-20" : elevated ? "z-10" : ""
      }`}
    >
      {/* Base surface — gray bg + frost border. Stays gray; the
          salmon flood lives on a sibling overlay that cross-fades
          via opacity instead of swapping a non-transitionable
          `background-image`. Border + shadow ring transition on
          hover, geometry (top/bottom) is driven by the JS spring
          via `--surface-extra-y`. */}
      <span
        aria-hidden="true"
        data-card-surface
        style={followsExtraY}
        // `border-color` is intentionally NOT in the transition list —
        // the surface span extends above/below the card on hover via
        // `--surface-extra-y`, and a slowly-fading frost border on the
        // extended top/bottom edges read as white strips floating in
        // the gap above/below the card. Snap the border to transparent
        // the moment hover engages.
        className={`pointer-events-none absolute inset-0 -z-10 rounded border border-v1-frost/60 bg-v1-surfaceElevated motion-safe:transition-[background-color,box-shadow,border-radius] motion-safe:duration-[700ms] motion-safe:ease-v1-lift group-hover:!rounded group-hover:border-transparent group-hover:shadow-[var(--v1-shadow-card-hover)] group-focus-within:!rounded group-focus-within:border-transparent ${innerEdgeFlat}`}
      />

      {/* Salmon gradient overlay — same geometry as the base surface,
          cross-fades opacity 0 → 1 on hover. Decoupling the salmon
          from the base bg lets it fade alongside the spring retract
          instead of popping away in one frame on unhover. */}
      <span
        aria-hidden="true"
        style={followsExtraY}
        className={`pointer-events-none absolute inset-0 -z-10 rounded bg-v1-accent-salmon-gradient opacity-0 motion-safe:transition-[opacity,border-radius] motion-safe:duration-[600ms] motion-safe:ease-v1-lift group-hover:!rounded group-hover:opacity-100 group-focus-within:!rounded group-focus-within:opacity-100 ${overlayEdgeFlat}`}
      />

      {/* Soft-light noise — only visible on hover, blended over the
          salmon overlay. Crossfades opacity; geometry follows the
          spring like every other overlay. */}
      <span
        aria-hidden="true"
        style={{
          ...followsExtraY,
          backgroundImage:
            "url(/assets/v1/textures/.compressed/noise-dark.webp)",
          mixBlendMode: "soft-light",
        }}
        className={`pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-0 motion-safe:transition-[opacity,border-radius] ${dur} ${ease} group-hover:!rounded group-hover:opacity-100 group-focus-within:!rounded group-focus-within:opacity-100 ${overlayEdgeFlat}`}
      />

      {/* Cursor-tracked spotlight — radial gradient anchored to the
          cursor's position via --mx / --my. Sits above the surface bg
          + noise so the highlight catches the salmon flood. */}
      <span
        aria-hidden="true"
        style={{
          ...followsExtraY,
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.32), transparent 65%)",
        }}
        className={`pointer-events-none absolute inset-0 -z-10 opacity-0 motion-safe:transition-[opacity,border-radius] motion-safe:duration-[500ms] ${ease} group-hover:!rounded group-hover:opacity-100 group-focus-within:!rounded group-focus-within:opacity-100 ${overlayEdgeFlat}`}
      />

      {/* Icon sits in a fixed-height container (matches the tallest
          icon's natural height, 70.51px → rounded to 72) and aligns
          to the bottom. This makes the icon BOTTOM — and therefore
          the title and body below — land at the exact same Y across
          all three cards, even though each SVG has a different
          natural height. */}
      <div className="flex w-full flex-col items-start gap-[21px] py-2">
        {/* Icon container height + icon render width clamp against
            the viewport so the 3-col row stays tidy as it's squeezed
            between sm and lg. At < sm the stack rolls to one column
            and the clamp pins to its max. */}
        <div
          className="flex w-full items-end"
          style={{ height: "clamp(54px, 6vw, 72px)" }}
        >
          {/* Icon hover-lift intentionally removed — the icon stays
              static on hover. Opacity still cross-fades 55 → 100
              so the active card's icon brightens. */}
          <img
            src={card.vector}
            alt=""
            aria-hidden="true"
            width={card.vectorWidth}
            height={card.vectorHeight}
            style={{
              width: `clamp(60px, 7vw, ${card.vectorWidth}px)`,
              height: "auto",
            }}
            className={`block opacity-55 motion-safe:transition-opacity ${dur} ${ease} group-hover:opacity-100 group-focus-within:opacity-100`}
          />
        </div>
        <h3 className="text-balance text-v1-frost text-v1-heading-xs lg:text-v1-heading-card">
          {card.label}
        </h3>
      </div>

      {/* Body copy with designer-locked line breaks at lg+. Each line
          is a `lg:block lg:whitespace-nowrap` span — at lg+ the line
          breaks land exactly where specified; below lg the spans
          collapse to inline flow so single-column cards can wrap
          naturally. Font scales fluidly from ~13px at narrow lg
          (1024) up to 18px at xl+, so the longest locked line
          ("Automatic traces, metrics, and logs from every part")
          fits its column at every lg+ width. */}
      <p className="w-full text-pretty text-v1-frost text-v1-body-md leading-[1.5] lg:text-[clamp(0.8125rem,1.25vw,1.125rem)]">
        {card.bodyLines.map((line, i) => (
          <span key={i} className="lg:block lg:whitespace-nowrap">
            {line}
            {i < card.bodyLines.length - 1 ? " " : ""}
          </span>
        ))}
      </p>

      {/* Stretched link — covers the entire card surface so the whole
          card is clickable. Pointer events pass through to the article
          for spotlight + hover effects; only clicks are captured. */}
      {card.href && (
        <Link
          href={card.href}
          aria-label={card.label}
          className="absolute inset-0 z-10"
        />
      )}
    </motion.article>
  );
}

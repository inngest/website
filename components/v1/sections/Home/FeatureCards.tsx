"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onCursorSpotlightMove, CURSOR_SPOTLIGHT_SEED } from "@/utils/v1/cursorFx";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { springs } from "@/utils/v1/springs";
import {
  type DurabilityTabId,
  DURABILITY_PANEL_ID,
  durabilityTabButtonId,
} from "./durabilityTabs";

/**
 * Three feature cards. Inactive cards sit on the dark elevated surface
 * with a frost/60 border; hover swaps in the salmon gradient + soft-
 * light noise overlay and grows the visible card vertically.
 *
 * On the home page these cards act as a TABLIST: clicking one selects it
 * (persistent salmon flood via `data-active`) and drives the content in
 * the "Durability belongs in code" panel below (see ScaleInstantly).
 * Hovering a non-selected card previews the flood; on leave the grid
 * settles back onto the selected card. Selection is controlled by the
 * parent (DurabilityInCode) via `activeTab` / `onSelect`.
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
  /** Stable identity — also the tab id when the grid is in select mode. */
  id: DurabilityTabId;
  label: string;
  vector: string;
  vectorWidth: number;
  vectorHeight: number;
  /** Optional URL — when set (and the grid is NOT in select mode) the
   *  entire card becomes a clickable link. */
  href?: string;
  /** Designer-locked breaks at lg+ (rendered as `block whitespace-nowrap`). */
  bodyLines: string[];
}

export const CARDS: FeatureCard[] = [
  {
    id: "retries",
    label: "Retries & Reliability",
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
    id: "flow-control",
    label: "Flow Control",
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
    id: "observability",
    label: "Agent Observability",
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

// Surface grow + lift are disabled for the tab bar — the boxes stay
// flush in the panel (no expansion on hover/select), per design. Kept
// the spring plumbing wired at 0 so the structure is easy to re-enable.
const SURFACE_EXTRA_Y_PX = 0;

// Hover-OUT release uses `springs.glide` — over-damped spring with
// zero overshoot, so the card and icon settle cleanly without any
// post-release jello wobble.
const RELEASE_BOUNCE = springs.glide;

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

/**
 * The card row + serialised hover hand-off, extracted from the default
 * section so it can be reused under a different heading/section without
 * inheriting this section's padding or aria-label. Supply your own
 * `cards`.
 *
 * Select mode (pass `onSelect`): the grid renders as a tablist, rests on
 * the `selectedId` card when idle, and previews on hover — settling back
 * onto the selected card on leave. Click commits a new selection.
 */
export function FeatureCardsGrid({
  cards,
  selectedId,
  onSelect,
}: {
  cards: FeatureCard[];
  selectedId?: DurabilityTabId;
  onSelect?: (id: DurabilityTabId) => void;
}) {
  const selectMode = !!onSelect;
  // The card the grid rests on when nothing is hovered. In select mode
  // that's the selected tab; otherwise fully idle (home-page hover-only).
  const idleId: string | null = selectMode ? (selectedId ?? null) : null;

  // Serialised hover hand-off: pendingId tracks intent, activeId is
  // what's on screen. Switching siblings retracts first then expands
  // after RETRACT_MS — beats the dual-spring fight on rapid sweeps.
  const [pendingId, setPendingId] = useState<string | null>(idleId);
  const [activeId, setActiveId] = useState<string | null>(idleId);

  // When the parent changes the selection, snap our idle target to it so
  // a hover-out settles onto the newly selected card.
  useEffect(() => {
    if (selectMode) setPendingId(selectedId ?? null);
  }, [selectMode, selectedId]);

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
    <div
      role={selectMode ? "tablist" : undefined}
      aria-label={selectMode ? "Durability capabilities" : undefined}
      className="has-hover-dim grid w-full grid-cols-1 sm:grid-cols-3 sm:items-stretch sm:[width:round(down,100%,3px)]"
    >
      {cards.map((card, idx) => (
        <Card
          key={card.id}
          card={card}
          isFirst={idx === 0}
          isLast={idx === cards.length - 1}
          isActive={activeId === card.id}
          selected={selectMode && selectedId === card.id}
          onEnter={() => setPendingId(card.id)}
          onLeave={() =>
            setPendingId((prev) =>
              selectMode ? idleId : prev === card.id ? null : prev
            )
          }
          onSelect={onSelect ? () => onSelect(card.id) : undefined}
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
  selected,
  onEnter,
  onLeave,
  onSelect,
}: {
  card: FeatureCard;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  selected: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onSelect?: () => void;
}) {
  // Tabs sit FLUSH inside the panel, so the panel's own gradient ring
  // already frames the bar's outer edges (top + sides) and its rounded
  // corners. Each tab therefore draws only INTERIOR separators — never a
  // full box — so nothing doubles the panel ring or fights its corner
  // radius. Edges drawn: a bottom rule under the row on every card
  // (the tab-bar/content divider, and the inter-tab rule when stacked
  // below sm), plus a left rule on non-first cards at sm+ (the vertical
  // separators between the three tabs).
  const dividerEdges = ["border-b", isFirst ? "" : "sm:border-l"]
    .filter(Boolean)
    .join(" ");
  // Overlay layers (salmon / noise / spotlight) are square — the panel
  // clips the bar's outer corners, so the overlays never need their own
  // radius.
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
      0, // lift disabled — tab boxes stay flush (no -8px hover rise)
      isActive ? springs.lift : RELEASE_BOUNCE,
    );
    return () => controls.stop();
  }, [isActive, liftY]);
  const liftYVar = useTransform(liftY, (v) => `${v}px`);

  return (
    <motion.article
      data-feature-card
      // Mirrors the hover state so the active/selected card floods salmon
      // + noise without a cursor: overlays key off `group-data-[active=true]`.
      // Spotlight stays hover-only (it tracks the cursor).
      data-active={isActive ? "true" : undefined}
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
      {/* Base surface — same charcoal gradient fill as the panel below,
          so an idle tab reads as the same material. Separation is just
          thin interior dividers (`dividerEdges`); the panel's ring frames
          the outer edges. Dividers fade to transparent on hover/select
          where the salmon flood takes over. */}
      <span
        aria-hidden="true"
        data-card-surface
        className={`pointer-events-none absolute inset-0 -z-10 border-v1-frost/15 bg-v1-gradient-charcoal motion-safe:transition-colors motion-safe:duration-[400ms] group-hover:border-transparent group-focus-within:border-transparent group-data-[active=true]:border-transparent ${dividerEdges}`}
      />

      {/* Salmon gradient overlay — same geometry as the base surface,
          cross-fades opacity 0 → 1 on hover. Decoupling the salmon
          from the base bg lets it fade alongside the spring retract
          instead of popping away in one frame on unhover. */}
      <span
        aria-hidden="true"
        style={followsExtraY}
        className={`pointer-events-none absolute inset-0 -z-10 bg-v1-accent-salmon-gradient opacity-0 motion-safe:transition-opacity motion-safe:duration-[600ms] motion-safe:ease-v1-lift group-hover:opacity-100 group-focus-within:opacity-100 group-data-[active=true]:opacity-100 ${overlayEdgeFlat}`}
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
        className={`pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-0 motion-safe:transition-opacity ${dur} ${ease} group-hover:opacity-100 group-focus-within:opacity-100 group-data-[active=true]:opacity-100 ${overlayEdgeFlat}`}
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
        className={`pointer-events-none absolute inset-0 -z-10 opacity-0 motion-safe:transition-opacity motion-safe:duration-[500ms] ${ease} group-hover:opacity-100 group-focus-within:opacity-100 ${overlayEdgeFlat}`}
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
            className={`block opacity-55 motion-safe:transition-opacity ${dur} ${ease} group-hover:opacity-100 group-focus-within:opacity-100 group-data-[active=true]:opacity-100`}
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
      <p className="w-full text-pretty text-v1-frost text-v1-body-md leading-[1.5] motion-safe:transition-colors group-hover:!text-white group-focus-within:!text-white group-data-[active=true]:!text-white lg:text-[clamp(0.8125rem,1.25vw,1.125rem)]">
        {card.bodyLines.map((line, i) => (
          <span key={i} className="lg:block lg:whitespace-nowrap">
            {line}
            {i < card.bodyLines.length - 1 ? " " : ""}
          </span>
        ))}
      </p>

      {/* Stretched hit target covering the whole card. In select mode
          it's a tab `<button>` that drives the panel below; otherwise a
          link (when `href` is set). Pointer events pass through for the
          spotlight + hover effects; only clicks/focus are captured. */}
      {onSelect ? (
        <button
          type="button"
          role="tab"
          id={durabilityTabButtonId(card.id)}
          aria-selected={selected}
          aria-controls={DURABILITY_PANEL_ID}
          aria-label={card.label}
          onClick={onSelect}
          className="absolute inset-0 z-10 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v1-frost"
        />
      ) : card.href ? (
        <Link
          href={card.href}
          aria-label={card.label}
          className="absolute inset-0 z-10"
        />
      ) : null}
    </motion.article>
  );
}

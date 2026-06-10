"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Chip from "@/components/v1/sections/shared/Chip";
import {
  CURSOR_SPOTLIGHT_SEED,
  onCursorSpotlightMove,
} from "@/utils/v1/cursorFx";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { springs, tweens } from "@/utils/v1/springs";
import { PLANS, type Plan, type PlanName } from "./plans";

// Pixel-perfect port of the hero design + hover
// animation borrowed from Home/FeatureCards:
//   - All three cards sit dark at rest, with a carbon-200 1 px ring
//     drawn per card; seams collapse so the row reads as a single
//     outlined strip with internal dividers (same trick the home
//     feature row uses).
//   - Hover floods the card with the salmon gradient + soft-light
//     noise, fires a cursor-tracked spotlight, lifts the whole card
//     -8 px, and extends the surface ±12 px above/below the row.
//   - POPULAR chip floats over the Pro card's top edge to mark it
//     as recommended; no longer dependent on salmon-at-rest.
//   - Buttons share one outline-frost style; on group-hover they
//     flood solid frost so the active card reads the same way the
//     old static Pro card did.

const wordEntry = (delay: number) => ({
  style: {
    opacity: 0,
    transform: "translateY(14px)",
    willChange: "transform, opacity",
  } as const,
  initial: false as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { ...tweens.entry, delay: delay / 1000 },
});

// Surface grow + lift constants mirror Home/FeatureCards so the two
// hover treatments feel like they belong to the same family.
const SURFACE_EXTRA_Y_PX = 12;
const LIFT_Y_PX = -8;
const RELEASE_BOUNCE = springs.glide;
const RETRACT_MS = 360;
const HOLD_ELEVATION_MS = 700;

// Inline style for every overlay span that extends with the surface.
// `--surface-y` is the gated view of `--surface-extra-y` — zeroed
// below lg so the spring's geometry doesn't bleed into the
// flush-stacked siblings on mobile.
const followsExtraY: React.CSSProperties = {
  top: "calc(0px - var(--surface-y, 0px))",
  bottom: "calc(0px - var(--surface-y, 0px))",
};

export default function Hero() {
  // The badged plan (Pro) is the RESTING active card — it wears the
  // full hover treatment (salmon flood + grow + lift) with no pointer
  // over it, so the recommended plan reads as selected by default.
  const badgedPlanName = PLANS.find((p) => p.badge)?.name ?? null;

  // Serialised hover hand-off — pendingId tracks intent, activeId is
  // what's on screen. Switching siblings retracts the previous active
  // card first and then expands the next after RETRACT_MS. Same
  // pattern as Home/FeatureCards, except both rest on the badged plan
  // instead of null: leaving a card returns the treatment to Pro
  // rather than clearing the whole row.
  const [pendingId, setPendingId] = useState<PlanName | null>(badgedPlanName);
  const [activeId, setActiveId] = useState<PlanName | null>(badgedPlanName);
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
    <section
      aria-labelledby="pricing-hero-headline"
      className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 pb-6 pt-[100px] text-v1-frost sm:px-9 lg:gap-[70px] lg:px-8 lg:pt-[122px]"
    >
      {/* Single centred headline (max-w 1176, two lines, 16px gap).
          The full headline lives in the h1 so screen readers get all
          three sentences. */}
      <div className="flex w-full justify-center lg:py-8">
        <h1
          id="pricing-hero-headline"
          className="flex max-w-[1176px] flex-col gap-4 text-center font-v1Display uppercase tracking-[-0.01em] text-[40px] leading-[44px] sm:text-[52px] sm:leading-[60px] lg:text-[58px] lg:leading-[70px] v1-trim"
        >
          <motion.span className="block" {...wordEntry(60)}>
            Reliable workflows. Invisible infra.
          </motion.span>
          <motion.span className="block" {...wordEntry(180)}>
            Scalable pricing.
          </motion.span>
        </h1>
      </div>

      <div className="relative">
        <ul className="grid list-none grid-cols-1 gap-6 pl-0 lg:grid-cols-3 lg:gap-0">
          {PLANS.map((plan, i) => (
            <motion.li
              key={plan.name}
              {...reveals.item(i)}
              className="list-none"
            >
              <PlanCard
                plan={plan}
                isFirst={i === 0}
                isLast={i === PLANS.length - 1}
                isActive={activeId === plan.name}
                onEnter={() => setPendingId(plan.name)}
                onLeave={() =>
                  setPendingId((prev) =>
                    prev === plan.name ? badgedPlanName : prev,
                  )
                }
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  isFirst,
  isLast,
  isActive,
  onEnter,
  onLeave,
}: {
  plan: Plan;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  // Shared-seam border collapse so card-to-card joins are one 1 px
  // stroke rather than two stacked. Mobile (vertical stack): all
  // cards except the last drop their bottom border. Lg+ (horizontal):
  // all cards except the first drop their left border, and the
  // bottom border returns.
  // Mobile (vertical stack) renders each card as its own separated,
  // fully-bordered box with a gap between them — so no border collapse
  // here. The shared-seam join only kicks in at lg+ (horizontal row),
  // where every card except the first drops its left border.
  const innerEdgeFlat = isFirst ? "" : "lg:border-l-0";

  // Mobile: every card is fully rounded (separated boxes). Lg+ rotates
  // to a contiguous row — first/last own the rounded outer ends, the
  // middle cards square off so the seam reads as one strip.
  const cornerRadius = cn(
    "rounded-md",
    isFirst && "lg:rounded-l-md lg:rounded-r-none",
    isLast && "lg:rounded-r-md lg:rounded-l-none",
    !isFirst && !isLast && "lg:rounded-none",
  );

  // Hold the elevated z-index for the full lift + grow + shrink
  // window so the card stays above its neighbours throughout the
  // hover transition (springs settle inside ~700 ms).
  const [elevated, setElevated] = useState(false);
  useEffect(() => {
    if (isActive) {
      setElevated(true);
      return;
    }
    const t = setTimeout(() => setElevated(false), HOLD_ELEVATION_MS);
    return () => clearTimeout(t);
  }, [isActive]);

  // `--surface-extra-y` and `--lift` are driven imperatively so each
  // direction can supply its own spring config (snappy on hover-in,
  // gentle on hover-out). useSpring bakes config on mount.
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

  const liftY = useMotionValue(0);
  useEffect(() => {
    const controls = animate(
      liftY,
      isActive ? LIFT_Y_PX : 0,
      isActive ? springs.lift : RELEASE_BOUNCE,
    );
    return () => controls.stop();
  }, [isActive, liftY]);
  const liftYVar = useTransform(liftY, (v) => `${v}px`);

  // Overlay geometry: tracks the vertical surface-grow (top/bottom)
  // and, on lg+ for non-first cards, bleeds 2px to the LEFT so the
  // active salmon paints over the hairline seam the left neighbour
  // draws with its right border. Without this the middle/last card
  // shows a stray grey line down its left edge when active — a card's
  // own `border-transparent` can't hide a seam its neighbour owns.
  // Why -2px and not -1px: card widths are fractional (≈458.66 px on
  // the 3-col grid), so the seam lands on a sub-pixel boundary. With
  // -1px the salmon's antialiased left edge falls in the same pixel
  // column as the neighbour's antialiased right border, and the two
  // partial coverages blend into a visible grey hairline. -2px moves
  // the salmon's edge one column past the border so the seam column
  // is fully opaque salmon and the antialiased edge sits over plain
  // card content. `--seam-x` is 0 below lg, where cards stack and the
  // seam is top/bottom (already covered by `--surface-y`).
  const overlayGeometry: React.CSSProperties = {
    top: "calc(0px - var(--surface-y, 0px))",
    bottom: "calc(0px - var(--surface-y, 0px))",
    ...(isFirst ? null : { left: "var(--seam-x, 0px)" }),
  };

  return (
    <motion.article
      onPointerMove={onCursorSpotlightMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      data-active={isActive ? "true" : undefined}
      style={{
        ...CURSOR_SPOTLIGHT_SEED,
        ["--lift" as string]: liftYVar,
        ["--surface-extra-y" as string]: surfaceYVar,
        // Read the gated views so geometry stays zero on mobile.
        transform: "translateY(var(--lift-y, 0px))",
        willChange: "transform",
      }}
      className={cn(
        "pricing-plan-card group relative isolate flex h-full flex-col gap-[29px] p-8 [--lift-y:0px] [--surface-y:0px] [--seam-x:0px] lg:[--lift-y:var(--lift)] lg:[--surface-y:var(--surface-extra-y)] lg:[--seam-x:-2px]",
        isActive ? "z-20" : elevated ? "z-10" : "",
      )}
    >
      {/* Base surface — carbon-200 ring at rest. Border snaps to
          transparent the moment hover engages so the extended
          top/bottom edges don't read as floating grey strips. */}
      <span
        aria-hidden="true"
        style={followsExtraY}
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 border border-v1-contrast motion-safe:transition-[border-color] motion-safe:duration-200 group-hover:border-transparent group-focus-within:border-transparent group-data-[active]:border-transparent",
          cornerRadius,
          innerEdgeFlat,
        )}
      />

      {/* Salmon gradient overlay — cross-fades opacity 0 → 1 on
          hover so the previous active card retracts cleanly. */}
      <span
        aria-hidden="true"
        style={overlayGeometry}
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-v1-accent-salmon-gradient opacity-0 motion-safe:transition-[opacity,border-radius] motion-safe:duration-[600ms] motion-safe:ease-v1-lift group-hover:opacity-100 group-hover:!rounded group-focus-within:opacity-100 group-focus-within:!rounded group-data-[active]:opacity-100 group-data-[active]:!rounded",
          cornerRadius,
        )}
      />

      {/* Soft-light noise — only visible on hover, blended over the
          salmon overlay so the salmon fill picks up the texture. */}
      <span
        aria-hidden="true"
        style={{
          ...overlayGeometry,
          backgroundImage:
            "url(/assets/v1/textures/.compressed/noise-dark.webp)",
          mixBlendMode: "soft-light",
        }}
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-0 motion-safe:transition-[opacity,border-radius] motion-safe:duration-[600ms] motion-safe:ease-v1-in group-hover:opacity-100 group-hover:!rounded group-focus-within:opacity-100 group-focus-within:!rounded group-data-[active]:opacity-100 group-data-[active]:!rounded",
          cornerRadius,
        )}
      />

      {/* "Popular"-style chip — straddles the card's visible top edge
          at every breakpoint so mobile + SR users know which plan is
          recommended. Lg+ rides `--surface-y` so it tracks the
          surface as it extends; the article's lift transform
          propagates to this child automatically, so no JS spring is
          needed here. Not `aria-hidden` — "POPULAR" conveys plan
          status and should be announced by screen readers. */}
      {/* lg+: the badge straddles the card's top edge. On mobile that
          overflow gets clipped, so it's hidden here and rendered inline
          inside the card header instead (below). */}
      {plan.badge && (
        <span
          style={{ top: "calc(0px - var(--surface-y, 0px))" }}
          className="pointer-events-none absolute left-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
        >
          <Chip>{plan.badge}</Chip>
        </span>
      )}

      {/* Cursor-tracked spotlight — anchored to --mx/--my from the
          shared cursorFx vars. Sits above the salmon so the
          highlight reads on the orange surface. */}
      <span
        aria-hidden="true"
        style={{
          ...overlayGeometry,
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.32), transparent 65%)",
        }}
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 opacity-0 motion-safe:transition-[opacity,border-radius] motion-safe:duration-[500ms] motion-safe:ease-v1-in group-hover:opacity-100 group-hover:!rounded group-focus-within:opacity-100 group-focus-within:!rounded group-data-[active]:opacity-100 group-data-[active]:!rounded",
          cornerRadius,
        )}
      />

      {/* Whole-card click target — the entire card navigates to the
          plan's CTA, not just the button. aria-hidden + tabIndex -1 so
          it doesn't double up with the real CTA link below for keyboard
          / screen-reader users, who reach the same href via the
          ButtonLink. z-20 sits above the card content so a click
          anywhere on the card lands here; pointer events still bubble
          to the article for the cursor-spotlight + hover hand-off. */}
      <a
        href={plan.cta.href}
        aria-hidden="true"
        tabIndex={-1}
        className={cn("absolute inset-0 z-20 outline-none", cornerRadius)}
      />

      {/* Header: plan name + description */}
      <div className="relative z-10 flex flex-col gap-5">
        {/* Mobile-only inline badge — sits inside the card above the plan
            name (the lg+ straddling badge above is hidden < lg). */}
        {plan.badge && (
          <div className="self-center lg:hidden">
            <Chip>{plan.badge}</Chip>
          </div>
        )}
        <div className="flex flex-col gap-4 text-v1-frost">
          <h2 className="text-v1-heading-card">{plan.name}</h2>
          <p className="text-v1-body-sm">{plan.description}</p>
        </div>

        {/* Price block — "Starting at" caption is reserved across all
            three plans via a 16 px spacer when absent so the price
            rows line up at the same baseline. */}
        <div className="flex flex-col items-start text-v1-frost">
          {plan.cost.startsAt ? (
            <p className="text-v1-caption">Starting at</p>
          ) : (
            <span aria-hidden="true" className="block h-[16px]" />
          )}
          <p className="py-4 text-v1-heading-sm">
            {typeof plan.cost.basePrice === "number"
              ? `$${plan.cost.basePrice}/${plan.cost.period}`
              : plan.cost.basePrice}
          </p>
          <p className="text-v1-body-sm">{plan.priceCaption}</p>
        </div>
      </div>

      {/* CTA — shared Button at the new `lg` size (h-52). Card-hover
          flips it to solid frost via `group-hover` overrides so the
          active salmon card reads with the same primary-CTA weight
          the static Pro card used to ship with. `!important` on the
          group-hover classes beats Button's own `:hover` (which
          floods salmon and would otherwise blend into the salmon
          card bg). */}
      <ButtonLink
        href={plan.cta.href}
        variant="secondary"
        className="relative z-10 !w-full group-hover:!bg-v1-frost group-hover:!text-v1-jetBlack group-data-[active]:!bg-v1-frost group-data-[active]:!text-v1-jetBlack"
      >
        {plan.cta.text}
      </ButtonLink>

      {/* Feature bullets — the first three (the headline limits:
          executions / connections / concurrent steps) read larger,
          then a short divider separates the supporting features below. */}
      <div className="relative z-10 flex flex-col gap-4 text-v1-frost">
        <ul className="flex list-disc flex-col gap-3 pl-[21px]">
          {plan.features.slice(0, 3).map((feature) => (
            <li key={feature.text} className="text-v1-body-sm">
              {feature.value && (
                <span className="font-bold">{feature.value} </span>
              )}
              {feature.text}
            </li>
          ))}
        </ul>
        {plan.features.length > 3 && (
          <>
            <span aria-hidden="true" className="h-px w-10 bg-v1-frost/30" />
            <ul className="flex list-disc flex-col gap-3 pl-[21px]">
              {plan.features.slice(3).map((feature) => (
                <li key={feature.text} className="text-v1-body-xs">
                  {feature.value && (
                    <span className="font-bold">{feature.value} </span>
                  )}
                  {feature.text}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </motion.article>
  );
}

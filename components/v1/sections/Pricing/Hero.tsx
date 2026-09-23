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
import LogoWall from "./LogoWall";

// Pixel-perfect port of the hero design + hover
// animation borrowed from Home/FeatureCards:
//   - Four cards sit as separate rounded boxes with a gap between
//     columns so the 4-up row stays scannable.
//   - Hover floods the card with the salmon gradient + soft-light
//     noise, fires a cursor-tracked spotlight, lifts the whole card
//     -8 px, and extends the surface ±12 px above/below the row.
//     The ring grows with that surface so the card doesn't break
//     out of its container.
//   - Pro is the resting highlight. Moving onto another card
//     takes the salmon with you; leaving the row returns it to Pro.
//   - Buttons share one outline-frost style; on group-hover they
//     flood solid frost so the active card reads as the primary CTA.

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

const FEATURE_CATEGORIES = [
  "Platform",
  "Events",
  "Observability",
  "Security",
  "Support",
] as const;

// Inline style for every overlay span that extends with the surface.
// `--surface-y` is the gated view of `--surface-extra-y` — zeroed
// below lg so the spring's geometry doesn't bleed into the
// flush-stacked siblings on mobile.
const followsExtraY: React.CSSProperties = {
  top: "calc(0px - var(--surface-y, 0px))",
  bottom: "calc(0px - var(--surface-y, 0px))",
};

export default function Hero() {
  // The badged plan (Pro) is the resting highlight — salmon with no
  // pointer over it. Hovering a sibling moves the treatment there;
  // leaving the row returns it to Pro.
  const badgedPlanName = PLANS.find((p) => p.badge)?.name ?? null;

  // Serialised hover hand-off — pendingId tracks intent, activeId is
  // what's on screen. Switching siblings retracts the previous active
  // card first and then expands the next after RETRACT_MS.
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
      className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 pb-12 pt-[120px] text-v1-frost sm:px-9 lg:gap-10 lg:px-8 lg:pb-16 lg:pt-[144px]"
    >
      {/* Centered headline, then a full-width logo banner. */}
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h1
          id="pricing-hero-headline"
          className="text-center font-v1Display uppercase tracking-[-0.01em] text-[32px] leading-[36px] sm:text-[44px] sm:leading-[50px] lg:whitespace-nowrap lg:text-[58px] lg:leading-[70px] v1-trim"
        >
          <motion.span {...wordEntry(60)}>
            Pricing that scales with you
          </motion.span>
        </h1>
        <motion.h2
          className="max-w-[52rem] text-center text-v1-body-lg-loose font-normal text-v1-frost/80"
          {...wordEntry(180)}
        >
          Inngest is an open source SDK for orchestrating event-driven apps and
          agents. Start locally, and move to Cloud when you&apos;re ready for
          production. Zero infra required.
        </motion.h2>
      </div>

      <LogoWall />

      <div className="relative">
        <ul className="grid list-none grid-cols-1 gap-6 pl-0 lg:grid-cols-4 lg:gap-5">
          {PLANS.map((plan, i) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              index={i}
              isActive={activeId === plan.name}
              onEnter={() => setPendingId(plan.name)}
              onLeave={() =>
                setPendingId((prev) =>
                  prev === plan.name ? badgedPlanName : prev,
                )
              }
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  index,
  isActive,
  onEnter,
  onLeave,
}: {
  plan: Plan;
  index: number;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  // Each plan is its own rounded box with a gap between columns, so
  // the 4-up row stays scannable. No shared-seam collapse.
  const cornerRadius = "rounded-md";

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

  const overlayGeometry: React.CSSProperties = {
    top: "calc(0px - var(--surface-y, 0px))",
    bottom: "calc(0px - var(--surface-y, 0px))",
  };

  return (
    <motion.li
      {...reveals.item(index)}
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
        "pricing-plan-card group relative isolate flex list-none flex-col gap-4 p-7 pb-4 pt-8 [--lift-y:0px] [--surface-y:0px] sm:px-8 sm:pb-4 sm:pt-8 lg:h-full lg:gap-5 lg:px-8 lg:pb-4 lg:pt-8 lg:[--lift-y:var(--lift)] lg:[--surface-y:var(--surface-extra-y)]",
        isActive ? "z-20" : elevated ? "z-10" : "",
      )}
    >
      {/* Base surface — carbon-200 ring that tracks the surface grow
          so the white container lifts with the card instead of the
          salmon breaking out of a static box. Hover restores the
          shared-seam left edge so the lifted card reads as a full
          outlined container. */}
      <span
        aria-hidden="true"
        style={followsExtraY}
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 border border-v1-contrast",
          cornerRadius,
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

      {/* Name, price, CTA. Descriptions share a min-height so the
          price *block* (Free: $0 + caption; Pro/Business: Starting
          at + amount; Enterprise: Custom + caption) starts on one
          row. Blocks are top-aligned to Free — no invisible
          placeholder rows, which would pin dollar amounts instead
          of the block. A matching min-height on the price block
          keeps CTAs even when a stack is two lines in a different
          order. */}
      <div className="relative z-10 flex shrink-0 flex-col text-v1-frost">
        {/* Mobile-only inline badge — sits inside the card above the plan
            name (the lg+ straddling badge above is hidden < lg). */}
        {plan.badge && (
          <div className="self-center lg:hidden">
            <Chip>{plan.badge}</Chip>
          </div>
        )}
        <h2 className="text-v1-heading-sm">{plan.name}</h2>
        <p className="mt-4 min-h-[4.5rem] font-v1Body text-[16px] leading-6 tracking-[-0.01em]">
          {plan.description}
        </p>

        <div className="mt-2 flex min-h-[72px] flex-col items-start justify-start gap-1">
          {plan.cost.startsAt ? (
            <p className="font-v1Body text-[16px] leading-6 tracking-[-0.01em] text-v1-frost/70">
              Starting at
            </p>
          ) : null}
          <p className="flex h-[44px] items-baseline gap-1">
            {typeof plan.cost.basePrice === "number" ? (
              <>
                <span className="font-v1Heading text-[40px] leading-none tracking-[-0.02em] lg:text-[44px]">
                  ${plan.cost.basePrice}
                </span>
                {plan.cost.period ? (
                  <span className="font-v1Body text-[16px] leading-6 tracking-[-0.01em] text-v1-frost/70">
                    /{plan.cost.period}
                  </span>
                ) : null}
              </>
            ) : (
              <span className="font-v1Heading text-[40px] leading-none tracking-[-0.02em] lg:text-[44px]">
                {plan.cost.basePrice}
              </span>
            )}
          </p>
          {plan.priceCaption ? (
            <p className="font-v1Body text-[16px] leading-6 tracking-[-0.01em] text-v1-frost/70">
              {plan.priceCaption}
            </p>
          ) : null}
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
          className="mt-4 !w-full group-hover:!bg-v1-frost group-hover:!text-v1-jetBlack group-data-[active]:!bg-v1-frost group-data-[active]:!text-v1-jetBlack"
        >
          {plan.cta.text}
        </ButtonLink>
      </div>

      {/* Equal-height category rows so Platform / Events / … start on
          the same rhythm in every card. Empty categories still take a
          slot at lg (hidden on mobile). */}
      <div className="relative z-10 flex flex-1 flex-col gap-[18px]">
        {FEATURE_CATEGORIES.map((category) => {
          const items = plan.features.filter(
            (feature) => feature.category === category,
          );
          if (items.length === 0) {
            return (
              <div
                key={category}
                aria-hidden="true"
                className="hidden lg:block lg:flex-1"
              />
            );
          }
          return (
            <div
              key={category}
              className="flex flex-1 flex-col gap-1.5 text-v1-frost"
            >
              <p className="text-v1-label-sm uppercase tracking-[0.06em] text-v1-frost/40">
                {category}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((feature) => (
                  <li
                    key={`${feature.value ?? ""}-${feature.text}`}
                    className="flex items-start gap-2.5 text-v1-body-sm leading-6"
                  >
                    <CheckMark className="mt-0.5 size-4 shrink-0 text-[#3DE070] group-hover:text-white group-data-[active]:text-white" />
                    <span>
                      {feature.value && (
                        <span className="font-bold">{feature.value} </span>
                      )}
                      {feature.text}
                      {feature.note && (
                        <span className="mt-0.5 block text-v1-body-xs text-v1-frost/80 group-hover:text-white/80 group-data-[active]:text-white/80">
                          {feature.note}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </motion.li>
  );
}

function CheckMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3.2 8.3 6.3 11.4 12.8 4.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

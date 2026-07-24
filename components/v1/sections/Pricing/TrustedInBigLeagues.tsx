"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ButtonLink from "@/components/v1/ButtonLink";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { springs } from "@/utils/v1/springs";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import {
  CURSOR_SPOTLIGHT_SEED,
  onCursorSpotlightMove,
} from "@/utils/v1/cursorFx";

// "Trusted in the Big Leagues".
//
// Three customer story cards share a hairline #7a7a7a border. Hover
// reuses the exact Home/FeatureCards elevation stack:
//   - translateY(-8 px) lift (springs.lift in / springs.glide out)
//   - surface grows ±12 px in height via `--surface-extra-y`
//   - salmon gradient + soft-light noise + cursor spotlight overlays
//     cross-fade in at the new geometry
//   - base surface ring switches to `var(--v1-shadow-card-hover)`
//   - sibling cards dim to brightness(0.55) via `.has-hover-dim`

interface CustomerCard {
  id: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  /** Small lead-in line above the big callout. */
  eyebrow: string;
  /** The big, punchy callout statement. */
  callout: string;
  href: string;
  /** Wears the at-rest hover treatment (salmon + lift) until the user
   * hovers any other card. Only one card should be flagged. */
  featured?: boolean;
}

const CARDS: CustomerCard[] = [
  {
    id: "soundcloud",
    logoSrc: "/assets/customers/soundcloud-logo-white-horizontal.svg",
    logoAlt: "SoundCloud",
    logoWidth: 350,
    logoHeight: 42,
    eyebrow: "Deployed within",
    callout: "1 week",
    href: "/customers/soundcloud?ref=pricing",
  },
  {
    id: "fey",
    logoSrc: "/assets/customers/fey/fey-icon-name.svg",
    logoAlt: "Fey",
    logoWidth: 110,
    logoHeight: 45,
    eyebrow: "Increased processing by",
    callout: "50x",
    href: "/customers/fey?ref=pricing",
    featured: true,
  },
  {
    id: "gitbook",
    logoSrc: "/assets/customers/gitbook-logo-white.svg",
    logoAlt: "GitBook",
    logoWidth: 191,
    logoHeight: 42,
    eyebrow: "Solved",
    callout: "Bi-directional synchronization",
    href: "/customers/gitbook?ref=pricing",
  },
];

const FEATURED_ID = CARDS.find((c) => c.featured)?.id ?? null;

const SURFACE_EXTRA_Y_PX = 12;
const RELEASE_BOUNCE = springs.glide;
const RETRACT_MS = 360;

const followsExtraY: React.CSSProperties = {
  top: "calc(0px - var(--surface-y, 0px))",
  bottom: "calc(0px - var(--surface-y, 0px))",
};

export default function TrustedInBigLeagues() {
  // Serialised hover hand-off identical to FeatureCards — switching
  // between siblings retracts the previous card first so the two
  // springs don't fight on rapid sweeps.
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  // Once the user hovers a non-featured card, the featured card drops
  // its at-rest hover treatment and the row behaves uniformly.
  const [exploredOthers, setExploredOthers] = useState(false);
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
  useEffect(() => {
    if (pendingId && pendingId !== FEATURED_ID && !exploredOthers) {
      setExploredOthers(true);
    }
  }, [pendingId, exploredOthers]);

  return (
    <Section
      aria-labelledby="pricing-trust-heading"
      className="relative"
      containerClassName="flex flex-col gap-v1-stack-lg"
    >
      <SectionHeader
        id="pricing-trust-heading"
        title={
          <>
            Trusted in the
            <br />
            Big Leagues
          </>
        }
      />

      {/* All three cards default to the grey hairline-bordered surface.
          At rest every card is identical and flips to salmon-gradient +
          noise on hover. */}
      <ul className="has-hover-dim flex flex-col items-stretch gap-6 pl-0 sm:[width:round(down,100%,3px)] lg:h-[342px] lg:flex-row lg:items-stretch lg:gap-0">
        {CARDS.map((card, i) => (
          <motion.li
            key={card.id}
            {...reveals.item(i)}
            className="flex flex-1 list-none"
          >
            <Card
              card={card}
              edge={i === 0 ? "left" : i === 2 ? "right" : "middle"}
              isActive={
                activeId === card.id ||
                (!!card.featured && !exploredOthers && activeId === null)
              }
              forceHover={
                !!card.featured && !exploredOthers && activeId !== card.id
              }
              onEnter={() => setPendingId(card.id)}
              onLeave={() =>
                setPendingId((prev) => (prev === card.id ? null : prev))
              }
            />
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}

function Card({
  card,
  edge,
  isActive,
  forceHover,
  onEnter,
  onLeave,
}: {
  card: CustomerCard;
  edge: "left" | "middle" | "right";
  isActive: boolean;
  /** Paints the hover treatment (salmon overlay + noise) without a
   * real pointer over the card. */
  forceHover: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  // Shared-seam border collapse so card-to-card joins read as one
  // hairline rather than two stacked. On mobile the seam is the
  // bottom border; on lg+ it's the left border of every non-first
  // card.
  // Mobile (vertical stack) renders each card as its own separated,
  // fully-bordered + rounded box — no seam collapse. The shared-seam
  // join only kicks in at lg+ where every non-left card drops its
  // left border.
  const innerEdgeFlat = edge === "left" ? "" : "lg:border-l-0";
  const cornerShell = cn(
    "rounded-md",
    edge === "left" && "lg:rounded-l-md lg:rounded-r-none",
    edge === "right" && "lg:rounded-r-md lg:rounded-l-none",
    edge === "middle" && "lg:rounded-none",
  );
  const overlayEdgeFlat = "rounded-none";

  // Hold z-elevation through the lift + grow + shrink window so the
  // card stays above its neighbours throughout the full hover cycle
  // (~700 ms for both springs to settle).
  const [elevated, setElevated] = useState(false);
  useEffect(() => {
    if (isActive) {
      setElevated(true);
      return;
    }
    const t = setTimeout(() => setElevated(false), 700);
    return () => clearTimeout(t);
  }, [isActive]);

  // Surface grows ±12 px so the 5 overlay siblings (border, salmon,
  // noise, spotlight, content shell) extend in lockstep.
  const surfaceY = useMotionValue(0);
  useEffect(() => {
    const controls = animate(
      surfaceY,
      isActive ? SURFACE_EXTRA_Y_PX : 0,
      isActive ? springs.lift : RELEASE_BOUNCE
    );
    return () => controls.stop();
  }, [isActive, surfaceY]);
  const surfaceYVar = useTransform(surfaceY, (v) => `${v}px`);

  // Whole-card translate driven through a CSS var so we can gate it
  // to lg+ via the same indirection as the surface growth.
  const liftY = useMotionValue(0);
  useEffect(() => {
    const controls = animate(
      liftY,
      isActive ? -8 : 0,
      isActive ? springs.lift : RELEASE_BOUNCE
    );
    return () => controls.stop();
  }, [isActive, liftY]);
  const liftYVar = useTransform(liftY, (v) => `${v}px`);

  return (
    <motion.article
      data-feature-card
      data-force-hover={forceHover ? "true" : undefined}
      tabIndex={-1}
      onPointerMove={onCursorSpotlightMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      style={{
        ...CURSOR_SPOTLIGHT_SEED,
        ["--lift" as string]: liftYVar,
        ["--surface-extra-y" as string]: surfaceYVar,
        transform: "translateY(var(--lift-y, 0px))",
        willChange: "transform",
      }}
      className={cn(
        "group relative isolate flex h-full w-full flex-col items-start justify-between gap-10 px-[20px] py-8 lg:gap-0 [--lift-y:0px] [--surface-y:0px] lg:[--lift-y:var(--lift)] lg:[--surface-y:var(--surface-extra-y)]",
        isActive ? "z-20" : elevated ? "z-10" : ""
      )}
    >
      {/* Base surface — grey hairline border at rest, transparent +
          card-hover shadow ring on hover. Geometry follows the spring
          via `--surface-y`. */}
      <span
        aria-hidden="true"
        style={followsExtraY}
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 border border-v1-steel motion-safe:transition-[border-color,box-shadow,border-radius] motion-safe:duration-[700ms] motion-safe:ease-v1-lift group-hover:!rounded group-hover:border-transparent group-hover:shadow-[var(--v1-shadow-card-hover)] group-focus-within:!rounded group-focus-within:border-transparent group-focus-within:shadow-[var(--v1-shadow-card-hover)] group-data-[force-hover]:!rounded group-data-[force-hover]:border-transparent group-data-[force-hover]:shadow-[var(--v1-shadow-card-hover)]",
          cornerShell,
          innerEdgeFlat
        )}
      />

      {/* Salmon-gradient flood — opacity 0 → 1 on hover. */}
      <span
        aria-hidden="true"
        style={followsExtraY}
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-v1-accent-salmon-gradient opacity-0 motion-safe:transition-[opacity,border-radius] motion-safe:duration-[600ms] motion-safe:ease-v1-lift group-hover:!rounded group-hover:opacity-100 group-focus-within:!rounded group-focus-within:opacity-100 group-data-[force-hover]:!rounded group-data-[force-hover]:opacity-100",
          cornerShell,
          overlayEdgeFlat
        )}
      />

      {/* Soft-light noise — same texture the Home FeatureCards layer
          over the salmon on hover. */}
      <span
        aria-hidden="true"
        style={{
          ...followsExtraY,
          backgroundImage:
            "url(/assets/v1/textures/.compressed/noise-dark.webp)",
          mixBlendMode: "soft-light",
        }}
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-0 motion-safe:transition-[opacity,border-radius] motion-safe:duration-[600ms] motion-safe:ease-v1-in group-hover:!rounded group-hover:opacity-100 group-focus-within:!rounded group-focus-within:opacity-100 group-data-[force-hover]:!rounded group-data-[force-hover]:opacity-100",
          cornerShell,
          overlayEdgeFlat
        )}
      />

      {/* Cursor-tracked spotlight. */}
      <span
        aria-hidden="true"
        style={{
          ...followsExtraY,
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.32), transparent 65%)",
        }}
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 opacity-0 motion-safe:transition-[opacity,border-radius] motion-safe:duration-[500ms] motion-safe:ease-v1-in group-hover:!rounded group-hover:opacity-100 group-focus-within:!rounded group-focus-within:opacity-100 group-data-[force-hover]:!rounded group-data-[force-hover]:opacity-100",
          cornerShell,
          overlayEdgeFlat
        )}
      />

      {/* Logo container sized to the tallest logo in the row (Fey,
          45.09 px). Each logo renders at its exact intrinsic
          width × height so SoundCloud and GitBook don't get scaled
          to match the container. */}
      <div className="relative flex h-[45px] items-center lg:mt-6">
        <Image
          src={card.logoSrc}
          alt={card.logoAlt}
          width={card.logoWidth}
          height={card.logoHeight}
          className="block max-w-none object-contain"
          style={{ width: card.logoWidth, height: card.logoHeight }}
        />
      </div>

      {/* Headline + CTA — 32 px gap. */}
      <div className="relative flex w-full flex-col gap-8">
        <h3 className="flex flex-col gap-1.5 text-v1-frost">
          <span className="text-v1-label-sm uppercase tracking-[0.05rem] text-v1-frost/60">
            {card.eyebrow}
          </span>
          <span className="font-v1Heading text-[32px] font-normal uppercase leading-[1.0] tracking-[-0.01em] text-balance sm:text-[38px]">
            {card.callout}
          </span>
        </h3>
        {/* Cards flood salmon on hover, so the primary variant's salmon
            hover reads as no contrast — override it to black (`!` beats
            the variant's own hover:bg). */}
        <ButtonLink
          href={card.href}
          variant="primary"
          className="relative z-10 hover:!bg-v1-jetBlack"
        >
          Read Customer Story
        </ButtonLink>
      </div>
    </motion.article>
  );
}

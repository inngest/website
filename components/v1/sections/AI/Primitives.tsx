"use client";

import Link from "@/components/v1/Link";
import { useEffect, useState } from "react";
import { cn } from "@/utils/v1/cn";
import { appendRef } from "@/utils/v1/ref";
import { useReveal } from "@/utils/v1/useReveal";
import {
  onCursorSpotlightMove,
  CURSOR_SPOTLIGHT_SEED,
} from "@/utils/v1/cursorFx";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { springs } from "@/utils/v1/springs";
import { reveals } from "@/utils/v1/reveals";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

/**
 * "Primitives for every pattern" — 6-card grid sharing the same hover
 * chrome as Home/FeatureCards (frost border → salmon flood + noise).
 */

interface Primitive {
  id: string;
  title: string;
  body: string;
  iconSrc: string;
  /** Intrinsic SVG width — paired with a fixed 164px intrinsic height
   *  so the browser can reserve the correct aspect ratio. CSS scales
   *  the visible size. */
  iconWidth: number;
  href: string;
}

const PRIMITIVES: Primitive[] = [
  {
    id: "checkpointing",
    title: "Step-level checkpointing",
    body: "Each step is an atomic transaction. When step 7 fails only step 7 retries — the tokens spent on steps 1-6 are never wasted.",
    iconSrc: "/assets/v1/primitives/icon-1-checkpointing.svg",
    iconWidth: 168,
    href: "/docs/setup/checkpointing",
  },
  {
    id: "telemetry",
    title: "LLM telemetry, per call",
    body: "Every model call is captured: prompt, response, token count, latency, and cost — automatically. Offloads the wait so serverless functions don't burn compute.",
    iconSrc: "/assets/v1/primitives/icon-2-telemetry.svg",
    iconWidth: 164,
    href: "/docs/platform/monitor/insights",
  },
  {
    id: "flow-control",
    title: "Per-key flow control",
    body: "Rate-limit by any identifier. One user's burst can't saturate your OpenAI quota and degrade everyone else. Priority queuing for premium tiers, built in.",
    iconSrc: "/assets/v1/primitives/icon-3-flow-control.svg",
    iconWidth: 164,
    href: "/docs/guides/flow-control",
  },
  {
    id: "human-in-the-loop",
    title: "Human-in-the-loop",
    body: "Pause mid-workflow for review or approval — hours or days. State maintained automatically. No polling, no cron, no database hacks.",
    iconSrc: "/assets/v1/primitives/icon-4-human-loop.svg",
    iconWidth: 212,
    href: "/docs/ai-patterns/human-in-the-loop",
  },
  {
    id: "no-timeout",
    title: "No timeout walls",
    body: "LLM chains run for minutes. Batch pipelines run for hours. Inngest functions run to completion across any host — no 30-second limits.",
    iconSrc: "/assets/v1/primitives/icon-5-no-timeout.svg",
    iconWidth: 164,
    href: "/docs/features/inngest-functions/cancellation/cancel-on-timeouts",
  },
  {
    id: "local-env",
    title: "Full local environment",
    body: "One command. Live traces, step inspection, event replay, and every prompt/response pair — completely offline, before a single token is spent.",
    iconSrc: "/assets/v1/primitives/icon-6-local-env.svg",
    iconWidth: 298,
    href: "/docs/local-development",
  },
];

export default function Primitives() {
  return (
    <Section aria-labelledby="ai-primitives-heading" className="relative">
      <SectionHeader
        id="ai-primitives-heading"
        title={
          <>
            Primitives for every
            <br />
            pattern
          </>
        }
        body="DX humans love, structure agents grok."
        // Designer-locked larger tagline body (24px at sm+, vs the
        // standard 18px). Base inherits body-lg-loose family/trim; the
        // sm override bumps the size + leading to the design spec.
        bodyClassName="sm:text-2xl sm:leading-[40px]"
      />

      <div className="mt-v1-stack">
        <PrimitiveList />
      </div>
    </Section>
  );
}

function PrimitiveList() {
  const { ref } = useReveal<HTMLUListElement>();
  return (
    <ul
      ref={ref}
      className="has-primitive-dim grid grid-cols-1 gap-[10px] lg:grid-cols-3"
    >
      {PRIMITIVES.map((p, i) => (
        <motion.li key={p.id} {...reveals.item(i)} className="h-full">
          <PrimitiveCard primitive={p} />
        </motion.li>
      ))}
    </ul>
  );
}

// Hover surface extends this many px above/below the row on active —
// mirrors Home/FeatureCards.
const PRIMITIVE_SURFACE_EXTRA_Y_PX = 12;
const followsExtraY: React.CSSProperties = {
  top: "calc(0px - var(--surface-y, 0px))",
  bottom: "calc(0px - var(--surface-y, 0px))",
};

// Shared overlay shell — every hover overlay sits absolute, behind the
// content, and inherits the card's border-radius on hover/focus.
const OVERLAY_BASE =
  "pointer-events-none absolute inset-0 -z-10 rounded group-hover:!rounded group-focus-within:!rounded";

function PrimitiveCard({ primitive }: { primitive: Primitive }) {
  // Hover-out uses `springs.glide` (over-damped, zero overshoot) so the
  // card snaps back without jello reverb.
  const [active, setActive] = useState(false);

  const liftY = useMotionValue(0);
  useEffect(() => {
    const controls = animate(
      liftY,
      active ? -8 : 0,
      active ? springs.lift : springs.glide,
    );
    return () => controls.stop();
  }, [active, liftY]);
  const liftYVar = useTransform(liftY, (v) => `${v}px`);

  const surfaceY = useMotionValue(0);
  useEffect(() => {
    const controls = animate(
      surfaceY,
      active ? PRIMITIVE_SURFACE_EXTRA_Y_PX : 0,
      active ? springs.lift : springs.glide,
    );
    return () => controls.stop();
  }, [active, surfaceY]);
  const surfaceYVar = useTransform(surfaceY, (v) => `${v}px`);

  return (
    <Link
      href={appendRef(primitive.href, "ai")}
      // Card hrefs target docs routes that may not exist yet (planned
      // IA). Hover-prefetch 404s in the console — opt out.
      prefetch={false}
      aria-label={`${primitive.title} — see docs`}
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-frost/30"
    >
      <motion.article
        data-primitive-card
        onPointerMove={onCursorSpotlightMove}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        style={{
          ...CURSOR_SPOTLIGHT_SEED,
          ["--lift" as string]: liftYVar,
          ["--surface-extra-y" as string]: surfaceYVar,
          transform: "translateY(var(--lift-y, 0px))",
          willChange: "transform",
        }}
        className={cn(
          "group relative isolate flex h-full flex-col items-center gap-10 px-6 pb-8 pt-6 [--lift-y:0px] [--surface-y:0px] lg:[--lift-y:var(--lift)] lg:[--surface-y:var(--surface-extra-y)]",
          active && "z-20",
        )}
      >
        <span
          aria-hidden="true"
          style={followsExtraY}
          className={cn(
            OVERLAY_BASE,
            "border border-v1-frost/60 bg-v1-surfaceElevated motion-safe:transition-[background-color,box-shadow,border-radius] motion-safe:duration-[700ms] motion-safe:ease-v1-lift group-hover:border-transparent group-hover:shadow-[var(--v1-shadow-card-hover)] group-focus-within:border-transparent",
          )}
        />

        <span
          aria-hidden="true"
          style={followsExtraY}
          className={cn(
            OVERLAY_BASE,
            "bg-v1-accent-salmon-gradient opacity-0 motion-safe:transition-[opacity,border-radius] motion-safe:duration-[600ms] motion-safe:ease-v1-lift group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        />

        <span
          aria-hidden="true"
          style={{
            ...followsExtraY,
            backgroundImage:
              "url(/assets/v1/textures/.compressed/noise-dark.webp)",
            mixBlendMode: "soft-light",
          }}
          className={cn(
            OVERLAY_BASE,
            "bg-cover bg-center opacity-0 motion-safe:transition-[opacity,border-radius] motion-safe:duration-[600ms] motion-safe:ease-v1-in group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        />

        <span
          aria-hidden="true"
          style={{
            ...followsExtraY,
            background:
              "radial-gradient(360px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.32), transparent 65%)",
          }}
          className={cn(
            OVERLAY_BASE,
            "opacity-0 motion-safe:transition-[opacity,border-radius] motion-safe:duration-[500ms] motion-safe:ease-v1-in group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        />

        <div className="w-full">
          <DocsButton />
        </div>

        <img
          src={primitive.iconSrc}
          alt=""
          width={primitive.iconWidth}
          height={164}
          className="block h-[120px] w-auto"
        />

        <div className="flex w-full flex-col gap-[23px]">
          <h3 className="text-balance font-v1Heading text-[28px] leading-[1.1] tracking-[-0.01em] sm:text-[32px] lg:text-[36px]">
            {primitive.title}
          </h3>
          <p className="text-pretty text-v1-body-lg-loose">{primitive.body}</p>
        </div>
      </motion.article>
    </Link>
  );
}

// Visual-only "Docs" tag — the parent <Link> handles navigation.
// Mirrors the type stack of <Button> so every CTA shares one voice.
// Rounded-pill, 2px frost border, frost uppercase mono label.
// Left-aligned + auto-width on every breakpoint (the parent's `w-full`
// wrapper keeps it flush-left). Rest fill is the
// Background-Gradient-Black token; on card hover the chip floods
// salmon-200 (`bg-none` clears the gradient so the solid colour shows).
function DocsButton() {
  return (
    <span
      data-docs-button
      className={cn(
        "font-v1Label font-semibold tracking-[normal] text-[12px] inline-flex h-10 min-w-[144px] items-center justify-center rounded-full border-2 px-5 uppercase",
        "bg-v1-gradient-black",
        "motion-safe:transition-[background-color,border-color,color] motion-safe:duration-300 motion-safe:ease-v1-out",
        "text-v1-frost border-v1-frost",
        "group-hover:bg-none group-hover:bg-v1-accent-salmon",
      )}
    >
      Docs
    </span>
  );
}

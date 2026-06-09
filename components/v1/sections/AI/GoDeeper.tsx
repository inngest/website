"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { appendRef } from "@/utils/v1/ref";
import { reveals } from "@/utils/v1/reveals";
import Section from "@/components/v1/sections/shared/Section";
import {
  onCursorTiltMove,
  onCursorTiltLeave,
  CURSOR_TILT_SEED,
} from "@/utils/v1/cursorFx";

/**
 * AI page "Go Deeper" — a "Resources" eyebrow + "GO DEEPER" headline
 * sitting on a wide grey-noise banner (right half tinted blue via
 * mix-blend-color), followed by a 2 × 2 grid of resource cards.
 *
 * Each card is title + body + Docs button — no images, no hover
 * chrome. Cards intentionally stop at the 2/3 column line, leaving the
 * right third as breathing room; we mirror that by capping the inner
 * column width rather than spanning the section.
 */

interface Resource {
  id: string;
  title: string;
  body: string;
  href: string;
}

// Body copy is placeholder lorem — designers haven't supplied real
// per-resource descriptions yet.
const BODY_PLACEHOLDER =
  "Elementum auctor eros et velit tellus mattis mattis. Lectus risus cursus.";

const RESOURCES: Resource[] = [
  {
    id: "ai-inference",
    title: "AI Inference",
    body: BODY_PLACEHOLDER,
    href: "/docs/features/inngest-functions/steps-workflows/step-ai-orchestration",
  },
  {
    id: "agents-rag",
    title: "AI agents and RAG",
    body: BODY_PLACEHOLDER,
    href: "/docs/agent-kit",
  },
  {
    id: "durable-agents",
    title: "Building durable\nagents",
    body: BODY_PLACEHOLDER,
    href: "/docs/guides/multi-step-functions",
  },
  {
    id: "realtime-hitl",
    title: "Realtime and\nHuman-in-the-loop",
    body: BODY_PLACEHOLDER,
    href: "/docs/guides/human-in-the-loop",
  },
];

// One-off marketing colour for the banner overlay, not promoted to the
// v1 token set.
const BANNER_BLUE = "#2f33cb";

export default function GoDeeper() {
  return (
    <Section aria-label="Go deeper — resources" className="relative">
      <div className="flex max-w-[936px] flex-col gap-12">
        <motion.div {...reveals.heading}>
          <Banner />
        </motion.div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2">
          {RESOURCES.map((r, i) => (
            <motion.div key={r.id} {...reveals.item(i)}>
              <ResourceCard resource={r} />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Banner() {
  return (
    <div className="relative isolate aspect-[2/1] w-full overflow-hidden">
      {/* Banner asset bleeds to edges. `?v=3` busts Vercel's edge
          cache so the new asset replaces the old one without a
          same-filename stale-cache miss. */}
      <img
        src="/assets/v1/go-deeper/.compressed/banner.webp?v=3"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Right-half blue tint — `mix-blend-color` colourises the
          underlying greydient noise while preserving its luminosity. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ backgroundColor: BANNER_BLUE, mixBlendMode: "color" }}
      />

      {/* 3 px inset matches where the G in GO below visually sits
          (its font-bearing parks the glyph just inside the image
          edge). Without it, the smaller mono label reads as flush. */}
      <p className="text-v1-label-sm sm:text-v1-label-md absolute left-[3px] top-1/2 -translate-y-1/2 uppercase text-v1-frost">
        Resources
      </p>

      {/* GO / DEEPER positioned at the bottom of each half so the
          break between words sits exactly on the blue tint boundary
          (50% of banner width). Bottom padding leaves the descender
          space reserved below the cap line. */}
      <h2 className="absolute inset-x-0 bottom-0 flex font-v1Heading text-[32px] font-normal uppercase leading-none text-v1-frost sm:text-[56px] lg:text-[64px]">
        <span className="block w-1/2">Go</span>
        <span className="block w-1/2">Deeper</span>
      </h2>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  // Whole-card link — anywhere on the card navigates to
  // resource.href, and the inline Docs badge mirrors the card's
  // hover state via `group-hover/card`. Nested anchors aren't
  // allowed, so the Docs visual is a styled <span>, not a real
  // Button. Accessibility: aria-label restated for screen readers,
  // focus-visible ring for keyboard navigation.
  return (
    <Link
      href={appendRef(resource.href, "ai")}
      // Several resource hrefs (e.g. /docs/agent-kit) redirect
      // off-domain; default hover-prefetch follows the redirect
      // and CORS-fails on the RSC payload.
      prefetch={false}
      aria-label={`${resource.title.replace(/\n/g, " ")} — see docs`}
      onPointerMove={onCursorTiltMove}
      onPointerLeave={onCursorTiltLeave}
      style={CURSOR_TILT_SEED}
      className="group/card relative isolate flex flex-col items-start gap-[26px] rounded-md border border-transparent p-5 motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-[500ms] motion-safe:ease-v1-in hover:[--lift:-4px] hover:border-v1-frost/[0.18] hover:shadow-[0_28px_60px_-32px_rgba(0,0,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-frost/30"
    >
      {/* Cursor sheen — frost wash that tracks the pointer. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 rounded-md opacity-0 motion-safe:transition-opacity motion-safe:duration-[420ms] group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), rgba(232, 234, 237, 0.08), transparent 60%)",
        }}
      />

      <h3 className="whitespace-pre-line font-v1Heading text-[24px] font-normal leading-[1.2] text-v1-frost sm:text-[32px] sm:leading-none">
        {resource.title}
      </h3>
      {/* Docs badge — visual only (the parent Link handles
          clicks). Mirrors `Button variant="primary"` style and
          flips to salmon on parent card hover via
          `group-hover/card:*`. */}
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-10 min-w-[144px] shrink-0 items-center justify-center whitespace-nowrap rounded-md px-5 font-v1Label text-[12px] font-semibold uppercase tracking-[normal]",
          "bg-v1-frost text-v1-jetBlack shadow-[inset_0_0_0_2px_rgb(255_255_255)]",
          "motion-safe:transition-[background-color,box-shadow,color] motion-safe:duration-300 motion-safe:ease-v1-out",
          "group-hover/card:bg-v1-accent-salmon group-hover/card:text-v1-frost group-hover/card:shadow-none",
        )}
      >
        Docs
      </span>
    </Link>
  );
}

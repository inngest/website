"use client";

import { useState } from "react";
import { cn } from "@/utils/v1/cn";
import { appendRef } from "@/utils/v1/ref";
import {
  onCursorSpotlightMove,
  CURSOR_SPOTLIGHT_SEED,
} from "@/utils/v1/cursorFx";
import HoverCardShell from "@/components/v1/sections/shared/HoverCardShell";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { AnimatePresence, motion } from "motion/react";
import { tweens } from "@/utils/v1/springs";
import { BlackReveal } from "@/components/v1/sections/shared/BlackReveal";

/**
 * Language picker uses ARIA tablist/tab/tabpanel so SR users can
 * navigate the languages and hear the cards announced on swap.
 */

const PANEL_ID = "start-building-quickstarts";

type LanguageId = "nextjs" | "node" | "python" | "go";

interface Language {
  id: LanguageId;
  label: string;
  iconSrc: string;
}

interface Quickstart {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
}

const PLACEHOLDER_BODY = "Diam quam dolor sed mus venenatis est vitae.";

const QUICKSTARTS_BY_LANGUAGE: Record<LanguageId, Quickstart[]> = {
  nextjs: [
    {
      eyebrow: "Quickstart",
      title: "Get Started in Next.js",
      body: PLACEHOLDER_BODY,
      href: "/docs/getting-started/nextjs-quick-start",
    },
    {
      eyebrow: "AI",
      title: "View in Next.js AI Templates",
      body: PLACEHOLDER_BODY,
      href: "/docs/agent-kit",
    },
    {
      eyebrow: "Non-AI",
      title: "Explore in Next.js Workflows",
      body: PLACEHOLDER_BODY,
      href: "/docs/guides/working-with-loops",
    },
  ],
  node: [
    {
      eyebrow: "Quickstart",
      title: "Get Started in Node.js",
      body: PLACEHOLDER_BODY,
      href: "/docs/getting-started/nodejs-quick-start",
    },
    {
      eyebrow: "AI",
      title: "View in Node.js AI Templates",
      body: PLACEHOLDER_BODY,
      href: "/docs/agent-kit",
    },
    {
      eyebrow: "Non-AI",
      title: "Explore in Node.js Workflows",
      body: PLACEHOLDER_BODY,
      href: "/docs/guides/working-with-loops",
    },
  ],
  python: [
    {
      eyebrow: "Quickstart",
      title: "Get Started in Python",
      body: PLACEHOLDER_BODY,
      href: "/docs/reference/python",
    },
    {
      eyebrow: "AI",
      title: "View in Python AI Templates",
      body: PLACEHOLDER_BODY,
      href: "/docs/reference/python",
    },
    {
      eyebrow: "Non-AI",
      title: "Explore in Python Workflows",
      body: PLACEHOLDER_BODY,
      href: "/docs/reference/python",
    },
  ],
  go: [
    {
      eyebrow: "Quickstart",
      title: "Get Started in Go",
      body: PLACEHOLDER_BODY,
      href: "/docs/reference/go",
    },
    {
      eyebrow: "AI",
      title: "View in Go AI Templates",
      body: PLACEHOLDER_BODY,
      href: "/docs/reference/go",
    },
    {
      eyebrow: "Non-AI",
      title: "Explore in Go Workflows",
      body: PLACEHOLDER_BODY,
      href: "/docs/reference/go",
    },
  ],
};

const LANGUAGES: Language[] = [
  { id: "nextjs", label: "Next.JS", iconSrc: "/assets/v1/start-building/nextjs.png" },
  { id: "node", label: "Node.JS", iconSrc: "/assets/v1/start-building/node.svg" },
  { id: "python", label: "Python", iconSrc: "/assets/v1/start-building/python.svg" },
  { id: "go", label: "Go", iconSrc: "/assets/v1/start-building/go.svg" },
];

export default function StartBuilding() {
  const [activeLang, setActiveLang] = useState<LanguageId>("nextjs");
  const cards = QUICKSTARTS_BY_LANGUAGE[activeLang];

  return (
    <Section
      aria-label="Start building"
      className="relative"
      containerClassName="flex flex-col gap-[58px]"
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-11 lg:grid-cols-3">
        <SectionHeader
          className="lg:col-span-2"
          titleClassName="text-balance"
          title="Start Building"
          body={
            <>
              Pick a quick start template{" "}
              <br className="hidden lg:inline" />
              to get rolling.
            </>
          }
          // Larger heading-sm lead (not the default body-lg-loose);
          // frost since it reads as a sub-heading.
          bodyClassName="text-v1-heading-sm text-v1-frost"
        />
        <LanguagePicker
          languages={LANGUAGES}
          active={activeLang}
          onSelect={setActiveLang}
        />
      </div>

      <ul
        id={PANEL_ID}
        role="tabpanel"
        aria-live="polite"
        className="
          grid grid-cols-1 gap-x-4 gap-y-4
          lg:grid-cols-3 lg:gap-y-12
        "
      >
        {/* AnimatePresence wraps the language swap so cards fade
            out then the new set staggers in via the v1 tweens.entry
            curve. Replaces the v1-quickstart-in CSS keyframe. */}
        <AnimatePresence mode="wait">
          {cards.map((q, idx) => (
            <motion.li
              key={`${activeLang}-${q.eyebrow}`}
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ ...tweens.entry, delay: idx * 0.09 }}
            >
              <QuickstartCard quickstart={q} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Section>
  );
}

function LanguagePicker({
  languages,
  active,
  onSelect,
}: {
  languages: Language[];
  active: LanguageId;
  onSelect: (id: LanguageId) => void;
}) {
  return (
    <div role="tablist" aria-label="Choose a language" className="flex flex-col">
      {languages.map((lang, i) => {
        const isActive = lang.id === active;
        return (
          <button
            key={lang.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={PANEL_ID}
            onClick={() => onSelect(lang.id)}
            onPointerMove={onCursorSpotlightMove}
            style={{
              ...CURSOR_SPOTLIGHT_SEED,
              // Full 2 px overlap so the seam between buttons is a
              // single 2 px hairline (not a 3 px stack from the old
              // `-mt-px` half-overlap).
              marginTop: i === 0 ? 0 : "-2px",
            }}
            className={cn(
              "v1-lang-button group relative flex h-12 items-center gap-3 overflow-hidden border-2 px-4 text-left",
              "motion-safe:transition-[background-color,border-color,color] motion-safe:duration-[300ms] motion-safe:ease-v1-out",
              // z-index stack: active sits on top so its salmon
              // border wins both seams (above + below); hovered
              // non-active sits above defaults but below active so
              // hovering a neighbour never covers the active's
              // salmon border with white.
              isActive
                ? "z-[3] border-v1-accent-salmon bg-v1-accent-salmon"
                : "z-[1] border-v1-frost bg-transparent hover:z-[2] hover:bg-v1-frost/[0.04]"
            )}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-0 motion-safe:transition-opacity motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover:opacity-100"
              style={{
                background: isActive
                  ? "radial-gradient(180px circle at var(--mx) var(--my), rgba(255, 230, 215, 0.18), transparent 70%)"
                  : "radial-gradient(180px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.14), transparent 70%)",
              }}
            />
            {/* Fixed 24 × 24 icon slot. Next.js logo is a black
                circle with a transparent "N" cutout — a 19 px white
                disc sits behind it so the N reads white. */}
            <span
              data-lang={lang.id}
              className="v1-lang-icon relative flex size-6 shrink-0 items-center justify-center"
            >
              {lang.id === "nextjs" && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 m-auto size-[19px] rounded-full bg-v1-frost"
                />
              )}
              <img
                aria-hidden="true"
                src={lang.iconSrc}
                alt=""
                className="relative block size-6 object-contain"
              />
            </span>
            {/* Label wrapped in a fixed h-6 flex-center container
                that matches the icon's 24 × 24 box exactly. Forces
                the label's optical centerline to share the icon's
                centerline regardless of font metrics or
                BlackReveal's baseline alignment. */}
            <BlackReveal
              fillColor="rgb(var(--color-v1-bleed-base))"
              delay={i * 80}
              block
            >
              <span className="flex h-6 items-center">
                <span className="text-v1-label-md inline-block uppercase leading-none text-v1-frost">
                  {lang.label}
                </span>
              </span>
            </BlackReveal>
          </button>
        );
      })}
    </div>
  );
}

function QuickstartCard({ quickstart }: { quickstart: Quickstart }) {
  return (
    // -mx-4 / lg:mx-0 lets the hover border bleed past the content
    // edge on mobile (where the grid sits flush to the viewport)
    // but tucks back inside the grid at lg+.
    <HoverCardShell
      href={appendRef(quickstart.href, "home-start-building")}
      className="gap-8 -mx-4 px-4 pb-6 pt-5 lg:mx-0"
    >
      <div className="flex flex-col gap-2.5">
        {/* `mr-2` (animated with width) instead of flex gap so the
            row stays collapsed at rest — gap would reserve 8px at
            zero block width. */}
        <div className="flex items-center">
          <span
            aria-hidden="true"
            className="block h-[10px] w-0 origin-center scale-y-0 bg-v1-accent-salmon ease-v1-in motion-safe:transition-[width,margin,transform] motion-safe:duration-[450ms] group-hover:mr-2 group-hover:w-[2px] group-hover:scale-y-100"
          />
          <p className="text-v1-label-md uppercase motion-safe:transition-colors motion-safe:duration-[400ms] group-hover:text-v1-accent-salmon">
            {quickstart.eyebrow}
          </p>
        </div>
        {/* Raw utilities (not text-v1-heading-card) because the design
            specs lh=font-size here while the token is calibrated looser. */}
        <h3 className="max-w-[310px] font-whyte text-[24px] font-normal leading-[32px] mt-1 lg:text-[32px]">
          {quickstart.title}
        </h3>
      </div>
      {/* Arrow renders at all breakpoints — same affordance the
          card carries everywhere; no separate mobile underline. */}
      <span className="text-v1-label-md uppercase motion-safe:transition-colors motion-safe:duration-300 group-hover:text-v1-accent-salmon">
        Get Started
        <span
          aria-hidden="true"
          className="ml-2 inline-block motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover:translate-x-[6px]"
        >
          →
        </span>
      </span>
    </HoverCardShell>
  );
}


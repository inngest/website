"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Image from "next/image";
import { cn } from "@/utils/v1/cn";
import { tweens } from "@/utils/v1/springs";
import { CURSOR_SPOTLIGHT_SEED } from "@/utils/v1/cursorFx";
import {
  MARKET_COPY,
  HERO_BODY,
  HERO_NARRATIVE,
  type HeroNarrative,
  type Market,
} from "@/components/v1/sections/LongRun/data";
import CourseLine from "@/components/v1/sections/LongRun/CourseLine";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import InstallButton from "@/components/v1/sections/LongRun/InstallButton";
import { handleAnchorClick } from "@/components/v1/sections/LongRun/useAnchorScroll";

/**
 * Campaign hero — the first thing someone sees after scanning a poster or
 * a DOOH panel, so it has to land the campaign line before anything else.
 *
 * The headline is set as three stacked display lines on a salmon panel
 * (the v1 accent used by the /ai and /webhooks heroes), with the marathon
 * course drawing itself across the bottom edge. Copy is market-aware: the
 * eyebrow and lede name the city the visitor is standing in, so the page
 * reads as a continuation of the street rather than a generic product page.
 */

// Mirrors SplitHero's entry cascade so the campaign page feels like it
// belongs to the same site: SSR-render the from-state inline, then let
// motion animate straight to the animate state without a hydration snap.
const entryAnim = (delayMs: number) => ({
  style: {
    opacity: 0,
    transform: "translateY(14px)",
    willChange: "transform, opacity",
  } as const,
  initial: false as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { ...tweens.entry, delay: delayMs / 1000 },
});
const entry = entryAnim;

/**
 * The hero's copy stack — bridge lines, body, closer, CTAs and the small
 * contextual note. Extracted because it renders in two different places:
 * inside the left column on markets with a product visual, and as the
 * right-hand rail on markets without one.
 */
function HeroCopyStack({
  narrative,
  entry,
}: {
  narrative: HeroNarrative;
  entry: typeof entryAnim;
}) {
  // The dark SF hero takes the green campaign accent; the salmon poster
  // heroes keep the frost-on-salmon buttons.
  const onDark = Boolean(narrative.visual);
  const primaryClass = onDark
    ? "!w-full !border-v1-accent-green !bg-transparent !text-v1-accent-green hover:!bg-v1-accent-green hover:!text-v1-jetBlack sm:!w-auto"
    : "!w-full hover:!border-v1-jetBlack hover:!bg-v1-jetBlack hover:!text-v1-frost sm:!w-auto";
  return (
    <div className="flex flex-col gap-8">
      <motion.div {...entry(520)} className="flex flex-col gap-8">
        {narrative.bridge.length > 0 && (
          <div className="flex flex-col gap-2">
            {narrative.bridge.map((line) => (
              <p key={line} className="text-v1-heading-xs-loose !text-v1-frost">
                {line}
              </p>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-5">
          {narrative.body.map((para) => (
            <p key={para} className="text-v1-body-lg-loose !text-v1-frost/85">
              {para}
            </p>
          ))}
        </div>
        {narrative.closer && (
          <p className="text-v1-heading-xs-loose !text-v1-frost">
            {narrative.closer}
          </p>
        )}
      </motion.div>

      <motion.div {...entry(640)}>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <ButtonLink
            href={narrative.cta.href}
            prefetch={false}
            variant="primary"
            className={primaryClass}
          >
            {narrative.cta.label}
          </ButtonLink>
          {narrative.installCta && (
            <InstallButton
              label={narrative.installCta.label}
              command={narrative.installCta.command}
              className="w-full sm:w-auto"
            />
          )}
          {narrative.secondaryCta && (
            <ButtonLink
              href={narrative.secondaryCta.href}
              variant="secondary"
              // Stays a real anchor so it works without JS and is announced
              // as a link; the handler only upgrades the jump to a smooth
              // scroll, and honours reduced motion.
              onClick={handleAnchorClick(
                narrative.secondaryCta.href.replace("#", "")
              )}
              className="!w-full hover:!border-v1-jetBlack hover:!bg-v1-jetBlack hover:!text-v1-frost sm:!w-auto"
            >
              {narrative.secondaryCta.label} →
            </ButtonLink>
          )}
        </div>
        {narrative.note && (
          <p className="text-v1-body-sm mt-6 !text-v1-frost/70">
            {narrative.note}
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default function Hero({ market }: { market: Market }) {
  const copy = MARKET_COPY[market];
  // Markets on the narrative cut (NYC today) replace the lede + one-breath
  // explanation with the poster→production turn and a single CTA. Markets
  // without an entry keep the original short hero untouched.
  const narrative = HERO_NARRATIVE[market];
  const eyebrow = narrative?.eyebrow ?? copy.eyebrow;
  // With a product visual the hero becomes a true split: the whole copy
  // stack (headline, body, CTAs) reads down the left column and the
  // product UI sits beside it. Without one, the headline and the rail
  // share the row as before.
  const hasVisual = Boolean(narrative?.visual);

  return (
    <section
      aria-labelledby="long-run-hero-heading"
      className={cn(
        "relative w-full overflow-hidden text-v1-frost",
        // The SF design puts the hero on the dark canvas; the other
        // campaign cuts keep the salmon poster panel.
        hasVisual ? "bg-v1-canvasBase" : "bg-v1-accent-salmon"
      )}
      onPointerMove={(e) => {
        // Cursor spotlight, same technique as SplitHero: write the
        // pointer position onto the section as CSS custom properties and
        // let a single radial-gradient overlay repaint.
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        el.style.setProperty(
          "--mx",
          `${((e.clientX - r.left) / r.width) * 100}%`
        );
        el.style.setProperty(
          "--my",
          `${((e.clientY - r.top) / r.height) * 100}%`
        );
      }}
      style={CURSOR_SPOTLIGHT_SEED}
    >
      {/* No grain overlay here, deliberately: the shared grain asset is a
          tall portrait with directional lighting baked in, so it only reads
          as texture cropped to /ai's 2/3 panel — full-bleed it puts a hard
          light/dark block across the hero. A flat panel plus the cursor
          spotlight is also closer to the printed poster. */}
      {!hasVisual && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            background:
              "radial-gradient(300px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.18), transparent 78%)",
          }}
        />
      )}

      {/* Vertical padding runs a step heavier than the standard section
          box so the campaign line has room to be the loudest thing on the
          site; the top value also clears the fixed header. */}
      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-[1440px] px-6 py-24 sm:px-9 lg:px-8 lg:py-40",
          // The narrative cut carries two paragraphs and a CTA beside the
          // campaign line rather than under it — stacked, the right half
          // of the panel sits empty on desktop. Below lg both cuts are one
          // column.
          narrative &&
            !hasVisual &&
            "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-end lg:gap-x-16",
          // Split hero: copy column, then the product UI. Centred on the
          // row so the screenshot sits against the middle of the stack
          // rather than dropping below it.
          hasVisual &&
            "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)] lg:items-center lg:gap-x-12"
        )}
      >
        <div className={cn(hasVisual && "flex flex-col")}>
          <motion.p
            {...entry(40)}
            className="text-v1-label-md uppercase text-v1-frost"
          >
            {narrative?.eyebrowAccent ? (
              <>
                <span className="text-v1-frost">{eyebrow}</span>{" "}
                <span className="text-v1-accent-green">
                  {narrative.eyebrowAccent}
                </span>
              </>
            ) : (
              eyebrow
            )}
          </motion.p>

          {/* The campaign line, set as large as the grid allows. Three
              lines on desktop; it reflows naturally below lg. */}
          <h1
            id="long-run-hero-heading"
            className="text-v1-display-hero mt-8 uppercase text-v1-frost lg:mt-10"
          >
            {["Build for", "the long", "run."].map((line, i) => (
              <motion.span
                key={line}
                className="block"
                {...entry(120 + i * 110)}
              >
                {line}
              </motion.span>
            ))}
          </h1>
          {hasVisual && narrative && (
            <HeroCopyStack narrative={narrative} entry={entry} />
          )}
        </div>

        {hasVisual && narrative?.visual ? (
          <motion.div {...entry(700)} className="mt-12 lg:mt-0">
            <GradientFrame
              variant="black"
              className="overflow-hidden rounded-lg"
            >
              <Image
                src={narrative.visual.src}
                alt={narrative.visual.alt}
                width={narrative.visual.width}
                height={narrative.visual.height}
                // Above the fold, so not lazy-loaded. The panel occupies
                // ~46% of the container at lg and the full width below it;
                // stating that lets Next pick a variant that matches the
                // slot instead of undershooting it.
                priority
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="h-auto w-full"
              />
            </GradientFrame>
          </motion.div>
        ) : narrative ? (
          <div className="mt-10 max-w-[620px] lg:mt-0">
            <HeroCopyStack narrative={narrative} entry={entry} />
          </div>
        ) : (
          <>
            <motion.div
              {...entry(520)}
              className="mt-10 flex max-w-[560px] flex-col gap-6 lg:mt-14"
            >
              <p className="text-v1-heading-xs-loose !text-v1-frost">
                {copy.lede}
              </p>
              <p className="text-v1-body-lg-loose !text-v1-frost/85">
                {HERO_BODY}
              </p>
            </motion.div>

            <motion.div
              {...entry(640)}
              className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <ButtonLink
                href="/sign-up?ref=long-run-hero"
                prefetch={false}
                variant="primary"
                className="!w-full hover:!border-v1-jetBlack hover:!bg-v1-jetBlack hover:!text-v1-frost sm:!w-auto"
              >
                Build something that keeps running →
              </ButtonLink>
              <ButtonLink
                href="/docs?ref=long-run-hero"
                variant="secondary"
                className="!w-full hover:!border-v1-jetBlack hover:!bg-v1-jetBlack hover:!text-v1-frost sm:!w-auto"
              >
                Read the docs
              </ButtonLink>
            </motion.div>
          </>
        )}
      </div>

      {/* Campaign illustration — full-bleed, bleeding past the hero's
          bottom edge so the swoosh runs behind the logo strip below.
          `pointer-events-none` so it never eats a CTA click. */}
      {hasVisual &&
        (narrative?.illustration ? (
          <img
            src={narrative.illustration.src}
            alt={narrative.illustration.alt}
            width={narrative.illustration.width}
            height={narrative.illustration.height}
            aria-hidden={narrative.illustration.alt === "" ? true : undefined}
            className="pointer-events-none relative z-0 -mb-16 block w-full select-none lg:-mb-24"
          />
        ) : (
          // PENDING ASSET: the mouth / tongue-swoosh / running-cup
          // artwork isn't in the repo. Labelled slot so the gap is
          // obvious in review rather than silently missing.
          <div
            role="img"
            aria-label="Campaign illustration — mouth, tongue swoosh and running cup"
            className="pointer-events-none relative z-0 mx-6 mb-8 flex h-[160px] items-center justify-center border border-dashed border-v1-muted px-4 text-center sm:mx-9 lg:mx-8 lg:h-[220px]"
          >
            <span className="text-v1-label-sm uppercase text-v1-frost/40">
              Campaign illustration — mouth, tongue swoosh, running cup
            </span>
          </div>
        ))}

      {/* The marathon route, drawing itself along the bottom of the
          salmon panel. Omitted on the SF hero, whose design carries its
          own illustration instead. */}
      {!hasVisual && (
        <CourseLine
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px] text-v1-frost/45 lg:h-[176px]"
          drawDurationMs={2600}
        />
      )}
    </section>
  );
}

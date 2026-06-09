"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { springs } from "@/utils/v1/springs";
import { useIsDesktop } from "@/utils/v1/hooks/useIsDesktop";
import {
  LOGOMARK_DESIGN_WIDTH,
  LOGOMARK_DESIGN_X,
} from "@/components/v1/sections/shared/logomarkPlacement";

const InngestLogoCanvas = dynamic(
  () => import("@/components/v1/sections/shared/InngestLogoCanvas"),
  { ssr: false },
);

/**
 * Scroll-driven per-character fill from grey to frost, completing
 * roughly at the paragraph's vertical centre. Punchline ("One line
 * of code. Zero extra infra.") slides up via springs.bounce at 95 %.
 */

// Designer-locked line breaks — at lg+ each entry renders as its own
// `block whitespace-nowrap` line so the break points stay exact.
// Below lg the spans collapse to inline flow and wrap naturally so
// narrow viewports don't blow out the rail. Joined with spaces they
// form the full quote.
const LINES = [
  "How you build apps and agents will",
  "change. How they run shouldn't.",
  "Inngest moves durability out of",
  "infrastructure and into your",
  "codebase, so what you build today",
  "still runs tomorrow."
] as const;
const QUOTE = LINES.join(" ");

// Pre-flatten to `{ char, index }` pairs with an absolute index
// across the whole quote, so each span compares to `revealCount`
// during render without imperative tracking. Per-word
// `whitespace-nowrap` wrappers keep words atomic during the reveal.
type RevealChar = { char: string; index: number };
const LINE_WORDS: RevealChar[][][] = (() => {
  let i = 0;
  return LINES.map((line) =>
    line.split(" ").map((word) =>
      word.split("").map((char) => ({ char, index: i++ }))
    )
  );
})();
const TOTAL_CHARS = QUOTE.replace(/ /g, "").length;

export default function Quote() {
  const ref = useRef<HTMLParagraphElement>(null);
  // Drop particle count on mobile so the logomark reads as a faint
  // stipple instead of a solid silhouette.
  const isDesktop = useIsDesktop();
  // One-shot IO-triggered colour reveal: revealCount climbs 0 →
  // TOTAL_CHARS over REVEAL_DURATION_MS via rAF, so the text always
  // finishes flooding white instead of getting stuck mid-fill if the
  // user pauses scrolling.
  const [revealCount, setRevealCount] = useState(0);
  const [punchlineShown, setPunchlineShown] = useState(false);
  // Scroll-coupled exit: non-punchline lines fade out as the user
  // scrolls past so the closing line stays the focal point.
  const [exitProgress, setExitProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // exit goes 0 → 1 over the first 40 % of the paragraph's
      // height scrolling above the viewport top. Past that the
      // non-punchline lines are fully faded out.
      const exitNext = -rect.top / (rect.height * 0.4);
      setExitProgress(Math.max(0, Math.min(1, exitNext)));
      // Safety net: if a fast scroller blows past the section before
      // the 2.2 s timed reveal hits 95 %, force the punchline visible
      // as soon as the paragraph is ~30 % scrolled away.
      if (exitNext > 0.3) setPunchlineShown(true);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealCount(TOTAL_CHARS);
      setPunchlineShown(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;
    // Longer reveal so the user has time to scroll down further
    // before the punchline pops in.
    const REVEAL_DURATION_MS = 2200;
    const PUNCHLINE_TRIGGER_AT = 0.95;

    const startReveal = () => {
      if (started) return;
      started = true;
      const startTime = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / REVEAL_DURATION_MS);
        setRevealCount(Math.ceil(t * TOTAL_CHARS));
        if (t >= PUNCHLINE_TRIGGER_AT) setPunchlineShown(true);
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = 0;
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startReveal();
          io.disconnect();
        }
      },
      // Triggers when the paragraph crosses ~25 % into the viewport
      // — earlier than half-way so the gray-to-white fill kicks in
      // about one scroll-screen sooner.
      { rootMargin: "0px 0px -25% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      aria-label="Why Inngest"
      className="relative isolate overflow-x-clip lg:min-h-[clamp(620px,80vh,860px)]"
    >
      {/* Canvas wrapper extends 120 px above (just enough that the
          chain-logo particles can stream in from the bottom-right of
          the logo bar section above — never higher than the logo
          bar itself) and 35 vh below so the field bleeds into the
          section underneath. aria-hidden + pointer-events-none so
          the canvas doesn't interfere with surrounding content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -bottom-[35vh] opacity-15 lg:-top-[60px] lg:opacity-50"
      >
        <InngestLogoCanvas
          width={LOGOMARK_DESIGN_WIDTH}
          x={LOGOMARK_DESIGN_X}
          originX={0}
          enterRange={1.8}
          exitRange={1.3}
          maxParticles={isDesktop ? undefined : 3000}
        />
      </div>
      <div className="relative z-10 mx-auto flex max-w-[1440px] items-center px-6 py-[39px] lg:min-h-[clamp(620px,80vh,860px)] lg:px-8 lg:py-[clamp(80px,10vh,140px)]">
        {/* Font: 26px floor (mobile) → 56px at xl+, sized so the
            longest locked line fits the 1376-wide rail at 1440. Line
            breaks lock only at lg+. */}
        <p
          ref={ref}
          className="w-full font-v1Heading text-v1-frost leading-[1.2] tracking-[-0.01em]"
          style={{ fontSize: "clamp(1.625rem, 3.9vw, 3.5rem)" }}
          aria-label={QUOTE}
        >
          {LINE_WORDS.map((line, li) => {
            const isPunchline = li === LINE_WORDS.length - 1;
            // Per-character colour reveal removed — the whole quote
            // renders in `text-v1-frost` from the start. Scroll-out
            // (exitProgress) still drives the fade as the user
            // scrolls past, just no fade-IN on scroll-down.
            const renderWord = (chars: RevealChar[], key: number) => (
              <span key={key} className="whitespace-nowrap">
                {chars.map(({ char, index }) => (
                  <span key={index}>{char}</span>
                ))}
              </span>
            );

            // Non-punchline lines fade out via exitProgress as the
            // user scrolls past. Hard line-breaks lock only at lg+;
            // mobile wraps inline so the narrow viewport doesn't blow
            // out the rail.
            if (!isPunchline) {
              return (
                <span
                  key={li}
                  aria-hidden="true"
                  className="lg:block lg:whitespace-nowrap"
                  style={{ opacity: 1 - exitProgress }}
                >
                  {line.map((chars, wi) => (
                    <span key={wi}>
                      {renderWord(chars, wi)}
                      {wi < line.length - 1 || li < LINE_WORDS.length - 1
                        ? " "
                        : ""}
                    </span>
                  ))}
                </span>
              );
            }

            // Punchline ("One line of code. Zero extra infra.") —
            // two phrases, each slides up as a single unit.
            // Phrase 1: "One line of code." (words 0–3)
            // Phrase 2: "Zero extra infra." (words 4–6)
            // Smooth expo-out with a hint of overshoot; phrase 2
            // starts 280 ms after phrase 1 so the punchline lands
            // in two beats. `punchlineShown` is sticky — the
            // animation only plays the first time progress crosses
            // the threshold.
            const slideUp = punchlineShown;
            const SPLIT = 4;
            const phrase1 = line.slice(0, SPLIT);
            const phrase2 = line.slice(SPLIT);
            const renderPhrase = (
              words: RevealChar[][],
              offset: number,
              _delay: number,
            ) => (
              <span className="inline-flex align-baseline">
                {/* Punchline slide-up bounce intentionally disabled
                    — the phrase renders in place as the letters
                    scroll-reveal their colour. */}
                <span className="inline-block">
                  {words.map((chars, i) => (
                    <span key={i + offset}>
                      {renderWord(chars, i + offset)}
                      {i < words.length - 1 ? " " : ""}
                    </span>
                  ))}
                </span>
              </span>
            );
            return (
              <span
                key={li}
                aria-hidden="true"
                className="lg:block lg:whitespace-nowrap"
              >
                {renderPhrase(phrase1, 0, 0)}
                {" "}
                {renderPhrase(phrase2, SPLIT, 280)}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}

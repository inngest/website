"use client";

import { Fragment, useEffect, useState } from "react";

/**
 * Slot-machine scramble reveal. Each character is its OWN inline-grid
 * cell sized to the resolved letter's final width — wider glyphs
 * cycling through (M, W) can't push neighbours sideways, the line
 * around the word stays anchored. Glyph cycling runs at CYCLE_MS;
 * the lock-in walks left → right over `duration`, eased so each
 * letter lingers a beat before the next settles.
 *
 * `running=false` keeps it at opacity 0 with the real text rendered
 * (SSR / a11y stability). Screen readers read `aria-label`; the
 * cycling glyphs are aria-hidden.
 */
const HACKER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface HackerTextProps {
  text: string;
  running: boolean;
  duration?: number;
  delay?: number;
  className?: string;
  showCaret?: boolean;
}

export function HackerText({
  text,
  running,
  duration = 400,
  delay = 0,
  className,
  showCaret = true,
}: HackerTextProps) {
  const [displayed, setDisplayed] = useState(text);
  const [started, setStarted] = useState(false);
  const [typing, setTyping] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!running) {
      setTyping(false);
      return;
    }
    // 35 ms glyph swap = visible slot-machine spin; eased lock-in
    // over `duration` lets each letter land left-to-right with a
    // beat between, instead of resolving in a blur.
    const CYCLE_MS = 35;
    const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
    const randomChar = () =>
      HACKER_CHARS[Math.floor(Math.random() * HACKER_CHARS.length)];

    let raf = 0;
    let startTime = 0;
    let lastCycle = 0;
    let glyphs: string[] = [];

    const startTimer = setTimeout(() => {
      setStarted(true);
      setTyping(true);
      setRevealedCount(0);
      glyphs = Array.from({ length: text.length }, () => randomChar());
      setDisplayed(glyphs.join(""));
      startTime = performance.now();
      lastCycle = startTime;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(1, elapsed / duration);
        const eased = easeInOutSine(rawProgress);
        const revealedCount = Math.floor(eased * text.length);

        if (now - lastCycle >= CYCLE_MS) {
          for (let i = revealedCount; i < text.length; i++) {
            glyphs[i] = randomChar();
          }
          lastCycle = now;
        }

        let next = "";
        for (let i = 0; i < text.length; i++) {
          next += i < revealedCount ? text[i] : glyphs[i];
        }
        setDisplayed(next);
        setRevealedCount(revealedCount);

        if (rawProgress < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setDisplayed(text);
          setRevealedCount(text.length);
          setTyping(false);
          raf = 0;
        }
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [running, text, duration, delay]);

  const caret = (
    <span
      aria-hidden="true"
      className="inline-block align-baseline"
      style={{
        width: "0.55em",
        height: "0.9em",
        marginInline: "0.04em",
        background: "currentColor",
        verticalAlign: "-0.08em",
        animation: "v1SqlCaret 700ms steps(1) infinite",
      }}
    />
  );

  return (
    <span
      aria-label={text}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        opacity: started ? 1 : 0,
        transition: "opacity 180ms ease-out",
      }}
    >
      {Array.from(text).map((finalChar, i) => {
        const currentChar = displayed[i] ?? finalChar;
        return (
          <Fragment key={i}>
            {typing && showCaret && i === revealedCount && caret}
            <span
              aria-hidden="true"
              style={{
                position: "relative",
                display: "inline-block",
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              {/* Sizer: reserves space for the final letter's width.
                  Overlay below positions absolutely so wider scramble
                  glyphs (M, W) can't grow the box. Width is locked
                  to the resolved char regardless of what's spinning. */}
              <span style={{ visibility: "hidden", pointerEvents: "none" }}>
                {finalChar}
              </span>
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "center",
                }}
              >
                {currentChar}
              </span>
            </span>
          </Fragment>
        );
      })}
      {typing && showCaret && revealedCount >= text.length && caret}
    </span>
  );
}

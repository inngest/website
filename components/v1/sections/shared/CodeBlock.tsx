"use client";

/**
 * Shared code-snippet block.
 *
 * Snippets are authored as arrays of (text, kind) tuples; each kind
 * maps to a hex colour via `DEFAULT_TOKEN_COLOR` (overridable
 * per-instance via the `tokenColors` prop). The chrome (border,
 * gradient frame, header dot + label, optional gutter) is owned
 * here; consumers supply only the token arrays.
 *
 * By default the snippet types itself out on mount with a blinking
 * caret. Set `animate={false}` for static rendering. `gutter={false}`
 * hides the line-number column. `prefers-reduced-motion: reduce`
 * also forces the static path.
 */

import { useEffect, useMemo, useState } from "react";
import {
  GRADIENT_DIVIDER_FILL,
  GRADIENT_RING_FILL,
} from "@/utils/v1/gradientRing";

// Reading window.matchMedia synchronously is safe because this file is
// "use client". For SSR the initial value falls back to false; the
// effect below corrects it on mount and subscribes to OS-level toggles.
function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type TokenKind =
  | "kw"
  | "fn"
  | "id"
  | "var"
  | "str"
  | "num"
  | "punc"
  | "cmt";

export type Token = readonly [string, TokenKind];
export type Line = readonly Token[];

/** Shared syntax palette (VSCode-dark). Exported so bespoke code panels
 *  that own their own chrome (e.g. CompareTemporal's side-by-side
 *  comparison) can colour their tokens from the same source instead of
 *  duplicating hexes. */
export const DEFAULT_TOKEN_COLOR: Record<TokenKind, string> = {
  kw: "#c586c0",
  fn: "#dcdcaa",
  id: "#9cdcfe",
  var: "#4fc1ff",
  str: "#ce9178",
  num: "#b5cea8",
  punc: "#d4d4d4",
  cmt: "#6a9955",
};

interface CodeBlockProps {
  /** Filename/title shown in the header bar. Required when `header` is
   *  true (the default); ignored when the header is hidden. */
  label?: string;
  lines: Line[];
  /** Render the header bar (dot + label) and its divider. Default true.
   *  Set false for a chromeless panel (e.g. an article code sample). */
  header?: boolean;
  /** Render the 28px bottom spacer. Default true. Set false to drop the
   *  trailing breathing room when the panel hugs its content. */
  footer?: boolean;
  /** Visual line count after wrap — drives the gutter. Defaults to
   *  `lines.length`; override when long logical lines wrap. */
  visualLineCount?: number;
  /** Show the line-number gutter to the left of the code. Default true. */
  gutter?: boolean;
  /** Type the snippet out char-by-char on mount. When false the
   *  snippet renders statically (no caret, no per-frame state).
   *  Default true. */
  animate?: boolean;
  /** Render the trailing caret. Default true. Set false for static,
   *  non-interactive snippets (e.g. article code samples) where a
   *  blinking caret would read as an unfinished input. */
  caret?: boolean;
  /** Override the font-size used by both gutter and code. */
  fontSize?: string;
  /** Cap the panel's max height. Default 240px (compact card use). */
  maxHeight?: string;
  /** Width cap for the panel. Default 560px. */
  maxWidth?: number | string;
  /** At lg+, drop the height cap and let the panel grow with content
   *  (the AI-card pattern). When false the `maxHeight` cap holds at
   *  every breakpoint and the code area scrolls on overflow. Default
   *  true. */
  lgUncapHeight?: boolean;
  /** Override the syntax-highlight palette. Keyed by token kind;
   *  unspecified kinds fall through to the VSCode-dark defaults. */
  tokenColors?: Partial<Record<TokenKind, string>>;
  className?: string;
}

const CODE_BLOCK_MAX_W = 560;
const DEFAULT_FONT_SIZE = "clamp(10px, 0.9vw, 13px)";
// Typewriter cadence: ~16 ms/char is the comfortable resting speed,
// but every snippet is capped at MAX_DURATION_MS total. Longer
// snippets speed up automatically so the user never waits more than
// 3 seconds for a code step to finish typing; short ones stay at
// the natural cadence.
const NATURAL_INTERVAL_MS = 16;
const MAX_DURATION_MS = 3000;

// Gradient tokens for the panel chrome. The frame ring and header
// divider come from the shared `gradientRing` spec so they stay in
// sync with every other "Gradient Stroke" surface (GradientFrame,
// the team card divider, etc.). The body fill is panel-specific.
const C400 = "var(--color-v1-carbon-400)";
const C500 = "var(--color-v1-carbon-500)";

const FRAME_GRADIENT = GRADIENT_RING_FILL;
const FILL_GRADIENT = `linear-gradient(297deg, rgb(${C400} / 0.59) -2.25%, rgb(${C500}) 46.83%)`;
const HEADER_DIVIDER_GRADIENT = GRADIENT_DIVIDER_FILL;

export default function CodeBlock({
  label,
  lines,
  header = true,
  footer = true,
  visualLineCount,
  gutter = true,
  animate = true,
  caret = true,
  fontSize = DEFAULT_FONT_SIZE,
  maxHeight = "240px",
  maxWidth = CODE_BLOCK_MAX_W,
  lgUncapHeight = true,
  tokenColors,
  className,
}: CodeBlockProps) {
  const gutterCount = visualLineCount ?? lines.length;
  const resolvedTokenColors: Record<TokenKind, string> = tokenColors
    ? { ...DEFAULT_TOKEN_COLOR, ...tokenColors }
    : DEFAULT_TOKEN_COLOR;
  return (
    <div
      className={`flex w-full min-w-0 flex-1 overflow-hidden rounded-md p-[1px]${lgUncapHeight ? " lg:max-h-none" : ""}${className ? ` ${className}` : ""}`}
      style={{
        background: FRAME_GRADIENT,
        maxWidth,
        maxHeight,
      }}
    >
      <div
        className="flex w-full flex-col overflow-hidden rounded-md bg-v1-surfaceBase"
        style={{ backgroundImage: FILL_GRADIENT }}
      >
        {header && (
          <>
            <div className="flex h-[40px] shrink-0 items-center gap-2 px-[18px]">
              <span
                aria-hidden="true"
                className="block size-2 shrink-0 bg-v1-steel"
              />
              <span className="text-v1-label-md min-w-0 flex-1 truncate text-v1-alwaysWhite">
                {label}
              </span>
            </div>
            <div
              aria-hidden="true"
              className="h-px shrink-0"
              style={{ background: HEADER_DIVIDER_GRADIENT }}
            />
          </>
        )}

        <div
          className={`flex min-h-0 w-full flex-1 items-start gap-[10px] overflow-y-auto bg-v1-surfaceBase px-[22px] py-4${lgUncapHeight ? " lg:overflow-visible" : ""}`}
        >
          {gutter && (
            <div
              className="shrink-0 select-none text-right font-v1Mono leading-[1.55] text-v1-frost opacity-20"
              style={{ fontSize }}
            >
              {Array.from({ length: gutterCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          {animate ? (
            <Typewriter
              lines={lines}
              caret={caret}
              fontSize={fontSize}
              tokenColors={resolvedTokenColors}
            />
          ) : (
            <StaticCode
              lines={lines}
              caret={caret}
              fontSize={fontSize}
              tokenColors={resolvedTokenColors}
            />
          )}
        </div>

        {footer && <div aria-hidden="true" className="h-[28px] shrink-0" />}
      </div>
    </div>
  );
}

/**
 * Flat representation of the snippet — one entry per character (with
 * its colour kind) plus explicit "br" markers for line breaks.
 * Pre-computing this lets the render path slice up to a running
 * `visible` count without per-frame string work.
 */
type FlatChar = { char: string; kind: TokenKind } | "br";

function flattenLines(lines: Line[]): FlatChar[] {
  const out: FlatChar[] = [];
  lines.forEach((line, li) => {
    for (const [text, kind] of line) {
      for (const c of text) out.push({ char: c, kind });
    }
    if (li < lines.length - 1) out.push("br");
  });
  return out;
}

// Blinking text caret shared by the static and animated renderers.
function Caret({ blink }: { blink: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="ml-[1px] inline-block bg-v1-frost align-[-2px]"
      style={{
        width: "0.55em",
        height: "1em",
        animation: blink ? "v1UcCaretBlink 1s steps(2) infinite" : undefined,
      }}
    />
  );
}

// Static (non-animated) snippet. Renders the token tuples directly —
// no per-character flattening, no state, no effects — so the full code
// is present in the server HTML and on first paint (important for
// article/SEO content) and costs O(tokens) rather than O(chars).
function StaticCode({
  lines,
  caret = true,
  fontSize = DEFAULT_FONT_SIZE,
  tokenColors = DEFAULT_TOKEN_COLOR,
}: {
  lines: Line[];
  caret?: boolean;
  fontSize?: string;
  tokenColors?: Record<TokenKind, string>;
}) {
  return (
    <pre
      className="min-w-0 flex-1 whitespace-pre-wrap break-words font-v1Mono leading-[1.55] text-v1-frost"
      style={{ fontSize }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {line.length
            ? line.map(([text, kind], ti) => (
                <span key={ti} style={{ color: tokenColors[kind] }}>
                  {text}
                </span>
              ))
            : " "}
          {caret && li === lines.length - 1 ? <Caret blink /> : null}
        </div>
      ))}
    </pre>
  );
}

function Typewriter({
  lines,
  caret = true,
  fontSize = DEFAULT_FONT_SIZE,
  tokenColors = DEFAULT_TOKEN_COLOR,
}: {
  lines: Line[];
  caret?: boolean;
  fontSize?: string;
  tokenColors?: Record<TokenKind, string>;
}) {
  // `flat` is a moderately expensive O(n) scramble of the input
  // tuples; memoise so the per-tick re-render doesn't rebuild it.
  const flat = useMemo(() => flattenLines(lines), [lines]);
  // +1 so the caret has a slot past the last character to blink in.
  const total = flat.length + 1;
  const [visible, setVisible] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(getPrefersReducedMotion);

  // Subscribe to OS-level reduced-motion toggles so users who flip
  // the setting mid-session aren't stuck with the wrong state.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(total);
      return;
    }
    // Pre-type the first half of the snippet so the typewriter only
    // has to fill in the back half.
    const startAt = Math.floor(total / 2);
    setVisible(startAt);
    const remaining = Math.max(1, total - startAt);
    // Auto-tune interval so total typing time never exceeds
    // MAX_DURATION_MS. Short snippets keep the natural 16 ms cadence;
    // long ones get a proportionally faster interval.
    const naturalDuration = remaining * NATURAL_INTERVAL_MS;
    const interval =
      naturalDuration > MAX_DURATION_MS
        ? MAX_DURATION_MS / remaining
        : NATURAL_INTERVAL_MS;
    const id = window.setInterval(() => {
      setVisible((v) => {
        if (v >= total) {
          window.clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, interval);
    return () => window.clearInterval(id);
  }, [total, reduceMotion]);

  // Group consecutive same-kind characters into colored spans so we
  // don't emit a <span> per character (which would balloon the DOM
  // for long snippets without visual benefit). Memoised on
  // (flat, visible) so we don't re-walk the entire array each render
  // when only unrelated state changes.
  const groups = useMemo(() => {
    const out: Array<
      | { kind: "br" }
      | { kind: "text"; tokenKind: TokenKind; text: string }
    > = [];
    for (let i = 0; i < Math.min(visible, flat.length); i++) {
      const c = flat[i];
      if (c === "br") {
        out.push({ kind: "br" });
        continue;
      }
      const last = out[out.length - 1];
      if (last && last.kind === "text" && last.tokenKind === c.kind) {
        last.text += c.char;
      } else {
        out.push({ kind: "text", tokenKind: c.kind, text: c.char });
      }
    }
    return out;
  }, [flat, visible]);

  const lineNodes: React.ReactNode[] = [];
  let buffer: React.ReactNode[] = [];
  let lineIdx = 0;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.kind === "br") {
      lineNodes.push(
        <div key={lineIdx++}>{buffer.length ? buffer : " "}</div>
      );
      buffer = [];
    } else {
      buffer.push(
        <span
          key={`${lineIdx}-${i}`}
          style={{ color: tokenColors[g.tokenKind] }}
        >
          {g.text}
        </span>
      );
    }
  }
  // Trailing line + caret.
  const done = visible >= total;
  if (caret) {
    buffer.push(<Caret key="caret" blink={done} />);
  }
  lineNodes.push(<div key={lineIdx}>{buffer}</div>);

  // Reserve enough vertical space so the panel doesn't visibly grow
  // line-by-line as the typewriter runs — render the final line
  // count up front with invisible filler beyond what's typed.
  while (lineNodes.length < lines.length) {
    lineNodes.push(
      <div key={`pad-${lineNodes.length}`} aria-hidden="true">
        {" "}
      </div>
    );
  }

  return (
    <pre
      className="min-w-0 flex-1 whitespace-pre-wrap break-words font-v1Mono leading-[1.55] text-v1-frost"
      style={{ fontSize }}
    >
      {lineNodes}
    </pre>
  );
}

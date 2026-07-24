"use client";

import { useRef } from "react";
import { useTypewriter } from "@/components/v1/sections/AI/lifecycle/lifecycleFx";

/**
 * Setup tab graphic — language-tag row + `analyzeDoc` createFunction
 * code snippet on top (typewriter on mount, blinking caret at the
 * tail), with the source-of-truth Inngest dashboard screenshot below
 * (committed at /assets/v1/lifecycle/setup.png).
 */

const LANG_TAGS = ["TypeScript", "Python", "Go", "Vercel", "AWS Lambda"];

const FS_TAG = "clamp(9px, 0.9cqw, 11px)";
const FS_CODE = "clamp(12px, 1.3cqw, 16px)";

const CODE = `export const analyzeDoc = inngest.createFunction(
  { id: 'analyze-document' },
  { event: 'doc.uploaded' },
  async ({ event, step }) => { ... }
)`;

export default function SetupGraphic() {
  return (
    <div
      role="img"
      aria-label="Inngest dashboard runs list with a sample function definition above"
      className="relative h-full w-full overflow-hidden bg-gradient-to-r from-[#070707] via-[#0a0a0a]/95 to-transparent"
      style={{ aspectRatio: "1600 / 1293" }}
    >
      {/* Top — language-tag row + typewriter code snippet. */}
      <div className="absolute inset-x-[5%] top-[4%] flex flex-col gap-[2.5%]">
        <div className="flex flex-wrap items-center gap-x-[1.4cqw] gap-y-[0.5cqw]">
          {LANG_TAGS.map((label) => (
            <span
              key={label}
              className="flex items-center gap-1.5 font-v1Mono uppercase text-v1-frost"
              style={{ fontSize: FS_TAG }}
            >
              <span
                aria-hidden="true"
                className="block bg-v1-frost"
                style={{
                  width: "clamp(7px, 0.7cqw, 10px)",
                  height: "clamp(7px, 0.7cqw, 10px)",
                }}
              />
              {label}
            </span>
          ))}
        </div>

        <CodeSnippet />
      </div>

      {/* Bottom — pre-baked dashboard PNG. */}
      <img
        src="/assets/v1/lifecycle/.compressed/setup.avif"
        alt=""
        aria-hidden="true"
        // Match the source's true 3328 × 1980 aspect (1.681:1) so the
        // browser reserves the right space pre-layout — Lighthouse
        // flagged the previous 1600 × 1293 (1.237:1) as an aspect
        // mismatch even though CSS scales to natural size.
        width={3328}
        height={1980}
        className="absolute inset-x-[2%] bottom-[2%] block h-auto w-[96%] select-none"
        style={{ top: "30%" }}
        draggable={false}
      />
    </div>
  );
}

function CodeSnippet() {
  const ref = useRef<HTMLPreElement>(null);
  const { visible, done } = useTypewriter(CODE, 14, ref);
  return (
    <pre
      ref={ref}
      className="font-v1Mono leading-[1.7] text-v1-frost"
      style={{ fontSize: FS_CODE }}
    >
      {done ? <ColorizedCode /> : visible}
      {!done && (
        <span
          aria-hidden="true"
          className="v1-lc-blink ml-0.5 inline-block align-[-2px] bg-v1-frost"
          style={{
            width: "0.55em",
            height: "1em",
            animation: "v1LifecycleBlink 1s steps(2) infinite",
          }}
        />
      )}
    </pre>
  );
}

function ColorizedCode() {
  return (
    <>
      <span className="text-[#C39DF4]">export</span>{" "}
      <span className="text-[#C39DF4]">const</span>{" "}
      <span className="text-[#7FD0FF]">analyzeDoc</span>
      <span className="text-v1-frost/65"> = </span>
      <span className="text-[#7FD0FF]">inngest</span>
      <span className="text-v1-frost/65">.</span>
      <span className="text-[#FFB07A]">createFunction</span>
      <span className="text-v1-frost/65">(</span>
      {"\n  { id: "}
      <span className="text-[#A6E3A1]">{"'analyze-document'"}</span>
      {" },"}
      {"\n  { event: "}
      <span className="text-[#A6E3A1]">{"'doc.uploaded'"}</span>
      {" },"}
      {"\n  "}
      <span className="text-[#C39DF4]">async</span>
      {" ({ event, step }) => { ... }"}
      {"\n)"}
    </>
  );
}

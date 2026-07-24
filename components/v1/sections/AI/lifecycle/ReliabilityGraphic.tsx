"use client";

import { EASE_V1_IN } from "@/utils/v1/easings";

/**
 * Reliability tab graphic — step retry visualization. Step bars fill
 * left → right in sequence on mount; the retry split bar pulses
 * after it lands so the failure / recovery beat reads clearly.
 */


const ROWS: Array<{ kind: "ok" } | { kind: "retry" }> = [
  { kind: "ok" },
  { kind: "ok" },
  { kind: "retry" },
  { kind: "ok" },
];

const BAR_FILL_MS = 700;
const ROW_STAGGER_MS = 220;

export default function ReliabilityGraphic() {
  return (
    <div
      role="img"
      aria-label="Step retry visualization showing only the failed step being retried"
      className="relative h-full w-full overflow-hidden bg-gradient-to-r from-[#070707] via-[#0a0a0a]/95 to-transparent"
      style={{ aspectRatio: "1600 / 1293" }}
    >
      {/* Run header */}
      <div
        className="absolute left-[8%] right-[8%] top-[14%] flex items-center justify-between font-v1Mono text-v1-frost/85"
        style={{ fontSize: "clamp(13px, 1.8cqw, 17px)" }}
      >
        <span>
          analyze-document <span className="text-v1-frost/40">/</span>{" "}
          <span className="text-v1-frost/55">run_01jk9f</span>
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span
            className="block h-[8px] w-[8px] bg-emerald-400"
            style={{
              animation: "v1LifecyclePulse 2.4s ease-in-out infinite",
            }}
          />
          Complete
        </span>
      </div>

      {/* Step rows */}
      <div className="absolute left-[8%] right-[8%] top-[26%] flex flex-col gap-[4.5%]">
        {ROWS.map((row, i) => (
          <div key={i} className="flex flex-col gap-[10px]">
            <div
              className="grid grid-cols-[180px_1fr_60px] items-center gap-[14px] font-v1Mono text-v1-frost/85"
              style={{ fontSize: "clamp(13px, 1.8cqw, 17px)" }}
            >
              <span>chunk-document</span>
              {row.kind === "ok" ? (
                <span
                  className="v1-lc-bar-fill block h-[6px] w-[55%] origin-left bg-emerald-500"
                  style={{
                    animation: `v1LifecycleBarFill ${BAR_FILL_MS}ms ${EASE_V1_IN} ${i * ROW_STAGGER_MS}ms both`,
                  }}
                />
              ) : (
                <span
                  className="relative block h-[6px] w-[55%] origin-left"
                  style={{
                    animation: `v1LifecycleBarFill ${BAR_FILL_MS}ms ${EASE_V1_IN} ${i * ROW_STAGGER_MS}ms both`,
                  }}
                >
                  <span
                    className="absolute inset-y-0 left-0 w-[28%] bg-[#FF5536]"
                    style={{
                      animation: "v1LifecyclePulse 1.8s ease-in-out infinite",
                      animationDelay: `${i * ROW_STAGGER_MS + BAR_FILL_MS}ms`,
                    }}
                  />
                  <span className="absolute inset-y-0 left-[28%] right-0 bg-emerald-500" />
                  <span
                    className="absolute left-[105%] top-1/2 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap text-[#FF5536]"
                    style={{ fontSize: "clamp(12px, 1.55cqw, 15px)" }}
                  >
                    <span className="block h-px w-[24px] border-t border-dashed border-[#FF5536]" />
                    Step retries
                  </span>
                </span>
              )}
              <span className="text-v1-frost/70">141ms</span>
            </div>
            {row.kind === "retry" && (
              <div
                className="v1-lc-fade-up flex flex-col gap-1.5 pl-[28px] font-v1Mono"
                style={{
                  fontSize: "clamp(12px, 1.55cqw, 15px)",
                  animation: `v1LifecycleFadeUp 500ms ease-out ${i * ROW_STAGGER_MS + BAR_FILL_MS}ms both`,
                }}
              >
                <span className="flex items-center gap-2 text-[#FF5536]">
                  <span className="block h-[6px] w-[6px] bg-[#FF5536]" />
                  Attempt 1
                </span>
                <span className="flex items-center gap-2 text-emerald-400">
                  <span className="block h-[6px] w-[6px] bg-emerald-400" />
                  Attempt 2
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

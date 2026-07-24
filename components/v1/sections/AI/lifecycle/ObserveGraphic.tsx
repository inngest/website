"use client";

/**
 * Observe tab graphic — step details view with a highlighted row
 * showing tokens / cost, plus a side panel exposing the prompt,
 * response, token count, cost, and model. Rows fade-up in stagger
 * on mount; the highlighted row pulses to read as "in progress".
 */


const ROWS = [
  { label: "chunk-document", time: "141ms", highlight: false },
  { label: "chunk-document", time: "141ms", highlight: false },
  { label: "chunk-document", time: "2.1s", highlight: true, tokens: "1234 Tokens", cost: "$0.003" },
  { label: "chunk-document", time: "141ms", highlight: false },
  { label: "chunk-document", time: "141ms", highlight: false },
];

const ROW_STAGGER_MS = 130;

export default function ObserveGraphic() {
  return (
    <div
      role="img"
      aria-label="Step details view with prompt, response, token count and cost"
      className="relative h-full w-full overflow-hidden bg-gradient-to-r from-[#070707] via-[#0a0a0a]/95 to-transparent"
      style={{ aspectRatio: "1600 / 1293" }}
    >
      {/* Header */}
      <div
        className="absolute inset-x-[6%] top-[15%] flex items-center justify-between font-v1Mono text-v1-frost/85"
        style={{ fontSize: "clamp(13px, 1.8cqw, 17px)" }}
      >
        <span>
          generate-answer <span className="text-v1-frost/40">/</span>{" "}
          <span className="text-v1-frost/55">step details</span>
        </span>
        <span className="flex items-center gap-1.5 text-[#7CA6FF]">
          <span className="block h-[8px] w-[8px] bg-[#7CA6FF]" /> Replay
        </span>
      </div>

      {/* Step rows + side panel */}
      <div className="absolute inset-x-[6%] top-[28%] grid grid-cols-[1.6fr_1fr] gap-[3%]">
        <div className="flex flex-col gap-[10px]">
          {ROWS.map((r, i) => (
            <div
              key={i}
              className={
                "v1-lc-fade-up grid grid-cols-[16px_180px_60px_1fr] items-center gap-[10px] rounded-[3px] px-2 py-1.5 font-v1Mono " +
                (r.highlight
                  ? "border border-[#7CA6FF]/40 bg-[#7CA6FF]/[0.06] text-v1-frost"
                  : "text-v1-frost/85")
              }
              style={{
                fontSize: "clamp(12px, 1.55cqw, 15px)",
                animation: `v1LifecycleFadeUp 500ms ease-out ${i * ROW_STAGGER_MS}ms both`,
              }}
            >
              <span
                className="block h-[6px] w-[6px] bg-emerald-400"
                style={
                  r.highlight
                    ? {
                        animation: "v1LifecyclePulse 1.6s ease-in-out infinite",
                        animationDelay: `${i * ROW_STAGGER_MS + 500}ms`,
                      }
                    : undefined
                }
              />
              <span>{r.label}</span>
              <span className="text-v1-frost/55">{r.time}</span>
              {r.highlight ? (
                <span className="flex items-center gap-[10px] justify-self-end text-v1-frost/70" style={{ fontSize: "clamp(11px, 1.35cqw, 13px)" }}>
                  <span>{r.tokens}</span>
                  <span>{r.cost}</span>
                </span>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>

        {/* Side panel */}
        <div
          className="flex flex-col gap-[10px] rounded-[4px] border border-v1-frost/[0.12] bg-v1-surfaceElevated/95 p-3 text-v1-frost/85"
          style={{ fontSize: "clamp(11px, 1.35cqw, 13px)" }}
        >
          <div className="flex flex-col gap-1">
            <span className="font-v1Mono uppercase text-v1-frost/55" style={{ fontSize: "clamp(10px, 1.2cqw, 12px)" }}>
              Prompt
            </span>
            <p className="leading-[1.45]">
              You are an expert analyst. Given the following document chunks,
              synthesize a structured answer to the user query.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-v1Mono uppercase text-v1-frost/55" style={{ fontSize: "clamp(10px, 1.2cqw, 12px)" }}>
              Response
            </span>
            <p className="leading-[1.45]">
              Based on the provided context, the three main findings are: (1)
              revenue grew 14% YoY…
            </p>
          </div>
          <div className="mt-auto grid grid-cols-3 gap-1.5 border-t border-v1-frost/10 pt-2 font-v1Mono uppercase text-v1-frost/55" style={{ fontSize: "clamp(10px, 1.2cqw, 12px)" }}>
            <span>
              <div>Tokens</div>
              <div className="text-v1-frost">1234</div>
            </span>
            <span>
              <div>Cost</div>
              <div className="text-v1-frost">$0.003</div>
            </span>
            <span>
              <div>Model</div>
              <div className="text-v1-frost">gpt-4o</div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

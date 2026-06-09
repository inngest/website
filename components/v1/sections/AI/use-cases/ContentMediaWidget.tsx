/**
 * Content & media generation illustration — a stylised "live preview"
 * card built like a real UI: tab bar, article preview body, and a
 * status bar of completion pills. Three assets are marked done; the
 * fourth (OG Image) is still pending and the header's "Rendering..."
 * marker pulses its trailing dots to convey work in flight.
 *
 * The pulse uses the shared `v1-typing-pulse` keyframe from
 * styles/v1.css, which collapses to a no-op under
 * `prefers-reduced-motion: reduce`.
 */

import Image from "next/image";

const LABEL_CLASS = "font-v1Mono text-[9px] uppercase leading-[14px] sm:text-[11px]";
const TYPING_DOT_ANIMATION = "v1-typing-pulse 1.2s ease-in-out infinite";

const TABS: ReadonlyArray<{ label: string; active?: boolean }> = [
  { label: "Preview", active: true },
  { label: "JSON" },
  { label: "Logs" },
];

// Skeleton "paragraphs" use proportional widths so the lines feel
// like ragged-right text without baking in absolute pixel widths.
const PARAGRAPH_LINES: ReadonlyArray<readonly string[]> = [
  ["100%", "86%", "94%"],
  ["100%", "81%", "87%"],
];

const STATUS_PILLS: ReadonlyArray<{
  label: string;
  state: "done" | "pending";
}> = [
  { label: "OG Title", state: "done" },
  { label: "Description", state: "done" },
  { label: "Keywords", state: "done" },
  { label: "OG Image", state: "pending" },
];

export const NATURAL_W = 370;
export const NATURAL_H = 555;

export default function ContentMediaWidget() {
  return (
    <div
      className="flex shrink-0 flex-col border border-v1-frost"
      style={{ width: NATURAL_W, height: NATURAL_H }}
      aria-hidden="true"
    >
      <TabBar />
      <ArticleBody />
      <StatusBar />
    </div>
  );
}

function TabBar() {
  return (
    <div className="flex items-end gap-6 border-b border-v1-frost px-[18px] pb-[15px] pt-[26px]">
      {TABS.map((tab) => (
        <Tab key={tab.label} active={tab.active}>
          {tab.label}
        </Tab>
      ))}
      <span className={`ml-auto ${LABEL_CLASS} text-v1-accent-salmon`}>
        Rendering
        {[0, 180, 360].map((delay) => (
          <span
            key={delay}
            style={{
              animation: TYPING_DOT_ANIMATION,
              animationDelay: `${delay}ms`,
            }}
          >
            .
          </span>
        ))}
      </span>
    </div>
  );
}

function Tab({
  active,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`${LABEL_CLASS} text-v1-frost ${
        active ? "border-b border-v1-accent-green pb-0.5" : ""
      }`}
    >
      {children}
    </span>
  );
}

function ArticleBody() {
  return (
    <div className="flex flex-1 flex-col gap-[15px] px-[18px] py-[26px]">
      {/* Aspect ratio matches the stripes SVG's viewBox
          (311.544 × 171.997) — previously the container was set to
          333/143, which combined with the SVG's
          `preserveAspectRatio="none"` stretched the circles into
          ellipses. The SVG attribute is now stripped (defaults to
          `xMidYMid meet`), so the geometry stays circular. */}
      <div className="relative flex aspect-[311/172] w-full items-center justify-center overflow-hidden border border-v1-frost bg-v1-accent-blue">
        <Image
          src="/assets/v1/use-cases/content-stripes.svg"
          alt=""
          width={311}
          height={172}
          aria-hidden="true"
          className="mx-auto inset-0 h-full w-full"
        />
      </div>
      <h3 className={`max-w-[308px] ${LABEL_CLASS} text-v1-frost`}>
        How We Cut Interference Costs 60% Without Losing Accuracy
      </h3>
      {PARAGRAPH_LINES.map((widths, i) => (
        <SkeletonParagraph key={i} widths={widths} />
      ))}
    </div>
  );
}

function SkeletonParagraph({ widths }: { widths: readonly string[] }) {
  return (
    <div className="flex flex-col gap-[10px]">
      {widths.map((w, i) => (
        <div key={i} className="h-px bg-v1-frost" style={{ width: w }} />
      ))}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-[11px] border-t border-v1-frost px-[18px] py-[21px]">
      {STATUS_PILLS.map((pill) => (
        <StatusPill key={pill.label} state={pill.state}>
          {pill.label}
        </StatusPill>
      ))}
    </div>
  );
}

function StatusPill({
  state,
  children,
}: {
  state: "done" | "pending";
  children: React.ReactNode;
}) {
  const done = state === "done";
  return (
    <div
      className={`flex h-[31px] items-center gap-[5px] border px-2 ${
        done ? "border-v1-accent-green" : "border-v1-frost opacity-40"
      }`}
    >
      <span
        className={`block size-[12px] ${
          done ? "bg-v1-accent-green" : "bg-v1-frost"
        }`}
      />
      <span
        className={`${LABEL_CLASS} ${
          done ? "text-v1-accent-green" : "text-v1-frost"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

import CodeBlock, { type Line } from "@/components/v1/sections/shared/CodeBlock";
import ScheduledCronWidget, { NATURAL_H, NATURAL_W } from "./ScheduledCronWidget";
import ScaledWidget from "@/components/v1/sections/shared/ScaledWidget";

/**
 * Scheduled & cron jobs illustration — pairs a cron-triggered
 * Inngest function (load metrics → summarize → email digest) with a
 * timeline showing recent runs: three completed, one currently
 * running, one still scheduled.
 */

const SCHEDULED_CRON_CODE: Line[] = [
  [
    ["export", "kw"],
    [" ", "punc"],
    ["default", "kw"],
    [" ", "punc"],
    ["inngest", "id"],
    [".", "punc"],
    ["createFunction", "fn"],
    ["(", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["id", "id"],
    [": ", "punc"],
    ['"daily.digest"', "str"],
    [", ", "punc"],
    ["cron", "id"],
    [": ", "punc"],
    ['"0 9 * * *"', "str"],
    [" },", "punc"],
  ],
  [
    ["  ", "punc"],
    ["async", "kw"],
    [" ({ ", "punc"],
    ["step", "id"],
    [" }) => {", "punc"],
  ],
  [
    ["    ", "punc"],
    ["const", "kw"],
    [" ", "punc"],
    ["data", "var"],
    [" = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"fetch"', "str"],
    [", () => ", "punc"],
    ["fetchMetrics", "fn"],
    ["())", "punc"],
  ],
  [
    ["    ", "punc"],
    ["const", "kw"],
    [" ", "punc"],
    ["digest", "var"],
    [" = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"summarize"', "str"],
    [", { ", "punc"],
    ["body", "id"],
    [": ", "punc"],
    ["data", "id"],
    [" })", "punc"],
  ],
  [
    ["    ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"send"', "str"],
    [", () => ", "punc"],
    ["email", "fn"],
    ["(", "punc"],
    ["digest", "id"],
    ["))", "punc"],
  ],
  [["  }", "punc"]],
  [[")", "punc"]],
  [
    ["// fires on schedule — retries and checkpoints built in", "cmt"],
  ],
];

export default function ScheduledCronCard({ label }: { label: string }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center gap-10 lg:flex-row lg:justify-around lg:gap-10">
      <CodeBlock label={label} lines={SCHEDULED_CRON_CODE} />
      <ScaledWidget scale={0.96} natural={{ w: NATURAL_W, h: NATURAL_H }}>
        <ScheduledCronWidget />
      </ScaledWidget>
    </div>
  );
}

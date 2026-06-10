import CodeBlock, { type Line } from "@/components/v1/sections/shared/CodeBlock";
import ContentMediaWidget, { NATURAL_H, NATURAL_W } from "./ContentMediaWidget";
import ScaledWidget from "@/components/v1/sections/shared/ScaledWidget";

/**
 * Content & media generation illustration — pairs a `generate-
 * content` Inngest function (parallel `step.ai.infer` for copy /
 * title / image / seo, followed by `step.run("assemble")`) with a
 * stylised CMS preview where three assets are already generated and
 * the fourth is still rendering. The snippet exceeds the shared
 * code-surface cap (see `CODE_SURFACE_MAX_H` in CodeBlock), so the
 * surface scrolls vertically within the capped frame.
 */

const CONTENT_MEDIA_CODE: Line[] = [
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
    ['"generate-content"', "str"],
    [" },", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["event", "id"],
    [": ", "punc"],
    ['"content/requested"', "str"],
    [" },", "punc"],
  ],
  [
    ["  ", "punc"],
    ["async", "kw"],
    [" ({ ", "punc"],
    ["event", "id"],
    [", ", "punc"],
    ["step", "id"],
    [" }) => {", "punc"],
  ],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["const", "kw"],
    [" [", "punc"],
    ["copy", "var"],
    [", ", "punc"],
    ["title", "var"],
    [", ", "punc"],
    ["image", "var"],
    [", ", "punc"],
    ["seo", "var"],
    ["] = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["Promise", "id"],
    [".", "punc"],
    ["all", "fn"],
    ["([", "punc"],
  ],
  [
    ["      ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["ai", "id"],
    [".", "punc"],
    ["infer", "fn"],
    ["(", "punc"],
    ['"copy"', "str"],
    [", { ... }),", "punc"],
  ],
  [
    ["      ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["ai", "id"],
    [".", "punc"],
    ["infer", "fn"],
    ["(", "punc"],
    ['"title"', "str"],
    [", { ... }),", "punc"],
  ],
  [
    ["      ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["ai", "id"],
    [".", "punc"],
    ["infer", "fn"],
    ["(", "punc"],
    ['"image"', "str"],
    [", { ... }),", "punc"],
  ],
  [
    ["      ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["ai", "id"],
    [".", "punc"],
    ["infer", "fn"],
    ["(", "punc"],
    ['"seo"', "str"],
    [", { ... }),", "punc"],
  ],
  [["    ])", "punc"]],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"assemble"', "str"],
    [", () => ", "punc"],
  ],
  [
    ["      ", "punc"],
    ["publish", "fn"],
    ["({ ", "punc"],
    ["copy", "id"],
    [", ", "punc"],
    ["title", "id"],
    [", ", "punc"],
    ["image", "id"],
    [", ", "punc"],
    ["seo", "id"],
    [" })", "punc"],
  ],
  [["    )", "punc"]],
  [["  }", "punc"]],
  [[")", "punc"]],
  [
    ["// parallel infer — each checkpointed independently", "cmt"],
  ],
];

export default function ContentMediaCard({ label }: { label: string }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center gap-10 lg:flex-row lg:justify-around lg:gap-10">
      <CodeBlock label={label} lines={CONTENT_MEDIA_CODE} />
      <ScaledWidget scale={0.63} natural={{ w: NATURAL_W, h: NATURAL_H }}>
        <ContentMediaWidget />
      </ScaledWidget>
    </div>
  );
}

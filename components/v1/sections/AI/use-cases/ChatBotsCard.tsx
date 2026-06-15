import ChatBotsWidget, { NATURAL_H, NATURAL_W } from "./ChatBotsWidget";
import ScaledWidget from "@/components/v1/sections/shared/ScaledWidget";
import CodeBlock, { type Line } from "@/components/v1/sections/shared/CodeBlock";

/**
 * Chat bots & completion illustration — pairs a chat-reply Inngest
 * function (load history → call the model → persist the reply) with
 * a stylised chat window where the bot is mid-typing the next turn.
 * The snippet exceeds the shared code-surface cap (see
 * `CODE_SURFACE_MAX_H` in CodeBlock), so the surface scrolls
 * vertically within the capped frame.
 */

const CHAT_BOTS_CODE: Line[] = [
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
    ['"chat-reply"', "str"],
    [" },", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["event", "id"],
    [": ", "punc"],
    ['"chat/message.sent"', "str"],
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
    [" ", "punc"],
    ["history", "var"],
    [" = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"load-history"', "str"],
    [", () => ", "punc"],
  ],
  [
    ["      ", "punc"],
    ["getMessages", "fn"],
    ["(", "punc"],
    ["event", "id"],
    [".", "punc"],
    ["data", "id"],
    [".", "punc"],
    ["threadId", "id"],
    [")", "punc"],
  ],
  [["    )", "punc"]],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["const", "kw"],
    [" ", "punc"],
    ["reply", "var"],
    [" = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["ai", "id"],
    [".", "punc"],
    ["infer", "fn"],
    ["(", "punc"],
    ['"reply"', "str"],
    [", {", "punc"],
  ],
  [
    ["      ", "punc"],
    ["model", "id"],
    [": ", "punc"],
    ['"claude-sonnet-4-20250514"', "str"],
    [",", "punc"],
  ],
  [
    ["      ", "punc"],
    ["messages", "id"],
    [": [...", "punc"],
    ["history", "id"],
    [", ", "punc"],
    ["event", "id"],
    [".", "punc"],
    ["data", "id"],
    [".", "punc"],
    ["message", "id"],
    ["]", "punc"],
  ],
  [["    })", "punc"]],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"save"', "str"],
    [", () => ", "punc"],
    ["persist", "fn"],
    ["(", "punc"],
    ["reply", "id"],
    ["))", "punc"],
  ],
  [["  }", "punc"]],
  [[")", "punc"]],
  [
    ["// history → reply checkpointed per turn", "cmt"],
  ],
];

export default function ChatBotsCard({ label }: { label: string }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center gap-10 lg:flex-row lg:justify-around lg:gap-10">
      <CodeBlock label={label} lines={CHAT_BOTS_CODE} />
      <ScaledWidget scale={0.69} natural={{ w: NATURAL_W, h: NATURAL_H }}>
        <ChatBotsWidget />
      </ScaledWidget>
    </div>
  );
}

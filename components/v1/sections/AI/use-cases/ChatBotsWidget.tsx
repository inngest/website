/**
 * Chat-bot illustration — a stylised assistant chat window with two
 * user turns, one bulleted assistant reply, and a typing-indicator
 * bubble showing the next reply is in flight. The three pulsing dots
 * are the only animation; their `v1-typing-pulse` keyframe in
 * styles/v1.css collapses to a no-op under
 * `prefers-reduced-motion: reduce`.
 *
 * Geometry mirrors the design frame (370 × 462).
 */

export const NATURAL_W = 370;
export const NATURAL_H = 462;
const W = NATURAL_W;
const H = NATURAL_H;

// User bubbles (right side) square off their bottom-right corner;
// assistant bubbles (left side) square off their bottom-left.
const USER_BUBBLE_RADII = "10px 10px 0 10px";
const ASSISTANT_BUBBLE_RADII = "10px 10px 10px 0";

// Monospace text style for the header label and message bodies.
const LABEL_CLASS = "font-v1Mono text-[9px] uppercase leading-[14px] sm:text-[11px]";

// Smaller label for the in-flow "Assistant" markers above the reply
// and typing bubbles. `leading-none` keeps the line box at 8px so it
// doesn't bleed into the bubble that sits 3px below it.
const SUBLABEL_CLASS = "font-v1Mono text-[7px] uppercase leading-none sm:text-[8px]";

// Three dots animate via the same keyframe with a 180ms offset so the
// pulse rolls left-to-right. Total cycle is 1.2s, which is slow
// enough to read as "thinking" without feeling frantic. The dots
// themselves are arranged in a slight ascending stair (each 5px
// higher than the previous) to evoke motion even before the
// animation kicks in — coordinates are local to the typing bubble.
const TYPING_DOT_ANIMATION = "v1-typing-pulse 1.2s ease-in-out infinite";
const TYPING_DOTS = [
  { left: 12, top: 18, delay: 0 },
  { left: 24, top: 13, delay: 180 },
  { left: 36, top: 8, delay: 360 },
];

export default function ChatBotsWidget() {
  return (
    <div
      className="flex shrink-0 flex-col border border-v1-frost"
      style={{ width: W, height: H }}
      aria-hidden="true"
    >
      {/* Header — assistant status badge + label, with bottom divider. */}
      <header className="flex h-[31px] shrink-0 items-center gap-[7px] border-b border-v1-frost px-[18px]">
        <span className="block size-[12px] bg-v1-accent-green" />
        <span className={`${LABEL_CLASS} text-v1-frost`}>Assistant</span>
      </header>

      {/* Body — message turns stacked top-down. User bubbles go right
          (self-end), assistant items go left (default items-start).
          Spacing between turns is per-item because the gap pattern is
          irregular (3px → 3px → 14px → 3px → 3px). */}
      <div className="flex flex-1 flex-col items-start px-[18px] pt-[27px]">
        <div
          className="flex h-[43px] w-[182px] items-center self-end border border-v1-frost px-[13px]"
          style={{ borderRadius: USER_BUBBLE_RADII }}
        >
          <span className={`${LABEL_CLASS} text-v1-frost`}>
            Summarize yesterday&rsquo;s meeting notes
          </span>
        </div>

        <span
          className={`mt-[3px] ${SUBLABEL_CLASS} text-v1-accent-green`}
        >
          Assistant
        </span>
        <div
          className={`mt-[3px] h-[152px] w-[236px] border border-v1-accent-green px-[13px] py-[10px] ${LABEL_CLASS} text-v1-accent-green`}
          style={{ borderRadius: ASSISTANT_BUBBLE_RADII }}
        >
          <p>Three decisions were made in yesterday&rsquo;s standup:</p>
          <p>&nbsp;</p>
          <ul className="list-disc pl-[17px]">
            <li>migrate auth to the new provider by Friday</li>
            <li>defer the dashboard redesign to Q3</li>
            <li>bump the API rate limit to 1k/min for enterprise tier</li>
          </ul>
        </div>

        <div
          className="mt-[14px] flex h-[31px] w-[207px] items-center self-end border border-v1-frost px-[11px]"
          style={{ borderRadius: USER_BUBBLE_RADII }}
        >
          <span className={`${LABEL_CLASS} text-v1-frost`}>
            What were the action items?
          </span>
        </div>

        <span
          className={`mt-[3px] ${SUBLABEL_CLASS} text-v1-accent-green`}
        >
          Assistant
        </span>
        <div
          className="relative mt-[3px] h-[31px] w-[53px] border border-v1-accent-green"
          style={{ borderRadius: ASSISTANT_BUBBLE_RADII }}
        >
          {/* Stair-arranged dots — absolute positioning is intentional
              here, since this is a fixed graphical motif, not a layout. */}
          {TYPING_DOTS.map((dot, i) => (
            <span
              key={i}
              className="absolute block size-[6px] bg-v1-accent-green"
              style={{
                left: dot.left,
                top: dot.top,
                animation: TYPING_DOT_ANIMATION,
                animationDelay: `${dot.delay}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer — input field + send button. `justify-between` pins
          them to the inner edges (left 18 / right 19 padding) and lets
          the natural ~12px gap fall between them. */}
      <footer className="flex shrink-0 items-center justify-between border-t border-v1-frost pb-[23px] pl-[18px] pr-[19px] pt-6">
        <div className="flex h-[31px] w-[279px] items-center border border-v1-frost px-3">
          <span className={`${LABEL_CLASS} text-v1-frost`}>
            Type your message here...
          </span>
        </div>
        <div className="flex h-[31px] w-[42px] items-center justify-center border border-v1-frost text-v1-frost">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M 1 0 L 9 5 L 1 10 Z" />
          </svg>
        </div>
      </footer>
    </div>
  );
}

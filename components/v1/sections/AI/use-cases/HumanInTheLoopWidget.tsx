import { cn } from "@/utils/v1/cn";

/**
 * Human-in-the-loop illustration — a stylised approval card mid-flow:
 * the function has produced a draft and is paused on `waitForEvent`,
 * waiting for a human to APPROVE / REJECT / REQUEST CHANGES. The
 * three-step DRAFT → REVIEW → PUBLISH strip shows the current stage,
 * and the header's "Awaiting approval" marker pulses to convey the
 * paused-but-active state.
 *
 * The pulse uses the shared `v1-typing-pulse` keyframe from
 * styles/v1.css, which collapses to a no-op under
 * `prefers-reduced-motion: reduce`.
 */

const LABEL_CLASS = "font-v1Mono text-[9px] uppercase leading-[14px] sm:text-[11px]";
const SUBLABEL_CLASS = "font-v1Mono text-[7px] uppercase leading-none sm:text-[8px]";
// Matches ChatBots + ContentMedia widgets so the three "thinking dots"
// surfaces on the AI page pulse at one cadence.
const TYPING_DOT_ANIMATION = "v1-typing-pulse 1.2s ease-in-out infinite";

type StepState = "done" | "active" | "pending";

const STEPS: ReadonlyArray<{ label: string; state: StepState }> = [
  { label: "Draft", state: "done" },
  { label: "Review", state: "active" },
  { label: "Publish", state: "pending" },
];

// Skeleton "paragraphs" use proportional widths so the lines feel
// like ragged-right text without baking in pixel widths.
const PARAGRAPH_BEFORE_CALLOUT: ReadonlyArray<string> = ["100%", "78%", "92%"];
const PARAGRAPH_AFTER_CALLOUT: ReadonlyArray<string> = ["100%", "82%"];

const STATE_COLOR: Record<StepState, string> = {
  done: "text-v1-accent-green",
  active: "text-v1-accent-blue",
  pending: "text-v1-frost",
};

const INTENT_COLOR = {
  approve: "border-v1-accent-green text-v1-accent-green",
  reject: "border-v1-accent-salmon text-v1-accent-salmon",
  neutral: "border-v1-frost text-v1-frost",
} as const;

export const NATURAL_W = 370;
export const NATURAL_H = 485;

export default function HumanInTheLoopWidget() {
  return (
    <div
      className="flex shrink-0 flex-col border border-v1-frost"
      style={{ width: NATURAL_W, height: NATURAL_H }}
      aria-hidden="true"
    >
      <Header />
      <TabStrip />
      <DraftPreview />
      <ApprovalForm />
    </div>
  );
}

function Header() {
  return (
    <div className="flex h-[31px] shrink-0 items-center gap-[7px] border-b border-v1-frost px-[18px]">
      <span className="block size-[12px] bg-v1-accent-salmon" />
      <span className={cn(LABEL_CLASS, "text-v1-frost")}>
        Publish-with-approval
      </span>
      <span className={cn("ml-auto", LABEL_CLASS, "text-v1-accent-salmon")}>
        Awaiting approval
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

function TabStrip() {
  return (
    <div className="flex shrink-0 items-center gap-[19px] px-[18px] pt-[13px]">
      {STEPS.map((step) => (
        <Step key={step.label} {...step} />
      ))}
    </div>
  );
}

function Step({ label, state }: { label: string; state: StepState }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5",
        SUBLABEL_CLASS,
        STATE_COLOR[state],
        state === "pending" && "opacity-40",
        state === "active" && "border-b border-v1-accent-blue pb-[3px]"
      )}
    >
      {state === "done" && (
        <span className="block size-[6px] bg-v1-accent-green" />
      )}
      {label}
    </span>
  );
}

function DraftPreview() {
  return (
    <div className="mx-[18px] mt-3 flex flex-col gap-[14px] border border-v1-frost px-[14px] py-[18px]">
      <span className={cn(SUBLABEL_CLASS, "text-v1-frost opacity-40")}>
        Generated draft
      </span>
      <h3 className={cn(LABEL_CLASS, "max-w-[286px] text-v1-frost")}>
        Introducing our new API rate limiting — what changes and why
      </h3>
      <SkeletonParagraph widths={PARAGRAPH_BEFORE_CALLOUT} />
      <CalloutPullQuote>
        Enterprise tier bumped to 1,000 req/min from 500
      </CalloutPullQuote>
      <SkeletonParagraph widths={PARAGRAPH_AFTER_CALLOUT} />
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

function CalloutPullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[18px] w-[255px] items-center gap-1.5 border border-v1-accent-green px-[5px]">
      <span className="block size-[6px] shrink-0 bg-v1-accent-green" />
      <span
        className={cn(SUBLABEL_CLASS, "text-v1-accent-green")}
      >
        {children}
      </span>
    </div>
  );
}

function ApprovalForm() {
  return (
    <div className="mt-auto flex shrink-0 flex-col gap-[10px] border-t border-v1-frost px-[18px] pt-[17px] pb-[30px]">
      <span className={cn(SUBLABEL_CLASS, "text-v1-frost opacity-40")}>
        Leave a note (optional)
      </span>
      <div className="flex h-[31px] items-center border border-v1-frost px-3 opacity-40">
        <span className={cn(LABEL_CLASS, "text-v1-frost")}>
          Leave feedback for the team...
        </span>
      </div>
      <div className="mt-1.5 flex gap-[9px]">
        <ActionButton intent="approve">Approve</ActionButton>
        <ActionButton intent="reject">Reject</ActionButton>
      </div>
      <ActionButton intent="neutral" width={194}>
        Request changes
      </ActionButton>
    </div>
  );
}

function ActionButton({
  intent,
  width = 92,
  children,
}: {
  intent: keyof typeof INTENT_COLOR;
  width?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-[31px] items-center justify-center border",
        LABEL_CLASS,
        INTENT_COLOR[intent]
      )}
      style={{ width }}
    >
      {children}
    </div>
  );
}

import {
  AccordionDot,
  AccordionItem,
} from "@/components/v1/sections/shared/Accordion";
import type { Topic } from "@/components/v1/sections/ContactForm/topics";

export default function TopicItem({ topic }: { topic: Topic }) {
  return (
    <AccordionItem
      id={topic.title}
      as="li"
      // Sheen/group/hover come from the styled AccordionItem; py-8
      // overrides its py-5 (tailwind-merge, last wins) for the roomier
      // rows, and the 0.035 hover overrides the base 0.025. No persistent
      // fill on the open row.
      className="list-none rounded-[10px] py-8 pl-[20px] pr-8 hover:bg-v1-frost/[0.035] has-[:focus-visible]:bg-v1-frost/[0.035]"
      triggerClassName="gap-[10px] pr-[44px] outline-none"
      bodyClassName="mt-4 flex flex-col gap-6 pl-[34px] pr-[44px]"
      trigger={(open) => (
        <>
          {/* 8px marker in a 24×22 box, carbon when collapsed /
              flare when open (AccordionDot's steel/salmon defaults). */}
          <AccordionDot open={open} className="w-[24px] [height:22px]" />
          <span className="min-w-0 flex-1 text-v1-heading-sm text-v1-frost">
            {topic.title}
          </span>
        </>
      )}
    >
      <p className="text-[15px] leading-[1.6] text-v1-frost v1-cap-trim">
        {topic.body}
      </p>
      {topic.action ? <TopicAction action={topic.action} /> : null}
    </AccordionItem>
  );
}

function TopicAction({
  action,
}: {
  action: NonNullable<Topic["action"]>;
}) {
  // Collapsed-row links drop out of tab order via the panel's `inert`.
  const external = /^(https?:|mailto:)/.test(action.href);
  return (
    <a
      href={action.href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group/cta inline-flex w-fit items-center font-mono text-[12px] uppercase tracking-[0.08em] text-v1-frost motion-safe:transition-colors motion-safe:duration-300 hover:text-v1-accent-salmon"
    >
      <span>{action.label}</span>
      <span
        aria-hidden="true"
        className="ml-2 inline-block motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover/cta:translate-x-[6px]"
      >
        →
      </span>
    </a>
  );
}

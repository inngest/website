import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import BeforeAfterSlider from "@/components/v1/sections/shared/BeforeAfterSlider";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";

const BEFORE_SRC = "/assets/v1/it-doesnt-have-to-be-hard/before.webp";
const AFTER_SRC = "/assets/v1/it-doesnt-have-to-be-hard/after.webp";

export default function HowItKeepsRunning() {
  return (
    <Section
      id="how-it-works"
      aria-labelledby="codetv-how-heading"
      className="scroll-mt-28"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="codetv-how-heading"
        eyebrow="How it works"
        title="How does Inngest keep your code running?"
        body="Workers? Queues? State Machines? You don't have time for all that. Inngest lets you wrap existing code in steps that dictate how it should behave during any event, at any scale. If your workflow dies, a deploy ships, or you're waiting on a response, your run pauses, resumes, and retries only what didn't finish. Zero extra infra required."
        bodyClassName="max-w-[680px]"
      />

      <div className={V1_HEADER_CONTENT_MT}>
        <BeforeAfterSlider
          ariaLabel="Drag to compare building reliability yourself versus a single Inngest step"
          before={
            <img
              src={BEFORE_SRC}
              alt="Before: the tangle of infrastructure (queues, pubsub, idempotency, error handling, capacity management) you have to build yourself."
              className="absolute inset-0 block h-full w-full object-cover"
              draggable={false}
            />
          }
          after={
            <img
              src={AFTER_SRC}
              alt="After: a single step.run() call replacing all that infrastructure."
              className="absolute inset-0 block h-full w-full object-cover"
              draggable={false}
            />
          }
          beforeOverlay={
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.10) 60%, rgba(0,0,0,0) 100%)",
              }}
            />
          }
          afterOverlay={
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 80% 30%, rgba(255, 240, 230, 0.14), rgba(255, 240, 230, 0) 70%)",
              }}
            />
          }
        />
      </div>
    </Section>
  );
}

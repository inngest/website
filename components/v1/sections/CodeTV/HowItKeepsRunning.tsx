import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import RunDiagram from "@/components/v1/sections/CodeTV/RunDiagram";

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
        title="How does Inngest keep your project running?"
        body="You write a function in your app. Inngest turns each piece of work into a checkpoint. If the process dies, a deploy ships, or you walk away for coffee, the run does not. It sleeps, waits for an event, retries the failed call, and picks up from the last step that actually finished."
        bodyClassName="max-w-[680px]"
      />

      <div className={V1_HEADER_CONTENT_MT}>
        <RunDiagram />
      </div>
    </Section>
  );
}
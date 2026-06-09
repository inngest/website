"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import ButtonLink from "@/components/v1/ButtonLink";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

// "Control agent speed (and cost)." Two-column layout: copy on the
// left (heading / body / CTA), schematic on the right — a 913×542 SVG
// that carries its own gradient panel + stroke. Using the raw SVG keeps
// the diagram pixel-identical to design rather than reconstructing
// dozens of dashed lines + dots in code.

const DIAGRAM_SRC = "/assets/v1/queues-flow-control/agent-flow/diagram.svg";

export default function AgentFlow() {
  return (
    <Section
      aria-labelledby="qfc-agentflow-headline"
      className="relative"
      containerClassName="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-4"
    >
      <Copy />
      {/* Diagram drives its own height via the SVG's intrinsic
            913×542 aspect (width/height on the <img>). The row uses
            items-stretch so the copy column matches that height. */}
      <motion.div {...reveals.body} className="w-full lg:flex-1">
        <img
          src={DIAGRAM_SRC}
          alt="Without flow control, the agent fires hundreds of LLM calls per minute costing $184 in 60 seconds. With Inngest flow control, those calls are throttled through an Inngest gate to 10 per minute, costing $9.20."
          width={913}
          height={542}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="block h-auto w-full select-none"
        />
      </motion.div>
    </Section>
  );
}

function Copy() {
  return (
    <SectionHeader
      className="lg:w-[447px] lg:shrink-0 lg:pr-8"
      id="qfc-agentflow-headline"
      title="Control agent speed (and cost)."
      body="One bad prompt can mean hundreds of LLM calls in seconds. Flow control caps velocity in the infrastructure layer, so you can turn a “$12k surprise” into a problem you have more time to catch and kill."
      actions={
        <ButtonLink
          href="/docs/ai?ref=queues-flow-control"
          variant="primary"
          className="max-sm:w-full"
        >
          See AI Docs
        </ButtonLink>
      }
    />
  );
}

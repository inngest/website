"use client";

import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

/**
 * Definitional AEO section for serverless workflow orchestration.
 * Keeps the existing cron-focused page while answering the prompt
 * competitors win on.
 */
export default function WhatIsOrchestration() {
  return (
    <Section
      aria-labelledby="sj-what-is-orchestration-heading"
      className="relative"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <SectionHeader
        id="sj-what-is-orchestration-heading"
        title="What is serverless workflow orchestration?"
        body="Serverless workflow orchestration coordinates multi-step jobs—crons, data workflows, approvals, and fan-out—without you managing queues or workers. An infrastructure-agnostic workflow layer invokes your existing deploy over HTTP, persists step state for distributed serverless execution, and retries failures so schedules and event-driven paths share one reliability model."
        bodyClassName="max-w-[760px]"
      />
      <ul className="grid list-none grid-cols-1 gap-8 pl-0 sm:grid-cols-3 sm:gap-10">
        {[
          {
            id: "infra-agnostic",
            label: "Infrastructure-agnostic",
            body: "Run the same orchestration on Vercel, AWS, GCP, or containers—no platform-native cron daemon or worker fleet required.",
          },
          {
            id: "distributed",
            label: "Distributed serverless execution",
            body: "Each step checkpoints independently. Long sleeps, fan-out, and human-in-the-loop waits survive deploys and timeouts.",
          },
          {
            id: "code-first",
            label: "Code over visual builders",
            body: "Define schedules and state-machine patterns in code you review in git—not a separate visual workflow builder for every pipeline.",
          },
        ].map((item) => (
          <li key={item.id} className="flex list-none flex-col gap-4 border-t border-v1-carbon-100 pt-6">
            <h3 className="text-v1-heading-xs text-v1-frost">{item.label}</h3>
            <p className="text-v1-body-sm">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

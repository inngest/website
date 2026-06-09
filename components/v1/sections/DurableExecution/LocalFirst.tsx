"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { reveals } from "@/utils/v1/reveals";

export default function LocalFirst() {
  return (
    <Section
      aria-label="Local-first development"
      className="relative"
    >
      {/* Single outer bordered card — heading spans the full width at
          the top, body+CTA / terminal sit in 2 cols below. */}
      <GradientFrame
        variant="charcoal"
        className="rounded-md"
        innerClassName="p-8 sm:p-12 lg:p-16"
      >
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2 lg:items-center lg:gap-x-[72px]">
          <SectionHeader
            className="lg:pr-8"
            title="Local-first development."
            bodyClassName="max-w-[480px]"
            body={
              <>
                One command —{" "}
                <code className="font-mono text-[16px] text-v1-accent-salmon">
                  npx inngest-cli dev
                </code>{" "}
                — and you have a full execution environment running
                locally. No mocking, no stubs, no connecting to a remote
                service to test your workflow. Ship with confidence
                because what you ran locally is what runs in prod.
              </>
            }
            actions={
              <ButtonLink
                href="/docs/local-development?ref=durable-execution"
                variant="primary"
              >
                See AI Docs
              </ButtonLink>
            }
          />

          {/* Right column — terminal sized down inside a black
              GradientFrame. */}
          <motion.div {...reveals.body}>
            <GradientFrame
              variant="black"
              className="rounded-[6px]"
              innerClassName="p-8"
            >
              <Terminal />
            </GradientFrame>
          </motion.div>
        </div>
      </GradientFrame>
    </Section>
  );
}

function Terminal() {
  return (
    <div
      className="relative w-full overflow-hidden bg-[#0a0a0a]"
      style={{ aspectRatio: "16/11", border: "1px solid #ffffff" }}
    >
      {/* Inner "~zsh" tab/header strip */}
      <div className="px-5 py-2" style={{ borderBottom: "1px solid #ffffff" }}>
        <span className="font-mono text-[12px] text-v1-frost/55">~zsh</span>
      </div>
      <pre className="overflow-x-auto whitespace-pre p-5 font-mono text-[12px] leading-[1.65] text-v1-frost/85 sm:text-[13px]">
        <span className="text-v1-frost/85">
          Last login: Fri Apr 24 15:20:51 on ttys04
          {"\n"}
        </span>
        <span className="text-v1-frost/85">
          john@JohnnoMacBook-Pro ~ % cd workspace/demo-inngest
          {"\n"}
        </span>
        <span className="text-v1-frost/85">
          john@JohnnoMacBook-Pro demo-inngest %{" "}
        </span>
        <span className="text-v1-accent-salmon">npx inngest-cli dev</span>
        <span className="ml-1 inline-block h-[14px] w-[8px] -translate-y-[1px] bg-v1-frost align-middle" />
      </pre>
    </div>
  );
}

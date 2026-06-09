"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { reveals } from "@/utils/v1/reveals";
import type { ReactNode } from "react";

const BOX = {
  border: "1px solid #ffffff",
  borderRadius: 0,
} as const;

export default function Frictionless() {
  return (
    <Section
      aria-label="Frictionless setup for humans and agents"
      className="relative"
    >
      {/* Header — eyebrow + headline + body, CTA beside the title. */}
      <SectionHeader
        eyebrow="Why modern teams use Inngest for durable execution"
        title={
          <>
            <span className="block">Frictionless setup —</span>
            <span className="block">for humans and agents.</span>
          </>
        }
        body="Inngest pushes work to your code over HTTP. Deploy to whatever you're already running. Our integration with Stripe's Agent Provisioning Protocol also provides a zero-touch setup option: no key copying, no manual configuration, no billing review."
        bodyClassName="max-w-[760px]"
        titleAside={
          <ButtonLink
            href="/docs/quickstart?ref=durable-execution"
            variant="primary"
          >
            See QuickStart Guides
          </ButtonLink>
        }
      />

      {/* Single outer card wrapping both sides — TERMINAL and STRIPE
          APP share one 1px white border with an internal vertical
          divider between them. */}
      <motion.div
        {...reveals.body}
        className="mt-v1-stack bg-[#0a0a0a]"
        style={BOX}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <PanelColumn
            title="Terminal - Human Setup"
            innerTitle="Terminal — human setup"
            divider="bottom"
          >
            <span className="text-v1-frost/55">$ </span>
            <span>npx inngest-cli@latest dev</span>
            {"\n\n"}
            <span className="text-[#7CE6A0]">✓</span>{" "}
            <span>Agent requests access via APP</span>
            {"\n"}
            <span className="text-[#7CE6A0]">✓</span>{" "}
            <span>Connected to your functions</span>
            {"\n"}
            <span className="text-[#7CE6A0]">✓</span>{" "}
            <span>Traces available at localhost:8288</span>
            {"\n\n"}
            <span className="text-v1-frost/55">
              No cluster. No workers. No config.
            </span>
          </PanelColumn>
          <PanelColumn
            title="Stripe APP - Agent Provisioning"
            innerTitle="Stripe APP — Agent Provisioning"
          >
            <AgentLine
              marker="green"
              label="Agent requests access via APP"
              status="INITIATED"
              timing="0mx"
            />
            {"\n"}
            <AgentLine
              marker="green"
              label="Credentials provisioned automatically"
              status="GRANTED"
              timing="120ms"
            />
            {"\n"}
            <AgentLine
              marker="salmon"
              label="Functions registered, ready to run"
              status="LIVE"
              timing="340ms"
            />
            {"\n\n"}
            <span className="text-v1-frost/55">
              No key copying. No billing review. No manual config.
            </span>
          </PanelColumn>
        </div>
      </motion.div>
    </Section>
  );
}

function PanelColumn({
  title,
  innerTitle,
  divider,
  children,
}: {
  title: string;
  innerTitle: string;
  /** When true, this column sits ABOVE/LEFT-OF the next one and needs
   *  a divider at its bottom (mobile) or right (lg) edge. Last column
   *  omits this. */
  divider?: "bottom";
  children: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col p-6 sm:p-8 ${
        divider
          ? "border-b border-white lg:border-b-0 lg:border-r"
          : ""
      }`}
    >
      <p className="font-v1Label mb-6 text-[15px] font-semibold uppercase tracking-[0.04em] text-v1-frost">
        {title}
      </p>
      <div className="bg-[#0a0a0a]" style={BOX}>
        <div
          className="px-5 py-3"
          style={{ borderBottom: "1px solid #ffffff" }}
        >
          <span className="font-mono text-[12px] text-v1-frost/75">
            {innerTitle}
          </span>
        </div>
        <pre className="overflow-x-auto whitespace-pre px-5 py-5 font-mono text-[12px] leading-[1.7] text-v1-frost/85 sm:text-[13px]">
          {children}
        </pre>
      </div>
    </div>
  );
}

function AgentLine({
  marker,
  label,
  status,
  timing,
}: {
  marker: "green" | "salmon";
  label: string;
  status: string;
  timing: string;
}) {
  const markerColor = marker === "green" ? "#7CE6A0" : "#FB5536";
  return (
    <span className="flex items-baseline gap-2">
      <span
        aria-hidden="true"
        className="inline-block size-[8px] shrink-0 translate-y-[2px]"
        style={{ backgroundColor: markerColor }}
      />
      <span className="flex-1 text-v1-frost">{label}</span>
      <span style={{ color: markerColor }}>
        {status}{" "}
        <span className="text-v1-frost/65">{timing}</span>
      </span>
    </span>
  );
}

"use client";

import { useState } from "react";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Section from "@/components/v1/sections/shared/Section";
import { reveals } from "@/utils/v1/reveals";

/**
 * Pre-FAQ conversion band — one bordered frame split into two cards.
 * Left ("for individuals and teams"): the launch video + Start building
 * free. Right ("for enterprise teams"): migration checklist, enterprise
 * logos, and Talk to us.
 */

const SIGNUP_URL = "/sign-up?ref=compare-to-temporal-cta";
const CONTACT_URL = "/get-in-touch?ref=compare-to-temporal-cta";
const VIDEO_ID = "khBvrr7YOm8";

const ENTERPRISE_POINTS = [
  "Migration from Temporal support",
  "Custom SLAs & uptime guarantees",
  "SOC2, HIPPA BAA, SSO & SAML",
  "Dedicated onboarding & support",
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-v1-frost/30 px-[14px] py-1.5 font-v1Label text-[11px] font-semibold uppercase leading-none tracking-[0.04em] text-v1-frost/70">
      {children}
    </span>
  );
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-[1px] shrink-0">
    <path
      d="M5 12.5 L 10 17 L 19 7"
      stroke="rgb(var(--color-v1-green-200))"
      strokeWidth="1.75"
      fill="none"
      strokeLinecap="square"
    />
  </svg>
);

function VideoEmbed() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[10px] border border-v1-frost/10 bg-v1-jetBlack">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
          title="Inngest — Wear the workflow"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Play video"
          className="group absolute inset-0 cursor-pointer"
        >
          {/* YouTube poster — plain <img> so we don't need a next/image
              remote-domain allowlist entry. */}
          <img
            src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-[64px] items-center justify-center rounded-full bg-v1-frost/25 backdrop-blur-sm motion-safe:transition-transform group-hover:scale-105">
              <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden="true">
                <path d="M0 0 L22 13 L0 26 Z" fill="rgb(var(--color-v1-frost))" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export default function CtaBand() {
  return (
    <Section aria-label="Get started" className="relative">
      <div className="overflow-hidden rounded-[6px] border-2 border-white">
        <div className="grid grid-cols-1 divide-y-2 divide-white lg:grid-cols-2 lg:divide-x-2 lg:divide-y-0">
          {/* Left — individuals & teams */}
          <motion.div
            {...reveals.item(0)}
            className="flex flex-col gap-6 p-[28px] sm:p-10"
          >
            <Pill>For individuals and teams</Pill>
            <div className="flex flex-col gap-3">
              <h3 className="font-v1Heading text-[28px] leading-[1.15] tracking-[-0.01em] text-v1-frost lg:text-[32px]">
                Start building in minutes
              </h3>
              <p className="text-v1-body-md leading-[1.5] text-v1-frost/70">
                Connect to your existing codebase. No credit card, no workers,
                no infrastructure to provision.
              </p>
            </div>
            <VideoEmbed />
            <div className="mt-auto flex flex-col items-center gap-[14px] pt-3">
              <ButtonLink href={SIGNUP_URL} variant="accent" className="!w-full sm:!w-auto">
                Start building free
              </ButtonLink>
              <p className="text-v1-body-sm text-v1-frost/50">
                No credit card • Instant access • Free Tier
              </p>
            </div>
          </motion.div>

          {/* Right — enterprise teams */}
          <motion.div
            {...reveals.item(1)}
            className="flex flex-col gap-6 p-[28px] sm:p-10"
          >
            <Pill>For enterprise teams</Pill>
            <div className="flex flex-col gap-3">
              <h3 className="font-v1Heading text-[28px] leading-[1.15] tracking-[-0.01em] text-v1-frost lg:text-[32px]">
                Talk to our team
              </h3>
              <p className="text-v1-body-md leading-[1.5] text-v1-frost/70">
                Migration support, custom SLAs, SS, HIPPA BAA, and a solution
                scoped to your architecture.
              </p>
            </div>

            <ul className="flex flex-col gap-[14px]">
              {ENTERPRISE_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-v1-body-md leading-[1.5] text-v1-frost"
                >
                  <CheckIcon />
                  {point}
                </li>
              ))}
            </ul>

            {/* Enterprise logos */}
            <div className="flex flex-col items-center gap-6 rounded-[12px] bg-v1-jetBlack px-6 py-[28px]">
              <span className="text-v1-body-sm text-v1-frost">
                Enterprise companies that use Inngest:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-[28px] gap-y-4">
                <img
                  src="/assets/v1/logos/elevenlabs.svg"
                  alt="ElevenLabs"
                  className="h-[16px] w-auto"
                />
                <img
                  src="/assets/v1/logos/clay.svg"
                  alt="Clay"
                  className="h-[30px] w-auto"
                />
                <img
                  src="/assets/v1/logos/cohere.svg"
                  alt="Cohere"
                  className="h-[18px] w-auto"
                />
              </div>
            </div>

            <div className="mt-auto flex flex-col items-center gap-[14px] pt-3">
              <ButtonLink href={CONTACT_URL} variant="accent" className="!w-full sm:!w-auto">
                Talk to us
              </ButtonLink>
              <p className="text-v1-body-sm text-v1-frost/50">
                Usually responds within 1 business day
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

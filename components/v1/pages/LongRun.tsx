"use client";

import PageShell from "@/components/v1/PageShell";
import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";
import NotFoundBackground from "@/components/v1/sections/shared/NotFoundBackground";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import { Unreleased } from "@/shared/Docs/Unreleased";

import Hero from "@/components/v1/sections/LongRun/Hero";
import Connection from "@/components/v1/sections/LongRun/Connection";
import Problem from "@/components/v1/sections/LongRun/Problem";
import ProductTruth from "@/components/v1/sections/LongRun/ProductTruth";
import SeeItRun from "@/components/v1/sections/LongRun/SeeItRun";
import Proof from "@/components/v1/sections/LongRun/Proof";
import CampaignMoment from "@/components/v1/sections/LongRun/CampaignMoment";
import CampaignFooter from "@/components/v1/sections/LongRun/CampaignFooter";
import WhatItIs from "@/components/v1/sections/LongRun/WhatItIs";
import Course from "@/components/v1/sections/LongRun/Course";
import { TRY, type Market } from "@/components/v1/sections/LongRun/data";

/**
 * "Build for the long run" — the campaign landing page behind the NYC and SF
 * OOH/DOOH placements (step.run/nyc, step.run/sf, step.run/build all point
 * here).
 *
 * NYC runs the narrative cut: the product story leads (connection →
 * problem → product truth → the run visual that proves it → proof) and the
 * marathon returns as payoff, so the campaign metaphor never delays the
 * explanation. Then the ask, then a quiet campaign sign-off.
 *
 * The city-agnostic cut stays short — someone scanned a QR code off a
 * poster and is reading standing up, so it is the line that rewards the
 * scan, what Inngest does (in code, because the audience is technical),
 * the course, and one CTA. The campaign deck's internal material (the
 * three pillars, the marathon-metaphor rationale, the activation plan) is
 * deliberately not on either cut.
 *
 * Gated behind `?unreleased=long-run` until the campaign goes live: the body
 * is a client island that renders nothing on the server, so the page is
 * shareable internally without leaking the creative to crawlers. Shipping is
 * a one-line delete — drop the `<Unreleased>` wrapper (and the `noindex` +
 * sitemap exclusion that go with it).
 */
export default function LongRun({ market = "all" }: { market?: Market }) {
  // NYC leads with the product story and lands the marathon as payoff.
  // The city-agnostic cut stays on the short four-section page.
  const isNarrative = market === "nyc";

  return (
    <PageShell>
      <Unreleased label="long-run" fallback={<GateFallback />}>
        <div className="overflow-x-clip">
          <Hero market={market} />
          {isNarrative ? (
            <>
              <Connection />
              <Problem />
              <ProductTruth />
              <SeeItRun />
              <Proof />
              <CampaignMoment market={market} />
            </>
          ) : (
            <>
              <WhatItIs />
              <Course />
              <LogoMarquee />
            </>
          )}
          {/* The ask. Both cuts close on the site's standard stipple CTA;
              the narrative cut carries the campaign's own wording, which
              names the thing the run visual just showed. */}
          {isNarrative ? (
            <StippleCtaSection
              headingId="long-run-cta-heading"
              heading={
                <>
                  {TRY.title[0]}
                  <br />
                  {TRY.title[1]}
                </>
              }
              body={
                <>
                  {TRY.body[0]}
                  <span className="mt-4 block">{TRY.body[1]}</span>
                </>
              }
              bodyClassName="max-w-[560px]"
              footnote={TRY.footnote}
            >
              <ButtonLink
                href={TRY.primary.href}
                prefetch={false}
                variant="primary"
              >
                {TRY.primary.label} →
              </ButtonLink>
              <ButtonLink href={TRY.secondary.href} variant="secondary">
                {TRY.secondary.label} →
              </ButtonLink>
            </StippleCtaSection>
          ) : (
            <StippleCtaSection
              headingId="long-run-cta-heading"
              heading={
                <>
                  Build something
                  <br />
                  that keeps running.
                </>
              }
              body="Start on the free tier, in the codebase you already have. Retries, flow control, and step-level traces come with it."
              bodyClassName="max-w-[520px]"
              footnote="No credit card required · Free tier forever"
            >
              <ButtonLink
                href="/sign-up?ref=long-run-footer"
                prefetch={false}
                variant="primary"
              >
                Start building free
              </ButtonLink>
              <ButtonLink
                href="/contact?ref=long-run-footer"
                variant="secondary"
              >
                Talk to us
              </ButtonLink>
            </StippleCtaSection>
          )}
          {isNarrative && <CampaignFooter market={market} />}
        </div>
      </Unreleased>
    </PageShell>
  );
}

/**
 * What the page shows without the preview label — the same "not found"
 * treatment a gated docs page gets, so the URL doesn't advertise that
 * there's something behind it.
 */
function GateFallback() {
  return (
    <section
      aria-label="Page not found"
      className="relative isolate flex min-h-[70vh] items-center justify-center overflow-x-clip"
    >
      <NotFoundBackground />
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <p className="font-v1Mono text-[13px] uppercase tracking-[0.12em] text-v1-accent-salmon">
          404
        </p>
        <h1
          className="font-v1Heading leading-[1.1] tracking-[-0.02em] text-v1-frost"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Page not found.
        </h1>
        <ButtonLink href="/" variant="primary">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}

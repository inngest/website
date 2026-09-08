"use client";

import PageShell from "@/components/v1/PageShell";
import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";
import NotFoundBackground from "@/components/v1/sections/shared/NotFoundBackground";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import { Unreleased } from "@/shared/Docs/Unreleased";

import Hero from "@/components/v1/sections/LongRun/Hero";
import Durations from "@/components/v1/sections/LongRun/Durations";
import Course from "@/components/v1/sections/LongRun/Course";
import PosterQuote from "@/components/v1/sections/LongRun/PosterQuote";
import Pillars from "@/components/v1/sections/LongRun/Pillars";
import Metaphor from "@/components/v1/sections/LongRun/Metaphor";
import Cities from "@/components/v1/sections/LongRun/Cities";
import type { Market } from "@/components/v1/sections/LongRun/data";

/**
 * "Build for the long run" — the campaign landing page behind the NYC and SF
 * OOH/DOOH placements (step.run/nyc, step.run/sf, step.run/build all point
 * here).
 *
 * Gated behind `?unreleased=long-run` until the campaign goes live: the body
 * is a client island that renders nothing on the server, so the page is
 * shareable internally without leaking the creative to crawlers. Shipping is
 * a one-line delete — drop the `<Unreleased>` wrapper (and the `noindex` +
 * sitemap exclusion that go with it).
 */
export default function LongRun({ market = "all" }: { market?: Market }) {
  return (
    <PageShell>
      <Unreleased label="long-run" fallback={<GateFallback />}>
        <div className="overflow-x-clip">
          <Hero market={market} />
          <Durations />
          <Course />
          <PosterQuote />
          <Pillars />
          <LogoMarquee />
          <Metaphor />
          <Cities market={market} />
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
            <ButtonLink href="/contact?ref=long-run-footer" variant="secondary">
              Talk to us
            </ButtonLink>
          </StippleCtaSection>
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

import { type Metadata } from "next";

import Container from "src/shared/layout/Container";
import ContentDownloadForm from "src/components/ContentDownloadForm";
import { CONTENT_ASSETS } from "src/shared/contentAssets";
import { RiBookOpenLine, RiCheckboxCircleLine } from "@remixicon/react";
import { generateMetadata } from "src/utils/social";

// /content-test is the QA route for the AI in Production 2026 report. The
// shipping landing page is `/content/ai-in-production-report-2026` (rendered
// by the dynamic `app/content/[asset]/page.tsx` route, or — once design
// delivers a bespoke layout — by a static page at
// `app/content/ai-in-production-report-2026/page.tsx`).
//
// This page stays in place for local form testing. It reads its asset
// metadata from the same `CONTENT_ASSETS` lookup as the shipping route, and
// renders the same `<ContentDownloadForm />`, so behavior is guaranteed
// identical between the two surfaces.
const ASSET_SLUG = "ai-in-production-report-2026";
const ASSET = CONTENT_ASSETS[ASSET_SLUG];

export const metadata: Metadata = generateMetadata({
  title: `Download — ${ASSET.title}`,
  description: ASSET.description,
});

export default function Page() {
  return (
    <div className="font-sans text-basis">
      <Container>
        <main className="m-auto max-w-5xl pb-8 pt-4 sm:pt-16">
          <header className="m-auto max-w-4xl pt-12 text-center lg:pt-24">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-subtle bg-white/5 px-3 py-1 text-sm text-subtle">
              <RiBookOpenLine className="h-4 w-4" />
              {ASSET.eyebrow ?? "Free download · PDF"}
            </p>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white md:mb-6 md:text-4xl lg:leading-loose xl:text-5xl">
              {ASSET.title}
            </h1>
            <p className="text-balance">{ASSET.description}</p>
          </header>

          <div className="my-12 grid gap-24 lg:grid-cols-2">
            <div>
              <ContentDownloadForm
                asset={ASSET.slug}
                button={ASSET.buttonCopy}
                redirectTo={ASSET.redirectTo}
                successMessage="Check your email — the report is on its way. If you don't see it in a few minutes, check your spam folder."
              />
            </div>

            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 text-xl font-semibold text-white">
                What's inside
              </h2>
              <ul className="flex flex-col gap-3 text-basis">
                <li className="flex items-start gap-2">
                  <RiCheckboxCircleLine className="mt-1 h-5 w-5 flex-shrink-0 text-link" />
                  <span>
                    Survey methodology — 130 backend, full-stack, and AI
                    engineers running real production AI workloads.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <RiCheckboxCircleLine className="mt-1 h-5 w-5 flex-shrink-0 text-link" />
                  <span>
                    The failures actually breaking AI in production — what
                    teams are hitting most often and what it's costing them.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <RiCheckboxCircleLine className="mt-1 h-5 w-5 flex-shrink-0 text-link" />
                  <span>
                    Infrastructure choices that reduce reliability burden —
                    orchestration, observability, evals, and agent frameworks
                    benchmarked against scaling confidence.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <RiCheckboxCircleLine className="mt-1 h-5 w-5 flex-shrink-0 text-link" />
                  <span>
                    The patterns that predict whether a team will scale their
                    AI workflows — or stall out.
                  </span>
                </li>
              </ul>

              <div className="my-8 flex flex-row items-center gap-4 text-lg text-subtle">
                <img
                  src="/assets/compliance/soc2.webp"
                  alt="SOC 2"
                  className="h-12 w-12"
                />
                <p className="text-sm">
                  Inngest is SOC 2 Type II compliant. We'll only email you about
                  this download and our occasional engineering newsletter — no
                  spam.
                </p>
              </div>

              <p className="mb-6 mt-12 text-lg font-semibold text-subtle">
                Trusted by
              </p>
              <div className="flex flex-row flex-wrap gap-8">
                <img
                  className="h-8"
                  src="/assets/customers/soundcloud-logo-white-horizontal.svg"
                  alt="SoundCloud"
                />
                <img
                  className="h-7"
                  src="/assets/customers/tripadvisor.svg"
                  alt="TripAdvisor"
                />
                <img
                  className="h-7"
                  src="/assets/customers/resend.svg"
                  alt="Resend"
                />
              </div>
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
}

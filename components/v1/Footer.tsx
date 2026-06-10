import { Fragment } from "react";
import Image from "next/image";
import Link from "@/components/v1/Link";
import FooterDotSphere from "@/components/v1/FooterDotSphereLazy";
import { WipeLabel } from "@/components/v1/sections/shared/WipeLabel";
import { appendRef } from "@/utils/v1/ref";

interface FooterLink {
  label: string;
  href: string;
  /** Disable Next.js Link prefetch — set true for routes that don't
   *  exist yet (planned IA) or that redirect off-domain. Without
   *  this, hover-prefetch logs 404 / CORS errors in DevTools. */
  noPrefetch?: boolean;
}

interface FooterColumnDef {
  heading: string;
  links: FooterLink[];
}

const COLUMN_PLATFORM: FooterColumnDef = {
  heading: "Platform",
  links: [
    { label: "Durable Execution", href: "/platform/durable-execution" },
    {
      label: "Queues & Flow Control",
      href: "/platform/flow-control",
      noPrefetch: true,
    },
    {
      label: "Observability",
      href: "/platform/observability",
      noPrefetch: true,
    },
  ],
};

const COLUMN_USE_CASES: FooterColumnDef = {
  heading: "Use cases",
  links: [
    { label: "AI Workflows", href: "/ai" },
    { label: "Webhooks & Events", href: "/uses/webhooks" },
    { label: "Background Jobs", href: "/uses/serverless-node-background-jobs" },
    { label: "Crons & Scheduled Jobs", href: "/uses/scheduled-jobs" },
  ],
};

const COLUMN_RESOURCES: FooterColumnDef = {
  heading: "Resources",
  links: [
    { label: "Blog", href: "/blog", noPrefetch: true },
    { label: "Docs", href: "/docs" },
    {
      label: "Inngest vs. Traditional Queues",
      href: "/platform/flow-control",
    },
    { label: "Inngest vs. Temporal", href: "/compare-to-temporal" },
  ],
};

const COLUMN_COMPANY: FooterColumnDef = {
  heading: "Company",
  links: [
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/get-in-touch" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Support", href: "https://support.inngest.com" },
    { label: "Careers", href: "https://jobs.ashbyhq.com/inngest" },
  ],
};

const COLUMN_COMMUNITY: FooterColumnDef = {
  heading: "Community",
  links: [
    { label: "X", href: "https://x.com/inngest" },
    { label: "Github", href: "https://github.com/inngest/inngest" },
    { label: "Discord", href: "https://www.inngest.com/discord" },
    { label: "Bluesky", href: "https://bsky.app/profile/inngest.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/inngest-inc/" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 36%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 36%, black 100%)",
        }}
      >
        <FooterDotSphere />
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 pb-8 pt-10 lg:px-8 lg:pt-20">
        {/* Status badge — desktop only; mobile users get the StatusBadge
            in the floating status pill near the page edge. */}
        <div className="hidden flex-wrap items-center justify-start gap-4 lg:flex">
          <StatusBadge variant="inline" />
        </div>

        <div className="grid grid-cols-2 items-start gap-x-[42px] gap-y-[34px] md:grid-cols-3 md:gap-x-12 md:gap-y-12 lg:gap-x-40">
          <FooterCol {...COLUMN_PLATFORM} />
          <FooterCol {...COLUMN_USE_CASES} />
          <FooterCol {...COLUMN_RESOURCES} />
          <FooterCol {...COLUMN_COMPANY} />
          <FooterCol {...COLUMN_COMMUNITY} />
          <SocComplianceBadge />
        </div>

        {/* Mobile: status badge below the link grid. */}
        <div className="lg:hidden">
          <StatusBadge variant="full" />
        </div>

        {/* Mobile: centered legal + copyright stack. */}
        <div className="flex flex-col items-center gap-4 lg:hidden">
          <LegalLinks />
          <p className="text-v1-caption text-center text-v1-frost">
            ©{new Date().getFullYear()} Inngest Inc. All rights reserved.
          </p>
        </div>

        {/* Desktop: copyright left, legal links right. */}
        <div className="hidden flex-wrap items-center justify-between gap-4 lg:flex">
          <p className="text-v1-caption text-v1-frost">
            ©{new Date().getFullYear()} Inngest Inc. All rights reserved.
          </p>
          <LegalLinks />
        </div>
      </div>
    </footer>
  );
}

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Security", href: "/security" },
];

// Inline legal links, shown in both the mobile and desktop footer rows.
function LegalLinks() {
  return (
    <ul className="text-v1-caption flex items-center gap-1 text-v1-frost">
      {LEGAL_LINKS.map((link, i) => (
        <Fragment key={link.href}>
          {i > 0 && <li aria-hidden="true">|</li>}
          <li>
            <Link
              href={appendRef(link.href, "footer")}
              className="underline underline-offset-2"
            >
              <WipeLabel>{link.label}</WipeLabel>
            </Link>
          </li>
        </Fragment>
      ))}
    </ul>
  );
}

function FooterCol({ heading, links }: FooterColumnDef) {
  return (
    <div>
      <h2 className="mb-5 font-v1Heading text-[26px] leading-[1.2] tracking-[-0.01em] text-v1-frost lg:mb-8">
        {heading}
      </h2>
      <ul className="flex flex-col gap-0 lg:gap-4">
        {links.map((link) => {
          // Internal links carry the `?ref=footer` attribution tag; social
          // and other off-domain links (http) are left untouched.
          const external = link.href.startsWith("http");
          return (
            <li key={link.label}>
              {/* `WipeLabel` (React element child) bypasses Link's
                  auto-wrap-in-BleedLabel — footer links use the same
                  left-to-right salmon wipe as the header nav, not
                  the radial bleed effect. */}
              <Link
                href={external ? link.href : appendRef(link.href, "footer")}
                prefetch={link.noPrefetch ? false : undefined}
                className="text-v1-caption text-v1-frost lg:text-v1-body-sm"
              >
                <WipeLabel>{link.label}</WipeLabel>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatusBadge({ variant }: { variant: "inline" | "full" }) {
  const wrapperClass =
    variant === "full"
      ? "flex w-full items-center justify-center gap-[10px] rounded-md bg-v1-surfaceElevated px-5 py-4"
      : "flex items-center gap-[10px] rounded-md bg-v1-surfaceElevated px-5 py-4";
  return (
    <a
      href="https://status.inngest.com"
      target="_blank"
      rel="noreferrer"
      className={wrapperClass}
    >
      <span aria-hidden="true" className="size-2 bg-v1-accent-green" />
      <span className="text-v1-body-sm text-v1-frost">All systems operational</span>
    </a>
  );
}

function SocComplianceBadge() {
  return (
    <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
      <Image
        src="/assets/v1/aicpa-soc2.png"
        alt="AICPA SOC 2 Type II compliance badge"
        width={86}
        height={86}
        className="shrink-0"
      />
      <p className="text-v1-caption text-v1-frost">
        Inngest is SOC 2 Type II compliant.
      </p>
    </div>
  );
}

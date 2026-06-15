import { type ReactNode } from "react";
import {
  RiBarChart2Line,
  RiBillLine,
  RiMailOpenLine,
  RiUserLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import PageShell from "@/components/v1/PageShell";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";

// Privacy Policy — an 800px content column centred on the page: title, a
// list of data-processing services, contact info, and the iubenda footer
// note. Section rhythm is the content column's 44px gap; lines are #7A7A7A
// hairlines.

interface Service {
  icon: RemixiconComponentType;
  /** Service category (Heading/Xs, beside the icon). */
  name: string;
  /** The named tool/provider. */
  provider: string;
  /** "Personal Data: …" detail line. */
  data: string;
}

// The lower four services reuse the bill-line icon.
const SERVICES: Service[] = [
  {
    icon: RiBarChart2Line,
    name: "Analytics",
    provider: "Google Analytics 4",
    data: "Personal Data: browser information",
  },
  {
    icon: RiMailOpenLine,
    name: "Contacting the User",
    provider: "Contact form",
    data: "Personal Data: email address",
  },
  {
    icon: RiBillLine,
    name: "Tag Management",
    provider: "Google Tag Manager",
    data: "Personal Data: email address",
  },
  {
    icon: RiBillLine,
    name: "Handling payments",
    provider: "Stripe",
    data: "Personal Data: billing address; email address; first name; last name; payment info; purchase history; various types of Data as specified in the privacy policy of the service",
  },
  {
    icon: RiBillLine,
    name: "Registration and authentication provided directly by this Application",
    provider: "Direct Registration",
    data: "Personal Data: email address; password; workplace",
  },
  {
    icon: RiBillLine,
    name: "Hosting and backend infrastructure",
    provider: "Amazon Web Services (AWS)",
    data: "Personal Data: various types of Data as specified in the privacy policy of the service",
  },
];

function Divider() {
  return <hr className="h-px w-full border-0 bg-v1-steel" />;
}

// Icon + heading row (Heading/Xs). The cap-trimmed heading collapses to
// the glyph height so the row hugs the 24px icon.
function IconRow({
  icon: Icon,
  gap,
  children,
}: {
  icon: RemixiconComponentType;
  gap: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex items-center ${gap}`}>
      <Icon aria-hidden className="h-6 w-6 shrink-0 text-v1-frost" />
      <h3 className="text-v1-heading-xs text-white">{children}</h3>
    </div>
  );
}

function FootnoteLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline underline-offset-2 motion-safe:transition-colors hover:text-v1-frost/70"
    >
      {children}
    </a>
  );
}

export default function Privacy() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        {/* 800px reading column: 44px section gap. max-w 864 + lg:px-8
            lands the content at exactly 800 on desktop while keeping the
            v1 px-6/sm:px-9/lg:px-8 gutter idiom. Top padding clears the
            fixed header (~76px desktop) and scales down on mobile; bottom
            is a flat 80px before the closing lockup. */}
        <section className="mx-auto flex w-full max-w-[864px] flex-col gap-11 px-6 pb-20 pt-24 text-v1-frost sm:px-9 sm:pt-[120px] lg:px-8 lg:pt-[156px]">
          {/* Title block — gap 20. */}
          <header className="flex flex-col gap-5">
            <h1 className="font-v1Display uppercase leading-[1.25] tracking-[-0.01em] text-white [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [font-size:clamp(2.5rem,5.4vw,4rem)]">
              Privacy Policy
            </h1>
            <p className="text-v1-body-xs text-white">
              This Application collects some Personal Data from it&rsquo;s Users
            </p>
          </header>

          <Divider />

          {/* Services — gap 24. */}
          <div className="flex flex-col gap-6">
            <h2 className="text-v1-heading-sm text-white">
              Personal Data processed for the following purposes and using the
              following services:
            </h2>
            <ul className="flex flex-col gap-6">
              {SERVICES.map((s) => (
                <li key={s.name} className="flex flex-col gap-4">
                  <IconRow icon={s.icon} gap="gap-3">
                    {s.name}
                  </IconRow>
                  {/* Detail block — pl 36 (icon 24 + gap 12), gap 16. The
                      token (cap-trim) sits on each <p>, not the flex
                      wrapper, so both lines hug their glyph box. */}
                  <div className="flex flex-col gap-4 pl-9">
                    <p className="text-v1-body-lg text-white">{s.provider}</p>
                    <p className="text-v1-body-lg text-v1-frost/50">{s.data}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Divider />

          {/* Contact Information — gap 24. */}
          <div className="flex flex-col gap-6">
            <h2 className="text-v1-heading-sm text-white">Contact Information</h2>
            <div className="flex flex-col gap-4">
              <IconRow icon={RiUserLine} gap="gap-[10px]">
                Owner &amp; Data Controller
              </IconRow>
              <div className="flex flex-col gap-4 pl-9 text-v1-frost/50">
                <p className="text-v1-body-lg">
                  Inngest Inc - 600 California St Suite 1200 San Francisco, CA
                  94109, USA
                </p>
                <p className="text-v1-body-lg">
                  Owner Contact Email:{" "}
                  <a
                    href="mailto:hello@inngest.com"
                    className="underline underline-offset-2 motion-safe:transition-colors hover:text-v1-frost"
                  >
                    hello@inngest.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Footer note — divider + note, gap 44. */}
          <div className="flex flex-col gap-11">
            <Divider />
            {/* gap-[27px] = the blank line between the two paragraphs
                (one body-lg-loose line box). */}
            <div className="flex flex-col gap-[27px] text-v1-body-lg-loose text-white">
              <p>Latest update: April 03, 2026</p>
              <p>
                This document has been created with the iubenda{" "}
                <FootnoteLink href="https://www.iubenda.com/en/privacy-and-cookie-policy-generator">
                  Privacy and Cookie Policy Generator
                </FootnoteLink>
                . See also the{" "}
                <FootnoteLink href="https://www.iubenda.com/en/terms-and-conditions-generator">
                  Terms and Conditions Generator
                </FootnoteLink>
                .{" "}
                <FootnoteLink href="https://www.iubenda.com/en/">
                  iubenda
                </FootnoteLink>{" "}
                hosts this content and only collects{" "}
                <FootnoteLink href="https://www.iubenda.com/privacy-policy/65675001">
                  the Personal Data strictly necessary
                </FootnoteLink>{" "}
                for it to be provided.{" "}
                <FootnoteLink href="https://www.iubenda.com/app/privacy-policy/26885259/legal">
                  Show the complete Privacy Policy
                </FootnoteLink>
                .
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Closing stippled "Inngest" lockup above the footer, shared with
          the Home/Events pages. */}
      <LogoMarquee />
    </PageShell>
  );
}

import { type ReactNode } from "react";
import PageShell from "@/components/v1/PageShell";
import Button from "@/components/v1/Button";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";

// Security — same v1 treatment as the Terms and Privacy pages: an 800px
// reading column on the grain backdrop (PageShell), a centred Display/Sm
// title, and the shared legal type scale. Two heading levels are used:
//   • Heading/Md 32/40 → major section titles (SectionTitle)
//   • Heading/Sm 26/31 → subsections          (H3)
// Body copy is 18/27 (text-v1-body-lg-loose); blank lines between
// paragraphs are real empty lines (<Blank/>), matching Terms/Privacy.

function Divider() {
  return <hr className="h-px w-full border-0 bg-v1-steel" />;
}

// Heading/Md 32/40 — major section title.
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="v1-trim text-v1-heading-card break-words tracking-[-0.01em] text-white">
      {children}
    </h2>
  );
}

// Heading/Sm 26 — subsection.
function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-v1-heading-sm break-words text-white">{children}</h3>
  );
}

// Heading + its body, 24px apart.
function Group({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>;
}

// Body block — inherits 18/27 onto its <p>/<ul> children; <p> margins are
// reset so interior spacing comes only from <Blank/> lines. Cap-trims the
// block at its outer edges via the same -0.396em/-0.395em metrics the
// body-lg token bakes in (negative margins so single-element bodies trim
// both edges and it degrades cleanly everywhere). See Terms.tsx.
const TRIM_EDGES =
  "[&>:first-child]:-mt-[0.396em] [&>:last-child]:-mb-[0.395em]";

function Body({ children }: { children: ReactNode }) {
  return (
    <div
      className={`text-v1-body-lg-loose break-words text-white [&_p]:m-0 ${TRIM_EDGES}`}
    >
      {children}
    </div>
  );
}

// One empty line (27px) between paragraphs — a blank-line spacer.
const Blank = () => (
  <p aria-hidden className="select-none">
    {"​"}
  </p>
);

// External links open in a new tab; in-page schemes (mailto:, #anchors) don't.
function Link({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noreferrer" })}
      className="underline underline-offset-2 hover:text-v1-frost/70 motion-safe:transition-colors"
    >
      {children}
    </a>
  );
}

// Inline monospace — the `age` tool name and public key.
function Code({ children }: { children: ReactNode }) {
  return <code className="break-all font-v1Mono text-[0.9em]">{children}</code>;
}

export default function Security() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        {/* 800px reading column, mirroring Terms/Privacy: max-w 864 + the
            v1 px-6/sm:px-9/lg:px-8 gutter lands content at 800 on desktop.
            44px section rhythm; top padding clears the fixed header. */}
        <section className="mx-auto flex w-full max-w-[864px] flex-col gap-11 px-6 pb-20 pt-24 text-v1-frost sm:px-9 sm:pt-[120px] lg:px-8 lg:pt-[156px]">
          {/* Title left-aligned with the "Report a security issue" CTA in
              the same row — the SectionHeader title-aside pattern: title
              takes 1fr, CTA is right-aligned at lg and stacks under the
              title on mobile. */}
          <header className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-12">
            <h1 className="font-v1Display uppercase leading-[1.25] tracking-[-0.01em] text-white [font-size:clamp(2.5rem,5.4vw,4rem)] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
              Security
            </h1>
            <div className="lg:justify-self-end">
              <Button asChild variant="secondary" size="sm">
                <a href="#contact-us">Report a security issue</a>
              </Button>
            </div>
          </header>

          <Divider />

          {/* SOC 2 compliance badge. */}
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
            <img
              src="/assets/compliance/soc2.webp"
              alt="SOC 2"
              width={96}
              height={96}
              className="h-24 w-24 shrink-0"
            />
            <Body>
              <p>
                Inngest is <strong>SOC 2 Type II</strong> compliant.
              </p>
              <Blank />
              <p>
                <Link href="/blog/soc2-compliant?ref=security">
                  Read our announcement
                </Link>
                ,{" "}
                <Link href="https://trust.inngest.com/">
                  request a copy of the report
                </Link>{" "}
                or <Link href="mailto:hello@inngest.com">contact us</Link> for
                additional questions.
              </p>
            </Body>
          </div>

          <Body>
            <p>
              To read how we handle SDK and function security,{" "}
              <Link href="/docs/learn/security?ref=security">read our docs on security</Link>
              .
            </p>
          </Body>

          <Divider />

          <SectionTitle>Organizational Security</SectionTitle>
          <Group>
            <H3>Information Security Program</H3>
            <Body>
              <p>
                We have an Information Security Program in place that is
                communicated throughout the organization. Our Information
                Security Program follows the criteria set forth by the SOC 2
                Framework. SOC 2 is a widely known information security auditing
                procedure created by the American Institute of Certified Public
                Accountants.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Third-Party Audits</H3>
            <Body>
              <p>
                Our organization undergoes independent third-party assessments
                to test our security and compliance controls.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Third-Party Penetration Testing</H3>
            <Body>
              <p>
                We perform an independent third-party penetration at least
                annually to ensure that the security posture of our services is
                uncompromised.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Roles and Responsibilities</H3>
            <Body>
              <p>
                Roles and responsibilities related to our Information Security
                Program and the protection of our customer&rsquo;s data are well
                defined and documented. Our team members are required to review
                and accept all of the security policies.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Security Awareness Training</H3>
            <Body>
              <p>
                Inngest employees are required to go through employee security
                awareness training covering industry standard practices and
                information security topics such as phishing and password
                management.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Confidentiality</H3>
            <Body>
              <p>
                All Inngest employees and contractors are required to sign and
                adhere to an industry standard confidentiality agreement prior
                to their first day of work
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Background Checks</H3>
            <Body>
              <p>
                We perform background checks on all new employees in accordance
                with local laws.
              </p>
            </Body>
          </Group>

          <Divider />

          <SectionTitle>Cloud Security</SectionTitle>
          <Group>
            <H3>Cloud Infrastructure Security</H3>
            <Body>
              <p>
                All of our services are hosted with Amazon Web Services (AWS)
                and Google Cloud Platform (GCP). They employ a robust security
                program with multiple certifications. For more information on
                our provider&rsquo;s security processes, please visit{" "}
                <Link href="http://aws.amazon.com/security/">AWS Security</Link>{" "}
                and{" "}
                <Link href="https://cloud.google.com/security">
                  GCP Security
                </Link>
                .
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Data Hosting Security</H3>
            <Body>
              <p>
                All of our data is hosted on Amazon Web Services (AWS)
                databases. These databases are all located in the United States.
                Please reference the above vendor specific documentation linked
                above for more information.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Encryption at Rest</H3>
            <Body>
              <p>All databases are encrypted at rest.</p>
            </Body>
          </Group>
          <Group>
            <H3>Encryption in Transit</H3>
            <Body>
              <p>Our applications encrypt in transit with TLS/SSL only.</p>
            </Body>
          </Group>
          <Group>
            <H3>Vulnerability Scanning</H3>
            <Body>
              <p>
                We perform vulnerability scanning and actively monitor for
                threats.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Logging and Monitoring</H3>
            <Body>
              <p>We actively monitor and log various cloud services.</p>
            </Body>
          </Group>
          <Group>
            <H3>Business Continuity and Disaster Recovery</H3>
            <Body>
              <p>
                We use our data hosting provider&rsquo;s backup services to
                reduce any risk of data loss in the event of a hardware failure.
                We utilize monitoring services to alert the team in the event of
                any failures affecting users.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Incident Response</H3>
            <Body>
              <p>
                We have a process for handling information security events which
                includes escalation procedures, rapid mitigation and
                communication.
              </p>
            </Body>
          </Group>

          <Divider />

          <SectionTitle>Access Security</SectionTitle>
          <Group>
            <H3>Permissions and Authentication</H3>
            <Body>
              <p>
                Access to cloud infrastructure and other sensitive tools are
                limited to authorized employees who require it for their role.
              </p>
              <Blank />
              <p>
                Where available we have Single Sign-on (SSO), 2-factor
                authentication (2FA) and strong password policies to ensure
                access to cloud services are protected.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Least Privilege Access Control</H3>
            <Body>
              <p>
                We follow the principle of least privilege with respect to
                identity and access management.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Quarterly Access Reviews</H3>
            <Body>
              <p>
                We perform quarterly access reviews of all team members with
                access to sensitive systems.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Password Requirements</H3>
            <Body>
              <p>
                All team members are required to adhere to a minimum set of
                password requirements and complexity for access.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Password Managers</H3>
            <Body>
              <p>
                All company issued laptops utilize a password manager for team
                members to manage passwords and maintain password complexity.
              </p>
            </Body>
          </Group>

          <Divider />

          <SectionTitle>Vendor and Risk Management</SectionTitle>
          <Group>
            <H3>Annual Risk Assessments</H3>
            <Body>
              <p>
                We undergo at least annual risk assessments to identify any
                potential threats, including considerations for fraud.
              </p>
            </Body>
          </Group>
          <Group>
            <H3>Vendor Risk Management</H3>
            <Body>
              <p>
                Vendor risk is determined and the appropriate vendor reviews are
                performed prior to authorizing a new vendor.
              </p>
            </Body>
          </Group>

          <Divider />

          {/* Contact Us — anchor target for the header CTA; scroll-mt clears
              the fixed v1 header. */}
          <div id="contact-us" className="flex scroll-mt-32 flex-col gap-6">
            <SectionTitle>Contact Us</SectionTitle>
            <Body>
              <p>
                If you have any questions, comments or concerns or if you wish
                to report a potential security issue, please contact{" "}
                <Link href="mailto:security@inngest.com">
                  security@inngest.com
                </Link>
                . We do offer bounties for qualifying, valid reports of system
                or SDK vulnerabilities.
              </p>
              <Blank />
              <p>
                For encrypted communication, our{" "}
                <Link href="https://age-encryption.org">
                  <Code>age</Code>
                </Link>{" "}
                public key is{" "}
                <Code>
                  age1ljrw40qggulsgau0wgduh3mpkahwnjaaakm206wlmdh72x2a3p0sps6q9p
                </Code>
                .
              </p>
              <Blank />
              <p>
                In order to ensure security reports are actionable and to
                prevent our security inbox from being inundated with invalid
                reports, please review{" "}
                <Link href="https://bughunters.google.com/learn/invalid-reports/5374985771941888">
                  the list of non-qualifying reports on Google&rsquo;s website
                </Link>
                . If your report falls into one of their categories, i.e.{" "}
                <em>
                  &ldquo;CSRF that requires the knowledge of a secret&rdquo;
                </em>
                , there is no need to report it.
              </p>
            </Body>
          </div>
        </section>
      </div>

      {/* Closing stippled "Inngest" lockup above the footer, shared with the
          Home/Events/Terms/Privacy pages. */}
      <LogoMarquee />
    </PageShell>
  );
}

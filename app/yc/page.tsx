import { type Metadata } from "next";

import Container from "src/shared/layout/Container";
import Quote from "src/components/Quote";
import ContactForm, { FORM_TYPE } from "src/components/ContactForm";
import { generateMetadata } from "src/utils/social";

export const metadata: Metadata = generateMetadata({
  title: "Request the YC Deal",
  description:
    "Are you a Y Combinator company or alumni? Let us know here for access to the YC deal: The pro plan free for the first year.",
});

export default function Page() {
  return (
    <div className="font-sans text-basis">
      <Container>
        <main className="m-auto max-w-5xl pb-8 pt-4 sm:pt-16">
          <header className="m-auto max-w-4xl pt-12 text-center lg:pt-24">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white md:mb-6 md:text-4xl lg:leading-loose xl:text-5xl">
              Request the YC Deal
            </h1>
            <p className="text-balance">
              Are you a Y Combinator company or alumni? Let us know here for
              access to the YC deal: The pro plan free for the first year.
            </p>
          </header>

          <div className="my-12 grid gap-24 lg:grid-cols-2">
            <div>
              <ContactForm
                eventName="website/yc-deal.submitted"
                eventVersion="2025-11-06.1"
                formType={FORM_TYPE.YC_LEAD_FORM}
                button="Request the YC Deal"
              />
            </div>

            <div className="mx-auto max-w-2xl">
              <Quote
                text="The DX and visibility with Inngest is really incredible. We are able to develop functions locally easier and faster that with our previous queue. Also, Inngest's tools give us the visibility to debug issues much quicker than before."
                attribution={{
                  name: "Bu Kinoshita",
                  title: "CTO & Co-founder (YC W23)",
                  logo: "/assets/customers/resend.svg",
                }}
                variant="no-padding"
                className="rounded-none border-b border-subtle pb-8"
              />
              <div className="my-8 flex flex-row items-center gap-4 text-lg text-subtle">
                <img
                  src="/assets/compliance/soc2.webp"
                  alt="SOC 2"
                  className="h-16 w-16"
                />
                <p>Inngest is SOC 2 Type II compliant.</p>
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
                  className="h-9"
                  src="/assets/customers/conveo-logo-white.svg"
                  alt="Conveo"
                />
                <img
                  className="h-7"
                  src="/assets/customers/gitbook-logo-white.svg"
                  alt="Gitbook"
                />
              </div>
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
}

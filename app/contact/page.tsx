import { type Metadata } from "next";

import Container from "src/shared/layout/Container";
import Quote from "src/components/Quote";
import ContactForm, { FORM_TYPE } from "src/components/ContactForm";
import { RiLifebuoyLine } from "@remixicon/react";
import { generateMetadata } from "src/utils/social";

export const metadata: Metadata = generateMetadata({
  title: "Schedule a demo",
  description:
    "Schedule a demo with a solutions expert to learn more about Inngest.",
});

export default function Page() {
  return (
    <div className="font-sans text-basis">
      <Container>
        <main className="m-auto max-w-5xl pb-8 pt-4 sm:pt-16">
          <header className="m-auto max-w-4xl pt-12 text-center lg:pt-24">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white md:mb-6 md:text-4xl lg:leading-loose xl:text-5xl">
              Chat with sales engineering
            </h1>
            <p className="text-balance">
              Explore and evaluate Inngest and learn about custom Enterprise
              plans and pricing.
            </p>

            <div className="hidden place-content-center sm:flex">
              <p className="mt-4 items-center gap-2 rounded-md bg-white/5 px-3 py-2">
                <RiLifebuoyLine className="mr-1 inline h-4 w-4 -translate-y-px" />{" "}
                Looking for support?{" "}
                <a href="/discord" className="font-medium hover:underline">
                  Chat on Discord
                </a>{" "}
                or{" "}
                <a
                  href={process.env.NEXT_PUBLIC_SUPPORT_URL}
                  className="font-medium hover:underline"
                >
                  create a support ticket
                </a>{" "}
              </p>
            </div>
          </header>

          <div className="my-12 grid gap-24 lg:grid-cols-2">
            <div>
              <ContactForm
                eventName="contact.form.sent"
                eventVersion="2023-12-12.1"
                formType={FORM_TYPE.SALES_LEAD_FORM}
                button="Schedule a call"
                redirectTo="https://savvycal.com/inngest/demo?utm_medium=website&utm_source=contact-page"
              />
            </div>

            <div className="mx-auto max-w-2xl">
              <Quote
                text="We were struggling with the complexities of managing our social media and e-commerce workflows. Thanks to Inngest, we were able to simplify our development process, speed up our time to market, and deliver a better customer experience. Inngest has become an essential tool in our tech stack."
                attribution={{
                  name: "Aivaras Tumas",
                  title: "CEO @ Ocoya",
                  avatar: "/assets/customers/ocoya-aivaras-tumas.png",
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

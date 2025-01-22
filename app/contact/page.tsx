import { type Metadata } from "next";

import Container from "src/shared/layout/Container";
import Quote from "src/components/Quote";
import ContactForm from "src/components/ContactForm";
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
        <main className="m-auto max-w-5xl pt-4 sm:pt-16 pb-8">
          <header className="pt-12 lg:pt-24 max-w-4xl m-auto text-center">
            <h1 className="text-white font-bold text-2xl md:text-4xl xl:text-5xl mb-2 md:mb-6 tracking-tight lg:leading-loose">
              Chat with sales engineering
            </h1>
            <p className="text-balance">
              Explore and evaluate Inngest and learn about custom Enterprise
              plans and pricing.
            </p>

            <div className="hidden sm:flex place-content-center">
              <p className="mt-4 py-2 px-3 rounded-md bg-white/5 gap-2 items-center">
                <RiLifebuoyLine className="w-4 h-4 inline -translate-y-px mr-1" />{" "}
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

          <div className="my-12 grid lg:grid-cols-2 gap-24">
            <div>
              <ContactForm
                eventName="contact.form.sent"
                eventVersion="2023-12-12.1"
                gtmEvent="Sales Lead Form Submitted"
                button="Schedule a call"
                redirectTo="https://savvycal.com/inngest/demo"
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
                className="pb-8 rounded-none border-b border-subtle"
              />
              <div className="flex flex-row gap-4 items-center my-8 text-lg text-subtle">
                <img
                  src="/assets/compliance/soc2.webp"
                  alt="SOC 2"
                  className="h-16 w-16"
                />
                <p>Inngest is SOC 2 Type II compliant.</p>
              </div>
              <p className="mt-12 mb-6 text-lg font-semibold text-subtle">
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

import type { Metadata } from "next";
import { AIPage } from "src/app/ai/AIPage";
import ContactForm from "src/components/ContactForm";
import { generateMetadata } from "src/utils/social";
import { H2 } from "src/components/LandingPage/Heading";

export const metadata: Metadata = generateMetadata({
  // Prevent Google from indexing landing pages which may have
  // duplicate and/or temporary content
  robots: "noindex",
  title: "AI",
  description:
    "Orchestration for AI workflows and AI agents. Build, iterate and ship to production with confidence.",
});

export default function Page() {
  return (
    <>
      <AIPage
        heroCTAs={[]}
        heroFeature={
          <ContactForm
            className="max-w-md w-full mx-auto"
            eventName="contact.form.sent"
            eventVersion="2023-12-12.1"
            gtmEvent="Sales Lead Form Submitted"
            button="Schedule a call"
            redirectTo="https://savvycal.com/inngest/demo?utm_medium=website&utm_source=ai-landing-page"
          />
        }
        showCTAs={false}
      />
      <section>
        <div className="mt-12 px-6 flex items-center justify-center tracking-tight text-basis text-center">
          <div className="max-w-xl mx-auto mt-4 flex flex-col gap-6">
            <H2>Schedule a call</H2>
            <p className="text-lg md:text-xl text-balance">
              We're here to help you with any questions you have about Inngest
              and AI.
            </p>
            <div className="text-left">
              <ContactForm
                className="max-w-md w-full mx-auto"
                eventName="contact.form.sent"
                eventVersion="2023-12-12.1"
                gtmEvent="Sales Lead Form Submitted"
                button="Schedule a call"
                redirectTo="https://savvycal.com/inngest/demo?utm_medium=website&utm_source=ai-landing-page"
              />
            </div>
          </div>
        </div>
        <img
          className="max-w-6xl w-full mx-auto"
          src="/assets/ai/early-access-isometric-ui-image.png"
        />
      </section>
    </>
  );
}

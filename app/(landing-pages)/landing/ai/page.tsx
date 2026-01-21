import type { Metadata } from "next";
import { AIPage } from "src/app/ai/AIPage";
import ContactForm, { FORM_TYPE } from "src/components/ContactForm";
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

const ref = "landing-ai";

export default function Page() {
  return (
    <>
      <AIPage
        heroCTAs={[]}
        heroFeature={
          <ContactForm
            className="mx-auto w-full max-w-md"
            eventName="contact.form.sent"
            eventVersion="2023-12-12.1"
            formType={FORM_TYPE.SALES_LEAD_FORM}
            button="Schedule a call"
            redirectTo={`https://savvycal.com/inngest/demo?utm_medium=website&utm_source=${ref}`}
          />
        }
        showCTAs={false}
      />
      <section>
        <div className="mt-12 flex items-center justify-center px-6 text-center tracking-tight text-basis">
          <div className="mx-auto mt-4 flex max-w-xl flex-col gap-6">
            <H2>Schedule a call</H2>
            <p className="text-balance text-lg md:text-xl">
              We're here to help you with any questions you have about Inngest
              and AI.
            </p>
            <div className="text-left">
              <ContactForm
                className="mx-auto w-full max-w-md"
                eventName="contact.form.sent"
                eventVersion="2023-12-12.1"
                formType={FORM_TYPE.SALES_LEAD_FORM}
                button="Schedule a call"
                redirectTo={`https://savvycal.com/inngest/demo?utm_medium=website&utm_source=${ref}`}
              />
            </div>
          </div>
        </div>
        <img
          className="mx-auto w-full max-w-6xl"
          src="/assets/ai/early-access-isometric-ui-image.png"
        />
      </section>
    </>
  );
}

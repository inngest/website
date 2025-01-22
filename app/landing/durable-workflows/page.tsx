import type { Metadata } from "next";
import { DurableWorkflowsPage } from "src/app/uses/durable-workflows/page";
import { generateMetadata } from "src/utils/social";
import ContactForm from "src/components/ContactForm";

export const metadata: Metadata = generateMetadata({
  // Prevent Google from indexing landing pages which may have
  // duplicate and/or temporary content
  robots: "noindex",
  title: "Durable Workflows",
  description:
    "Write complex workflows as code and let Inngest handle the rest. Inngest manages state, retries, logging and observability for you.",
});

const baseCTA = "landing-durable-workflows";

export default function Page() {
  return (
    <>
      <DurableWorkflowsPage
        cta={{
          href: `/contact?ref=${baseCTA}`,
          text: "Schedule a demo",
        }}
      />
    </>
  );
}

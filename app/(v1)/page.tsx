import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import HomeV1 from "@/components/v1/pages/Home";

export const metadata: Metadata = generateMetadata({
  title: "Durable Execution for Developers & AI Workflows",
  description:
    "Build reliable background jobs, workflows, and AI agents without extra infrastructure. Automatic retries, flow control, and step-level observability.",
  image: "/assets/homepage/open-graph-2026.png",
});

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Inngest",
    url: "https://www.inngest.com",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Inngest",
    url: "https://www.inngest.com",
    logo: "https://www.inngest.com/logo-with-icon-white.svg",
    sameAs: [
      "https://twitter.com/inngest",
      "https://github.com/inngest",
      "https://www.linkedin.com/company/inngest",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Inngest",
    url: "https://www.inngest.com",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description:
      "Build reliable background jobs, workflows, and AI agents without extra infrastructure. Automatic retries, flow control, and step-level observability.",
    programmingLanguage: ["TypeScript", "JavaScript", "Python", "Go"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      url: "https://www.inngest.com/pricing",
    },
  },
];

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeV1 />
    </>
  );
}

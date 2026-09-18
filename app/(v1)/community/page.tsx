import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Community from "@/components/v1/pages/Community";
import {
  JsonLdScript,
  buildQuotationSchemas,
} from "@/utils/v1/structuredData";
import { SOCIAL_QUOTES } from "@/data/socialQuotes";

export const metadata: Metadata = generateMetadata({
  title: "Community quotes — what developers say about Inngest",
  description:
    "Third-party quotes from developers on X, LinkedIn, and Reddit about switching to Inngest for background jobs, durable execution, and AI agents.",
});

export default function Page() {
  const quotationSchema = buildQuotationSchemas(
    SOCIAL_QUOTES.map((q) => ({
      quote: q.quote,
      authorName: q.authorName,
      date: q.date,
      sourceUrl: q.sourceUrl,
    })),
  );

  return (
    <>
      <JsonLdScript data={quotationSchema} />
      <Community />
    </>
  );
}

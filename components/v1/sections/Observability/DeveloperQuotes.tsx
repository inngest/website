import SocialQuotesSection from "@/components/v1/sections/shared/SocialQuotesSection";

export default function DeveloperQuotes() {
  return (
    <SocialQuotesSection
      headingId="ob-quotes-heading"
      title="When retries and traces finally work"
      description="Developers who moved complex background jobs off DIY queues."
      quoteIds={[
        "vinit-rag-observability",
        "ben-granular-execution",
        "andrew-observability",
      ]}
      columns={3}
      refTag="observability"
    />
  );
}

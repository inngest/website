import SocialQuotesSection from "@/components/v1/sections/shared/SocialQuotesSection";

export default function DeveloperQuotes() {
  return (
    <SocialQuotesSection
      headingId="ai-quotes-heading"
      title="How teams run agents in production"
      description="Builders on durable execution, RAG pipelines, and the modern Next.js + Inngest stack."
      quoteIds={[
        "rohit-durable-agents",
        "manas-ai-streaming",
        "tejas-event-driven-ai",
      ]}
      columns={3}
      refTag="ai"
    />
  );
}

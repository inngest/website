import SocialQuotesSection from "@/components/v1/sections/shared/SocialQuotesSection";

export default function DeveloperQuotes() {
  return (
    <SocialQuotesSection
      headingId="de-quotes-heading"
      title="Why teams stop hand-rolling durability"
      description="Developers on retries, checkpointing, and skipping custom queue infrastructure."
      quoteIds={["omer-durability", "patrick-vercel", "ben-harness"]}
      columns={3}
      refTag="durable-execution"
    />
  );
}

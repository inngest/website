import SocialQuotesSection from "@/components/v1/sections/shared/SocialQuotesSection";

export default function DeveloperQuotes() {
  return (
    <SocialQuotesSection
      headingId="bgj-quotes-heading"
      title="Developers switching from queues and DIY workers"
      description="Named sources on BullMQ, Vercel background jobs, and observability that finally works."
      quoteIds={["rupesh-bullmq", "patrick-vercel", "simplifai-async-cost-tracking"]}
      columns={3}
      refTag="serverless-node-background-jobs"
    />
  );
}

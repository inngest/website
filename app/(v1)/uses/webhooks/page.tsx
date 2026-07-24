import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import WebhooksEvents from "@/components/v1/pages/WebhooksEvents";
import weDotsData from "@/public/assets/v1/webhooks-events-hero/dots.json";

// WebhooksEventsDotsCanvas reads this manifest on mount; inline it
// in the SSR HTML so the torus paints on the first frame.
const WE_DOTS_JSON = JSON.stringify(weDotsData);

export const metadata: Metadata = generateMetadata({
  title: "Reliable Webhook Handling & Event Processing",
  description:
    "Handle webhooks and events reliably - automatic retries, idempotency, fan-out, and event coordination built in. No queue setup or custom retry logic.",
});

export default function Page() {
  return (
    <>
      <script
        id="we-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: WE_DOTS_JSON }}
      />
      <WebhooksEvents />
    </>
  );
}

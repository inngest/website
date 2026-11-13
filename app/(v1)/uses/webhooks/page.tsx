import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import WebhooksEvents from "@/components/v1/pages/WebhooksEvents";
import weDotsData from "@/public/assets/v1/webhooks-events-hero/dots.json";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

// WebhooksEventsDotsCanvas reads this manifest on mount; inline it
// in the SSR HTML so the torus paints on the first frame.
const WE_DOTS_JSON = JSON.stringify(weDotsData);

const title = "Reliable Webhook Handling & Event Processing";
const description =
  "Handle webhooks and events reliably - automatic retries, idempotency, fan-out, and event coordination built in. No queue setup or custom retry logic.";

const structuredData = schemaGraph(
  pageSchemas({ path: "/uses/webhooks", title, description, crumb: "Webhooks" })
);

export const metadata: Metadata = generateMetadata({
  title,
  description,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <script
        id="we-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: WE_DOTS_JSON }}
      />
      <WebhooksEvents />
    </>
  );
}

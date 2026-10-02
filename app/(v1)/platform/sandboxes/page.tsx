import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Sandboxes from "@/components/v1/pages/Sandboxes";
import sandboxesDotsData from "@/public/assets/v1/sandboxes-hero/dots.json";

// SandboxesDotsCanvas reads this manifest on mount; inline it in the
// SSR HTML so the field can pour in on the first frame.
const SANDBOXES_DOTS_JSON = JSON.stringify(sandboxesDotsData);

export const metadata: Metadata = generateMetadata({
  title: "Sandboxes - Durable machines for code that has to run",
  description:
    "A sandbox is a step in your function, not a separate service. It retries, takes the same flow control, and lands on the trace beside experiments and scoring. Open beta.",
});

export default function Page() {
  return (
    <>
      <script
        id="sandboxes-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: SANDBOXES_DOTS_JSON }}
      />
      <Sandboxes />
    </>
  );
}

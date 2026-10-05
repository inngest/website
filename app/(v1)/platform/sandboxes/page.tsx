import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Sandboxes from "@/components/v1/pages/Sandboxes";

export const metadata: Metadata = generateMetadata({
  title: "Sandboxes - Durable machines for code that has to run",
  description:
    "A sandbox is a step in your function, not a separate service. It retries, takes the same flow control, and lands on the trace beside experiments and scoring. Open beta.",
});

export default function Page() {
  return <Sandboxes />;
}

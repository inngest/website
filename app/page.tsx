import { type Metadata } from "next";
import AccordionSection from "src/components/RedesignedLanding/AccordionSection";

import { generateMetadata } from "src/utils/social";

export const metadata: Metadata = generateMetadata({
  title: "AI and backend workflows, orchestrated at any scale",
  description:
    "Inngest's durable functions replace queues, state management, and scheduling to enable any developer to write reliable, multi-step code faster without touching infrastructure.",
  image: "/assets/homepage/open-graph.png",
});

export default function Page() {
  return <AccordionSection />;
}

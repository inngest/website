import { type Metadata } from "next";

import Footer from "src/components/RedesignedLanding/Footer";
import { generateMetadata } from "src/utils/social";
import Hero2 from "../components/RedesignedLanding/Hero";

export const metadata: Metadata = generateMetadata({
  title: "AI and backend workflows, orchestrated at any scale",
  description:
    "Inngest's durable functions replace queues, state management, and scheduling to enable any developer to write reliable, multi-step code faster without touching infrastructure.",
  image: "/assets/homepage/open-graph.png",
});

export default function Page() {
  return (
    <div>
      <Hero2 />
      <Footer />
    </div>
  );
}

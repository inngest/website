import { type Metadata } from "next";

import TestimonialCarousel from "components/RedesignedLanding/TestimonialCarousel";
import { generateMetadata } from "src/utils/social";
import Testimonial from "src/components/RedesignedLanding/Testimonial";

export const metadata: Metadata = generateMetadata({
  title: "AI and backend workflows, orchestrated at any scale",
  description:
    "Inngest's durable functions replace queues, state management, and scheduling to enable any developer to write reliable, multi-step code faster without touching infrastructure.",
  image: "/assets/homepage/open-graph.png",
});

export default function Page() {
  return (
    <div>
      <Testimonial />
      <TestimonialCarousel />
    </div>
  );
}

import { Metadata } from "next";
import { generateMetadata as generateOgMetadata } from "src/utils/social";

import About from "@/components/v1/pages/About";

export function generateMetadata(): Metadata {
  return generateOgMetadata({
    title: "The Team Behind the Developer Platform",
    description:
      "Learn about the Inngest team building the developer platform for durable execution, background jobs, and reliable workflows without extra infrastructure.",
  });
}

export default function Page() {
  return <About />;
}

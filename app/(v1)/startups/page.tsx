import { type Metadata } from "next";
import { generateMetadata } from "@/utils/social";
import Startups from "@/components/v1/pages/Startups";

export const metadata: Metadata = generateMetadata({
  title: "Startup Program",
  description:
    "Qualifying startups get 50% off the Inngest Pro plan for 12 months. Bootstrapped or venture-backed, apply here.",
});

export default function Page() {
  return <Startups />;
}

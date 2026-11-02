import { type Metadata } from "next";
import { generateMetadata } from "@/utils/social";
import Startups from "@/components/v1/pages/Startups";

export const metadata: Metadata = generateMetadata({
  title: "Startup Program",
  description:
    "Qualifying startups get the Inngest Pro plan free for the first year. Bootstrapped or venture-backed, apply here.",
});

export default function Page() {
  return <Startups />;
}

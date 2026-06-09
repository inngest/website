import { type Metadata } from "next";

import { generateMetadata } from "src/utils/social";
import ChangelogV1 from "@/components/v1/pages/Changelog";

export const metadata: Metadata = generateMetadata({
  title: "Changelog - Latest Updates & Releases",
  description:
    "Follow every Inngest product update: new SDK releases, platform features, integrations, and improvements shipped continuously.",
});

export default function Page() {
  return <ChangelogV1 />;
}

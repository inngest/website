import { type Metadata } from "next";
import { generateMetadata as socialMetadata } from "src/utils/social";
import CodeTVWebDevChallenge from "@/components/v1/pages/CodeTVWebDevChallenge";
import { HERO_IMAGE, INDEXABLE_AT } from "@/components/v1/sections/CodeTV/data";

// Robots depends on the calendar, not the last deploy. Regenerating hourly
// lets noindex drop off after INDEXABLE_AT without a follow-up ship.
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const meta = socialMetadata({
    title: "Build an app that does work while you're away",
    description:
      "Three teams. Four hours. Inngest keeps the work running — through a crash, after an event, while you're gone. A CodeTV Web Dev Challenge episode.",
    image: HERO_IMAGE,
  });

  if (Date.now() < Date.parse(INDEXABLE_AT)) {
    meta.robots = { index: false, follow: false };
  }

  return meta;
}

export default function Page() {
  return <CodeTVWebDevChallenge />;
}

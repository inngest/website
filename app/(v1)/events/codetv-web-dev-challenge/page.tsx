import { type Metadata } from "next";
import { generateMetadata as socialMetadata } from "src/utils/social";
import CodeTVWebDevChallenge from "@/components/v1/pages/CodeTVWebDevChallenge";
import { HERO_IMAGE } from "@/components/v1/sections/CodeTV/data";

export function generateMetadata(): Metadata {
  return socialMetadata({
    title: "Build an app that does work while you're away",
    description:
      "Three teams. Four hours. Inngest keeps the work running — through a crash, after an event, while you're gone. A CodeTV Web Dev Challenge episode.",
    image: HERO_IMAGE,
  });
}

export default function Page() {
  return <CodeTVWebDevChallenge />;
}

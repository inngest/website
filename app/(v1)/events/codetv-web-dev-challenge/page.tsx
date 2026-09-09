import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import CodeTVWebDevChallenge from "@/components/v1/pages/CodeTVWebDevChallenge";

export const metadata: Metadata = generateMetadata({
  title: "Build an app that works while you're away",
  description:
    "Three teams. Four hours. Inngest keeps the work running — through a crash, after an event, while you're gone. A CodeTV Web Dev Challenge episode.",
  image: "/assets/v1/events/codetv/group.jpg",
});

export default function Page() {
  return <CodeTVWebDevChallenge />;
}

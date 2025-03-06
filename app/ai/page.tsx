import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import { AIPage } from "./AIPage";

export const metadata: Metadata = generateMetadata({
  title: "AI",
  description:
    "Orchestration for AI workflows and AI agents. Build, iterate and ship to production with confidence.",
});

export default function Page() {
  return <AIPage />;
}

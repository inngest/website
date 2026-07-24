import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Terms from "@/components/v1/pages/Terms";

export const metadata: Metadata = generateMetadata({
  title: "Terms and Conditions",
  description: "Terms & Conditions governing the use of inngest.com.",
});

export default function Page() {
  return <Terms />;
}

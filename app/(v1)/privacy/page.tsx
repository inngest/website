import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Privacy from "@/components/v1/pages/Privacy";

export const metadata: Metadata = generateMetadata({
  title: "Privacy Policy",
  description:
    "How Inngest collects, uses, and protects personal data from users of inngest.com.",
});

export default function Page() {
  return <Privacy />;
}

import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Newsletter from "@/components/v1/pages/Newsletter";

export const metadata: Metadata = generateMetadata({
  title: "Newsletter",
  description:
    "Get the latest product updates about Inngest delivered to your inbox.",
});

export default function Page() {
  return <Newsletter />;
}

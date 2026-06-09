import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Security from "@/components/v1/pages/Security";

export const metadata: Metadata = generateMetadata({
  title: "Security",
  description: "Information on our platform security",
});

export default function Page() {
  return <Security />;
}

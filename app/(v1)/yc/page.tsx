import { type Metadata } from "next";
import { generateMetadata } from "@/utils/social";
import YC from "@/components/v1/pages/YC";

export const metadata: Metadata = generateMetadata({
  title: "Request the YC Deal",
  description:
    "Are you a Y Combinator company or alumni? Let us know here for access to the YC deal: The pro plan free for the first year.",
});

export default function Page() {
  return <YC />;
}

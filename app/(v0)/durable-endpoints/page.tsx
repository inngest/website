import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import { DurableEndpointsLP } from "./DurableEndpointsLP";

export const metadata: Metadata = generateMetadata({
  title: "Durable Endpoints",
  description: "TODO.",
});

export default function Page() {
  return <DurableEndpointsLP />;
}

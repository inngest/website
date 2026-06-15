import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import DownloadGateForm from "@/components/v1/pages/DownloadGateForm";

export const metadata: Metadata = generateMetadata({
  title: "AI in Production: The 2026 Benchmark Report",
  description:
    "How engineering teams are building, breaking, and scaling AI in production. A survey of 130 backend, full-stack, and AI engineers.",
});

export default function Page() {
  return <DownloadGateForm />;
}

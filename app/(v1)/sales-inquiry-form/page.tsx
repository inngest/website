import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import SalesInquiryForm from "@/components/v1/pages/SalesInquiryForm";

export const metadata: Metadata = generateMetadata({
  title: "Talk to Sales",
});

export default function Page() {
  return <SalesInquiryForm />;
}

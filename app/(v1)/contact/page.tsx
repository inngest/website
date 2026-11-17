import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import SalesInquiryForm from "@/components/v1/pages/SalesInquiryForm";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const title = "Talk to Sales";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/contact",
    title,
    crumb: "Talk to Sales",
    type: "ContactPage",
    about: "organization",
  })
);

export const metadata: Metadata = generateMetadata({
  title,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <SalesInquiryForm />
    </>
  );
}

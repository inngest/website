import { type Metadata } from "next";
import { generateMetadata } from "@/utils/social";
import Startups from "@/components/v1/pages/Startups";
import { STARTUP_FAQS } from "@/components/v1/sections/Startups/Faq";
import { PROGRAM_SUMMARY } from "@/components/v1/sections/Startups/program";
import {
  JsonLdScript,
  faqPageSchema,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const title = "Startup Program";
const description = PROGRAM_SUMMARY;

export const metadata: Metadata = generateMetadata({ title, description });

// WebPage + breadcrumb, plus the FAQ shown on the page, for search and
// answer engines.
const structuredData = schemaGraph(
  pageSchemas({ path: "/startups", title, description, crumb: title }),
  faqPageSchema({ path: "/startups", faqs: STARTUP_FAQS })
);

export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <Startups />
    </>
  );
}

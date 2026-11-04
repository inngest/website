import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Security from "@/components/v1/pages/Security";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const title = "Security";
const description = "Information on our platform security";

const structuredData = schemaGraph(
  pageSchemas({ path: "/security", title, description, crumb: "Security" })
);

export const metadata: Metadata = generateMetadata({
  title,
  description,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <Security />
    </>
  );
}

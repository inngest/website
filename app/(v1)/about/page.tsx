import { Metadata } from "next";
import { generateMetadata as generateOgMetadata } from "src/utils/social";

import About from "@/components/v1/pages/About";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const title = "The Team Behind the Developer Platform";
const description =
  "Learn about the Inngest team building the developer platform for durable execution, background jobs, and reliable workflows without extra infrastructure.";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/about",
    title,
    description,
    crumb: "About",
    type: "AboutPage",
    about: "organization",
  })
);

export function generateMetadata(): Metadata {
  return generateOgMetadata({
    title,
    description,
  });
}

export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <About />
    </>
  );
}

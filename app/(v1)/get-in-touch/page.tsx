import { type Metadata } from "next";

import { generateMetadata as socialMetadata } from "src/utils/social";
// v1 page (aliased to keep the "Get in Touch" support-hub naming clear).
import ContactFormV1 from "@/components/v1/pages/ContactForm";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const title = "Contact | Support & General Inquiries";
const description =
  "Get in touch with the Inngest team. Find the right channel for technical support, sales questions, partnerships, press, and general inquiries.";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/get-in-touch",
    title,
    description,
    crumb: "Contact",
    type: "ContactPage",
    about: "organization",
  })
);

export function generateMetadata(): Metadata {
  return socialMetadata({
    title,
    description,
  });
}

// /contact permanently redirects here.
export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <ContactFormV1 />
    </>
  );
}

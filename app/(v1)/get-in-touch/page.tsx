import { type Metadata } from "next";

import { generateMetadata as socialMetadata } from "src/utils/social";
// v1 page (aliased to keep the "Get in Touch" support-hub naming clear).
import ContactFormV1 from "@/components/v1/pages/ContactForm";

export function generateMetadata(): Metadata {
  return socialMetadata({
    title: "Contact | Support & General Inquiries",
    description:
      "Get in touch with the Inngest team. Find the right channel for technical support, sales questions, partnerships, press, and general inquiries.",
  });
}

// /contact permanently redirects here.
export default function Page() {
  return <ContactFormV1 />;
}

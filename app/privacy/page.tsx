import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import { isV1Enabled } from "@/utils/v1/routes";
import Privacy from "@/components/v1/pages/Privacy";
import Container from "src/shared/layout/Container";

export const metadata: Metadata = generateMetadata({
  title: "Privacy Policy",
  description:
    "How Inngest collects, uses, and protects personal data from users of inngest.com.",
});

// v1 redesign serves at the canonical /privacy when the flag is on; the
// legacy iubenda-embed renders when it's off. Header/Footer come from the
// app layout (legacy chrome), so the legacy branch renders body only.
export default function Page() {
  if (isV1Enabled()) return <Privacy />;
  return (
    <Container>
      <iframe
        src="https://www.iubenda.com/privacy-policy/26885259"
        className="my-12 min-h-[1200px] w-full border-0"
      />
    </Container>
  );
}

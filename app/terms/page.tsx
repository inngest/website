import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import { isV1Enabled } from "@/utils/v1/routes";
import Terms from "@/components/v1/pages/Terms";
import Container from "src/shared/layout/Container";

export const metadata: Metadata = generateMetadata({
  title: "Terms and Conditions",
  description: "Terms & Conditions governing the use of inngest.com.",
});

// v1 redesign serves at the canonical /terms when the flag is on; the
// legacy iubenda-embed renders when it's off. Header/Footer come from the
// app layout (legacy chrome), so the legacy branch renders body only.
export default function Page() {
  if (isV1Enabled()) return <Terms />;
  return (
    <Container>
      <iframe
        src="https://www.iubenda.com/terms-and-conditions/26885259"
        className="my-12 min-h-[1200px] w-full border-0"
      />
    </Container>
  );
}

import PageShell from "@/components/v1/PageShell";
import BottomCta from "@/components/v1/sections/Startups/BottomCta";
import Faq from "@/components/v1/sections/Startups/Faq";
import Hero from "@/components/v1/sections/Startups/Hero";

export default function Startups() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero />
        <Faq />
        <BottomCta />
      </div>
    </PageShell>
  );
}

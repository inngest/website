import PageShell from "@/components/v1/PageShell";
import Hero from "@/components/v1/sections/Customers/Hero";
import StoriesGrid from "@/components/v1/sections/Customers/StoriesGrid";
import Testimonials from "@/components/v1/sections/Customers/Testimonials";
import CTA from "@/components/v1/sections/Customers/CTA";

export default function Customers() {
  return (
    <PageShell>
      {/* overflow-x-clip catches the hero sphere's intentional bleed off
          the right edge (see Hero). */}
      <div className="overflow-x-clip">
        <Hero />
        <StoriesGrid />
        <Testimonials />
        <CTA />
      </div>
    </PageShell>
  );
}

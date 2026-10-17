import PageShell from "@/components/v1/PageShell";
import Hero from "@/components/v1/sections/Customers/Hero";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import CommunityLove from "@/components/v1/sections/Customers/CommunityLove";
import StoriesGrid from "@/components/v1/sections/Customers/StoriesGrid";
import Testimonials from "@/components/v1/sections/Customers/Testimonials";
import CTA from "@/components/v1/sections/Customers/CTA";

export default function Customers() {
  return (
    <PageShell>
      {/* Keeps the quote strip from widening the page when it overflows. */}
      <div className="overflow-x-clip">
        <Hero />
        <LogoStrip contained />
        <CommunityLove />
        <StoriesGrid />
        <Testimonials />
        <CTA />
      </div>
    </PageShell>
  );
}

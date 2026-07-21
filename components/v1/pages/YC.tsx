import PageShell from "@/components/v1/PageShell";
import BottomCta from "@/components/v1/sections/YC/BottomCta";
import Hero from "@/components/v1/sections/YC/Hero";

export default function YC() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero />
        <BottomCta />
      </div>
    </PageShell>
  );
}

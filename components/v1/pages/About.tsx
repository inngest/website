import PageShell from "@/components/v1/PageShell";
import Hero from "@/components/v1/sections/About/Hero";
import Team from "@/components/v1/sections/About/Team";
import HowWeWork from "@/components/v1/sections/About/HowWeWork";
import Investors from "@/components/v1/sections/About/Investors";
import Related from "@/components/v1/sections/About/Related";

export default function About() {
  return (
    <PageShell>
      <Hero />
      <Team />
      <HowWeWork />
      <Investors />
      <Related />
    </PageShell>
  );
}

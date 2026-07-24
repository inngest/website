import PageShell from "@/components/v1/PageShell";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import Testimonials, {
  EDGE_TESTIMONIALS_TITLE,
} from "@/components/v1/sections/shared/Testimonials";
import { AI_TESTIMONIAL_SLIDES } from "@/components/v1/sections/shared/testimonialSlides";
import DownloadModalProvider from "@/components/v1/sections/DownloadGateForm/DownloadModalProvider";
import Hero from "@/components/v1/sections/DownloadGateForm/Hero";
import KeyFindings from "@/components/v1/sections/DownloadGateForm/KeyFindings";
import ConfidenceParadox from "@/components/v1/sections/DownloadGateForm/ConfidenceParadox";
import ObservabilityGap from "@/components/v1/sections/DownloadGateForm/ObservabilityGap";
import ReliabilityTax from "@/components/v1/sections/DownloadGateForm/ReliabilityTax";
import ConfidentTeams from "@/components/v1/sections/DownloadGateForm/ConfidentTeams";
import FullReport from "@/components/v1/sections/DownloadGateForm/FullReport";

export default function DownloadGateForm() {
  return (
    <DownloadModalProvider>
      <PageShell>
        <Hero />
        <LogoStrip />
        <KeyFindings />
        <ConfidenceParadox />
        <ObservabilityGap />
        <ReliabilityTax />
        <ConfidentTeams />
        <FullReport />
        <Testimonials
          slides={AI_TESTIMONIAL_SLIDES}
          portraitClassName="mix-blend-luminosity"
          title={EDGE_TESTIMONIALS_TITLE}
        />
        <LogoMarquee />
      </PageShell>
    </DownloadModalProvider>
  );
}

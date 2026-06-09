import PageShell from "@/components/v1/PageShell";
import AnySourcePath from "@/components/v1/sections/WebhooksEvents/AnySourcePath";
import CaseStudies from "@/components/v1/sections/WebhooksEvents/CaseStudies";
import DurabilityDefinedInCode from "@/components/v1/sections/WebhooksEvents/DurabilityDefinedInCode";
import Faq from "@/components/v1/sections/WebhooksEvents/Faq";
import Hero from "@/components/v1/sections/WebhooksEvents/Hero";
import InPractice from "@/components/v1/sections/WebhooksEvents/InPractice";
import Integrations from "@/components/v1/sections/WebhooksEvents/Integrations";
import Testimonials from "@/components/v1/sections/WebhooksEvents/Testimonials";

export default function WebhooksEvents() {
  return (
    <PageShell>
      <link
        rel="preload"
        as="image"
        href="/assets/v1/page/.compressed/grain-bg.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <div className="overflow-x-clip">
        <Hero />
        <Testimonials />
        <AnySourcePath />
        <DurabilityDefinedInCode />
        <InPractice />
        <Integrations />
        <CaseStudies />
        <Faq />
      </div>
    </PageShell>
  );
}

import PageShell from "@/components/v1/PageShell";
import CaseStudies from "@/components/v1/sections/BackgroundJobs/CaseStudies";
import Customers from "@/components/v1/sections/BackgroundJobs/Customers";
import Faq from "@/components/v1/sections/BackgroundJobs/Faq";
import Hero from "@/components/v1/sections/BackgroundJobs/Hero";
import HowItWorks from "@/components/v1/sections/BackgroundJobs/HowItWorks";
import QueueComparison from "@/components/v1/sections/BackgroundJobs/QueueComparison";
import Reliability from "@/components/v1/sections/BackgroundJobs/Reliability";
import SeeItInAction from "@/components/v1/sections/BackgroundJobs/SeeItInAction";
import StartBuilding from "@/components/v1/sections/BackgroundJobs/StartBuilding";

export default function BackgroundJobs() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero />
        <Customers />
        <HowItWorks />
        <SeeItInAction />
        <Reliability />
        <QueueComparison />
        <CaseStudies />
        <Faq />
        <StartBuilding />
      </div>
    </PageShell>
  );
}

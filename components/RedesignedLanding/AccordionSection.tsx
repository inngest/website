import FlowAccordion from "./FlowAccoridion/FlowControl";
import RecoveryAccordion from "./RecoveryAccoridion/RecoveryTools";

export default function AccordionSection() {
  return (
    <div className="bg-stone-950">
      <div className="relative mx-auto w-full max-w-7xl rounded-xl bg-stone-950 px-6 py-20  sm:px-8 lg:px-10 xl:px-16">
        <div className="relative flex flex-col gap-y-4">
          <h1 className="gap-0 font-whyte text-3xl font-light text-stone-100">
            Scale like the{" "}
            <span className="max-w-3xl font-whyteInktrap font-normal">
              billions
            </span>{" "}
            of workflows <br className="hidden sm:block" />
            processed this month
          </h1>
          <p className="mb-4 max-w-md font-sans text-lg font-light leading-[25.2px] text-stone-200">
            Configure, manage, and monitor your workflows while our platform
            scales for your needs.
          </p>
          <FlowAccordion />
          <RecoveryAccordion />
        </div>
      </div>
    </div>
  );
}

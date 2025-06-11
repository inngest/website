import GridBackground from "../RedesignedLanding/GridBackground";

export default function PricingTitle() {
  return (
    <div>
      <div className="mx-auto mb-12 flex max-w-[1222px] flex-col gap-y-12">
        <div className="z-10 flex flex-col items-end justify-center pt-24 sm:flex-row">
          <h1 className="mx-auto max-w-60 font-whyteInktrap text-[2.25rem] font-normal text-stone-50 md:mx-0 md:max-w-none md:text-[84px] md:font-normal md:leading-[100.8px] md:tracking-[-4.2px]">
            Simple pricing that scales with you
          </h1>
          <p className="mx-auto max-w-60 font-circular text-base font-normal leading-8 text-stone-50 md:mx-0 md:max-w-sm md:text-2xl md:font-light">
            From early-stage startups to scaling enterprises, Inngest has you
            covered. Get started for free today.
          </p>
        </div>
      </div>
    </div>
  );
}

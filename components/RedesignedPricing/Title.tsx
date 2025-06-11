import GridBackground from "../RedesignedLanding/GridBackground";

export default function PricingTitle() {
  return (
    <div>
      <div className="mx-auto mb-12 flex max-w-[1222px] flex-col gap-y-12">
        <div className="z-10 flex flex-col items-end justify-center pt-24 sm:flex-row">
          <h1 className="font-whyteInktrap text-[84px] font-normal leading-[100.8px] tracking-[-4.2px] text-[#EFE9D6]">
            Simple pricing that scales with you
          </h1>
          <p className="max-w-sm font-circular text-2xl font-light text-[#EFE9D6]">
            From early-stage startups to scaling enterprises, Inngest has you
            covered. Get started for free today.
          </p>
        </div>
      </div>
    </div>
  );
}

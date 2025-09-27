import BaerskinTacticalHeader, { BaerskinLogo } from "./header";
import About from "./about";
import { Button } from "src/components/RedesignedLanding/Button";

export default function BaerskinTacticalPage() {
  return (
    <>
      <BaerskinTacticalHeader />

      <About />

      {/* Third section with same height */}
      <div className="relative flex flex-col overflow-hidden bg-carbon-100 px-12 py-20">
        {/* Content for third section will go here */}
        <div className="border-b border-carbon-1000 pb-20">
          <div className="relative z-10 flex h-full max-w-4xl">
            <p className="text-3xl font-light leading-[1.4] tracking-[-0.04em] text-[#292524]">
              BÆRSkin Tactical Supply Co. adopted a unique approach to
              e-commerce, taking data-driven decisions to target niche markets
              worldwide. This strategy is backed by the choice to build an
              in-house e-commerce platform, bringing them complete flexibility
              and control of the shopping experience compared to solutions like
              Shopify.
            </p>
          </div>
        </div>
        {/* replace bottom border with switcher */}
        <div className="mb-8 flex justify-end border-b border-carbon-1000 py-10">
          <BaerskinLogo />
        </div>
        <div className="flex flex-row justify-between gap-6">
          <div>
            <p className="max-w-md font-whyteMono text-[24px] font-normal leading-[1.3] tracking-[0.07em] text-[#292524]">
              THE KAFKA REPLATFORMING FAILURE: 6% EVENT LOSS
            </p>
          </div>
          <div>
            <div className="mx-auto max-w-3xl px-8">
              {/* Header Section */}
              <div className="mb-8">
                <p className="font-whyte text-4xl font-light leading-tight tracking-tight text-[#242424]">
                  BÆRSkin Tactical Supply Co. adopted Kafka in late 2023 to
                  power their analytics and order processing systems. As the
                  replatforming progressed, they realized that some events were
                  dropped, resulting in customers' complaints about missing
                  orders.
                </p>

                {/* Black square element */}
                <div className="mb-8 h-4 w-4 bg-[#242424]"></div>
              </div>

              {/* Divider */}
              <hr className="mb-8 border-t border-gray-300" />

              {/* Problem Description */}
              <div className="mb-8">
                <p className="font-[ABC Whyte Inktrap Variable] text-3xl font-light leading-snug tracking-tight text-[#242424]">
                  Events dropped by Kafka, combined with its lack of native
                  production tooling, made it hard for the engineering team to
                  identify the root cause and impact on customers. Facing this
                  challenge, Gus started to research a new technology to replace
                  Kafka, matching the following requirements:
                </p>
              </div>

              {/* Divider */}
              <hr className="mb-8 border-t border-gray-300" />

              {/* Requirements Section */}
              <div className="space-y-8">
                {/* Reliability */}
                <div className="flex gap-8">
                  <div className="w-32 flex-shrink-0">
                    <div className="font-medium text-[#242424]">
                      [X]
                      <br />
                      Reliability:
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed text-[#242424]">
                      Events should be delivered reliably and can be replayed in
                      case of processing issues. Producing and consuming events
                      should be scalable without requiring extra infrastructure
                      work.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-t border-gray-300" />

                {/* Event-driven */}
                <div className="flex gap-8">
                  <div className="w-32 flex-shrink-0">
                    <div className="font-medium text-[#242424]">
                      [X]
                      <br />
                      Event-driven:
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed text-[#242424]">
                      The researched solution needs to match BÆRSkin Tactical
                      Supply Co.' event-driven architecture.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-t border-gray-300" />

                {/* Observability */}
                <div className="flex gap-8">
                  <div className="w-32 flex-shrink-0">
                    <div className="font-medium text-[#242424]">
                      [X]
                      <br />
                      Observability:
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed text-[#242424]">
                      Events and their associated processing should be easily
                      monitored with metrics and alerts.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-t border-gray-300" />

                {/* Monitoring & Recovery */}
                <div className="flex gap-8">
                  <div className="w-32 flex-shrink-0">
                    <div className="font-medium text-[#242424]">
                      [X]
                      <br />
                      Monitoring
                      <br />& Recovery
                      <br />
                      tooling:
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed text-[#242424]">
                      Events should be delivered reliably and can be replayed in
                      case of processing issues. Producing and consuming events
                      should be scalable without requiring extra infrastructure
                      work.
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <hr className="mb-8 mt-8 border-t border-gray-300" />

              {/* Conclusion */}
              <div>
                <p className="text-lg leading-relaxed text-[#242424]">
                  Compared to other solutions like Temporal, Inngest stood out
                  as a promising candidate with the added value of its{" "}
                  <span className="underline">great DX</span> and{" "}
                  <span className="underline">Bun</span> support, which is the
                  primary runtime of BÆRSkin Tactical Supply Co.'s codebase.
                </p>
              </div>
              <div>
                <div className="mx-auto mt-20 border-t border-stone-50 pt-8">
                  <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex items-center justify-start gap-3">
                      <div className="h-3 w-3 bg-inngestLux"></div>
                      <p className="font-whyte text-2xl font-light leading-tight tracking-tight text-white">
                        Interested in Inngest?
                      </p>
                    </div>
                    <div className="w-full md:w-auto">
                      <div className="w-full border-t border-stone-50 md:hidden"></div>
                      <div className="flex items-center justify-start gap-3 pt-6 md:pt-0">
                        <div className="h-3 w-3 bg-inngestLux"></div>
                        <p className="max-w-xs font-whyte text-2xl font-light leading-tight tracking-tight text-white">
                          Talk to an Inngest product expert today.
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:items-center md:gap-8">
                      <Button className="w-full rounded-sm px-8 py-3 text-base font-medium text-black transition-colors md:w-auto">
                        Get in touch [+]
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import Image from "next/image";
import { Button } from "src/components/RedesignedLanding/Button";

export default function About() {
  return (
    <>
      {/* Second section with same height */}
      <div className="relative z-10 bg-stone-800 px-6 py-20 md:px-12 md:py-32">
        {/* Testimonial section */}
        <div className="mx-auto max-w-container-desktop px-8">
          <div className="m-auto">
            <div className="flex flex-col justify-between md:flex-row">
              {/* Quote */}
              <div className="order-1 max-w-[48rem] md:order-2">
                <blockquote className="max-w-4xl font-whyte text-2xl font-light leading-[120%] tracking-[-1.2px] text-[#FEFEFE] md:text-2xl md:leading-relaxed md:tracking-normal md:text-white">
                  "We figured out{" "}
                  <span className="font-whyteInktrapVariable text-2xl font-normal leading-[120%] tracking-[-1.2px] text-[#FEFEFE] underline md:text-3xl md:leading-[1.4] md:tracking-[-0.05em] md:text-[#FAFAF9]">
                    we were losing roughly 6% of events going through Kafka
                  </span>{" "}
                  with customers complaining they didn't get their order
                  confirmation emails. But it was super hard to tackle.{" "}
                  <span className="font-whyteInktrapVariable text-2xl font-normal leading-[120%] tracking-[-1.2px] text-[#FEFEFE] underline md:text-3xl md:leading-[1.4] md:tracking-[-0.05em] md:text-[#FAFAF9]">
                    Now that we switched to Inngest, we're super confident that
                    everything is working
                  </span>{" "}
                  as what I'll call tip top shape."
                </blockquote>
              </div>

              {/* Portrait and attribution */}
              <div className="order-2 mt-8 flex items-start gap-6 md:order-1 md:mt-0 md:flex-shrink-0">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-white md:h-48 md:w-48">
                  <Image
                    width={224}
                    height={224}
                    src="/assets/customers/baerskin/gusDither.png"
                    alt="Gus Fune, CEO"
                    className="h-full w-full object-cover filter"
                  />
                </div>
                <div className="max-w-sm border-t pt-2 font-whyteMono text-sm font-normal leading-[140%] text-[#E7E5E4] md:text-2xl md:leading-[1.3] md:tracking-[0.075em] md:text-[#FEFEFE]">
                  <p>Gus Fune → CEO</p>
                  <p>[ BÆRSkin Tactical Supply Co. ]</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-20 border-t border-stone-50 pt-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div className="flex items-center justify-start gap-3">
                <div className="h-3 w-3 bg-inngestLux"></div>
                <p className="font-whyte text-2xl font-light leading-tight tracking-tight text-white">
                  Interested in Inngest?
                </p>
              </div>
              <div className="w-full md:w-auto">
                <div className="w-full border-t border-stone-50 md:hidden"></div>
                <div className="flex items-start justify-start gap-3 pt-6 md:pt-0">
                  <div className="flex max-w-xs items-start gap-3 font-whyte text-2xl font-light leading-tight tracking-tight text-white">
                    <div className="mt-2 h-3 w-3 flex-shrink-0 bg-inngestLux"></div>
                    <p>Talk to an Inngest product expert today.</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:items-center md:gap-8">
                <Button className="flex h-[52px] w-[212px] flex-shrink-0 items-center justify-center gap-[10px] px-[13px] py-[15px] text-right font-whyte text-2xl font-normal leading-[120%] text-stone-800 transition-colors">
                  Get in touch [+]
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-16 flex shrink flex-col items-end gap-2">
            <div className="h-[52px] w-[11.6%] bg-white"></div>
            <div className="h-[52px] w-[19.4%] bg-white"></div>
            <div className="h-[52px] w-full bg-white"></div>
            <div className="h-[52px] w-[50.6%] self-start bg-white"></div>
            <div className="mr-[19.4%] h-[52px] w-[30%] bg-white"></div>
            <div className="h-[52px] w-[19.4%] bg-white"></div>
          </div>
        </div>
      </div>
    </>
  );
}

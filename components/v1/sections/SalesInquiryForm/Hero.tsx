import FormTestimonial from "@/components/v1/sections/shared/FormTestimonial";
import SalesForm from "@/components/v1/sections/SalesInquiryForm/SalesForm";

export default function Hero() {
  return (
    <section
      aria-labelledby="sales-hero-heading"
      className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-[88px] text-v1-frost sm:px-9 sm:pb-[100px] sm:pt-[104px] lg:px-0 lg:pb-[10px] lg:pt-[144px]"
    >
      <h1
        id="sales-hero-heading"
        // text-v1-display-sm carries the cross-browser cap-trim; size is
        // overridden to the 80px clamp and leading-[1.25] keeps the
        // token's trim calibration.
        className="font-v1Display text-v1-display-sm uppercase leading-[1.25] tracking-[-0.01em] [font-size:clamp(2.5rem,7.5vw,5rem)] lg:px-[70px]"
      >
        Talk to Sales
      </h1>

      {/* Left = intro + testimonial (555), right = radio + form (885).
          Same 555/885 split as the contact hub. Stacks below lg. */}
      <div className="mt-12 grid grid-cols-1 gap-y-12 lg:mt-[34px] lg:grid-cols-[555fr_885fr] lg:items-stretch lg:gap-y-0">
        <div className="flex flex-col gap-12 lg:justify-between lg:gap-0 lg:pb-[120px] lg:pl-[90px] lg:pt-[44px]">
          <div className="flex flex-col gap-2">
            <p className="text-v1-body-lg-loose text-v1-frost">
              Questions about Inngest, partnerships, or support? We&apos;ll
              get you to the right place.
            </p>
            <p className="font-v1Body text-[18px] italic leading-[1.5] tracking-[-0.01em] text-v1-frost/50">
              * Typically respond within 24 hours.
            </p>
          </div>

          <FormTestimonial />
        </div>

        <SalesForm />
      </div>
    </section>
  );
}

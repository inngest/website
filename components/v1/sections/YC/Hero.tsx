import Image from "next/image";
import FormTestimonial from "@/components/v1/sections/shared/FormTestimonial";
import YCForm from "@/components/v1/sections/YC/YCForm";

// H1, then an intro line spanning the full width, then a grid — left
// column is the form (wider, since it's the primary action), right
// column is social proof (testimonial, SOC2, trusted-by logos). Sections
// are unchanged from the legacy /yc page (intro, form, Resend quote,
// SOC2, trusted-by logos); this is a visual port only.
export default function Hero() {
  return (
    <section
      aria-labelledby="yc-hero-heading"
      className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-[88px] text-v1-frost sm:px-9 sm:pb-[100px] sm:pt-[104px] lg:px-0 lg:pb-[10px] lg:pt-[144px]"
    >
      <h1
        id="yc-hero-heading"
        className="font-v1Display text-v1-display-sm uppercase leading-[1.25] tracking-[-0.01em] [font-size:clamp(2.5rem,7.5vw,5rem)] lg:px-[70px]"
      >
        Request the YC Deal
      </h1>

      <p className="mt-6 text-v1-body-lg-loose text-v1-frost lg:mt-8 lg:px-[70px]">
        Are you a Y Combinator company or alumni? Let us know here for access
        to the YC deal: the Pro plan free for the first year.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-y-12 lg:mt-[52px] lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-x-12 lg:gap-y-0 lg:px-[70px]">
        <div className="max-w-[460px] rounded-[4px] border border-v1-steel/20 bg-v1-surfaceElevated p-6 sm:p-8">
          <YCForm />
        </div>

        <div className="flex flex-col gap-10">
          <FormTestimonial
            caption={
              <>
                <span className="block">Bu Kinoshita</span>
                <span className="block">CTO &amp; Co-founder (YC W23)</span>
              </>
            }
          />

          <div className="flex flex-row items-center gap-4 border-t border-v1-steel/20 pt-8">
            <Image
              src="/assets/v1/aicpa-soc2.png"
              alt="AICPA SOC 2 Type II compliance badge"
              width={64}
              height={64}
              className="shrink-0"
            />
            <p className="text-v1-caption text-v1-frost">
              Inngest is SOC 2 Type II compliant.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

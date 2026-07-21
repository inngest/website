import Image from "next/image";
import FormTestimonial from "@/components/v1/sections/shared/FormTestimonial";
import YCForm from "@/components/v1/sections/YC/YCForm";

// Mirrors the SalesInquiryForm/ContactForm hub pages: H1, then a 555/885
// grid — left column is intro copy + social proof, right column is the
// form. Sections are unchanged from the legacy /yc page (intro, form,
// Resend quote, SOC2, trusted-by logos); this is a visual port only.
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

      <div className="mt-12 grid grid-cols-1 gap-y-12 lg:mt-[34px] lg:grid-cols-[555fr_885fr] lg:items-stretch lg:gap-y-0">
        <div className="flex flex-col gap-12 lg:justify-between lg:gap-0 lg:pb-[120px] lg:pl-[90px] lg:pt-[44px]">
          <p className="text-v1-body-lg-loose text-v1-frost">
            Are you a Y Combinator company or alumni? Let us know here for
            access to the YC deal: the Pro plan free for the first year.
          </p>

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

            <div className="flex flex-col gap-6">
              <p className="text-v1-eyebrow text-v1-frost/60">Trusted by</p>
              <div className="flex flex-row flex-wrap items-center gap-8">
                <img
                  src="/assets/v1/logos/soundcloud.svg"
                  alt="SoundCloud"
                  className="h-6 w-auto opacity-70 hover:opacity-100"
                />
                <img
                  src="/assets/customers/conveo-logo-white.svg"
                  alt="Conveo"
                  className="h-7 w-auto opacity-70 hover:opacity-100"
                />
                <img
                  src="/assets/v1/logos/gitbook.svg"
                  alt="GitBook"
                  className="h-6 w-auto opacity-70 hover:opacity-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[4px] border border-v1-steel/20 bg-v1-surfaceElevated p-6 sm:p-8 lg:p-10">
          <YCForm />
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import FormTestimonial from "@/components/v1/sections/shared/FormTestimonial";
import StartupForm from "./StartupForm";
import { PROGRAM_RULES } from "./program";

const linkClassName = "underline hover:text-v1-frost/80";

// Same layout as the /yc page: H1 and intro across the full width, then
// a grid with the application form on the left and the offer, criteria,
// and social proof on the right.
export default function Hero() {
  return (
    <section
      aria-labelledby="startups-hero-heading"
      className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-[88px] text-v1-frost sm:px-9 sm:pb-[100px] sm:pt-[104px] lg:px-0 lg:pb-[10px] lg:pt-[144px]"
    >
      <h1
        id="startups-hero-heading"
        className="text-v1-display-sm text-center font-v1Display uppercase leading-[1.25] tracking-[-0.01em] [font-size:clamp(2.5rem,7.5vw,5rem)] lg:px-[70px]"
      >
        Startup Program
      </h1>

      <p className="text-v1-body-lg-loose mx-auto mt-6 max-w-[760px] text-center text-v1-frost lg:mt-8">
        Building something new? Qualifying startups get the Inngest Pro plan
        free for the first year. Bootstrapped or venture-backed, the offer is
        the same.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-y-12 lg:mt-[52px] lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-x-12 lg:gap-y-0 lg:px-[70px]">
        <div className="max-w-[600px] rounded-[4px] border border-v1-steel/20 bg-v1-surfaceElevated p-6 sm:p-8">
          <StartupForm />
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-v1-heading-sm text-v1-frost">What you get</h2>
            <p className="text-v1-body-sm-loose text-v1-frost/80">
              Twelve months of the Pro plan at no cost, with all of its features
              and included limits. Usage above those limits is billed at
              standard Pro rates.{" "}
              <a href="/pricing?ref=startups" className={linkClassName}>
                Compare plans
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-4 border-t border-v1-steel/20 pt-8">
            <h2 className="text-v1-heading-sm text-v1-frost">Who qualifies</h2>
            <ul className="text-v1-body-sm-loose flex list-disc flex-col gap-2 pl-5 text-v1-frost/80">
              <li>
                Founded in the last {PROGRAM_RULES.maxCompanyAgeYears} years
              </li>
              <li>Fewer than {PROGRAM_RULES.maxEmployees} employees</li>
              <li>
                Bootstrapped, or raised through {PROGRAM_RULES.maxStageLabel}{" "}
                with less than {PROGRAM_RULES.maxRaisedLabel} in total
              </li>
              <li>
                Not on a paid Inngest plan yet (Free plan accounts are welcome)
              </li>
              <li>
                A payment method on your Inngest account, so usage above Pro
                limits can be billed
              </li>
            </ul>
            <p className="text-v1-body-sm-loose text-v1-frost/80">
              In Y Combinator?{" "}
              <a href="/yc?ref=startups" className={linkClassName}>
                Request the YC deal
              </a>{" "}
              instead.
            </p>
          </div>

          <div className="border-t border-v1-steel/20 pt-8">
            <FormTestimonial />
          </div>

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

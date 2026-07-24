"use client";

import { useState } from "react";
import { Accordion } from "@/components/v1/sections/shared/Accordion";
import { INTEREST_OPTIONS, RadioOption, type Interest } from "@/components/v1/forms";
import FormTestimonial from "@/components/v1/sections/shared/FormTestimonial";
import TopicItem from "@/components/v1/sections/ContactForm/TopicItem";
import {
  GENERAL_TOPICS,
  SALES_TOPICS,
} from "@/components/v1/sections/ContactForm/topics";

export default function Hero() {
  const [interest, setInterest] = useState<Interest>("general");
  const topics = interest === "sales" ? SALES_TOPICS : GENERAL_TOPICS;

  return (
    <section
      aria-labelledby="contact-form-hero-heading"
      className="isolate mx-auto w-full max-w-[1440px] px-6 pb-[120px] pt-16 text-v1-frost sm:px-9 sm:pb-40 sm:pt-[88px] lg:px-[70px] lg:pb-[220px] lg:pt-[164px]"
    >
      <div className="relative z-10">
        <h1
          id="contact-form-hero-heading"
          // text-v1-display-sm carries the cap-trim with the cross-browser
          // ::before/::after fallback (manual [text-box-trim] only works
          // where native text-box-trim is supported). leading-[1.25] keeps
          // the token's trim calibration (it's tuned for 1.25 leading).
          className="pt-8 text-v1-display-sm uppercase leading-[1.25] tracking-[-0.01em] [font-size:clamp(2.5rem,7.5vw,5rem)] sm:pt-0"
        >
          Get in touch
        </h1>

        {/* Two columns: left = how-to-reach-us intro, right = the
            "what are you looking for" filter + collapsible topic list.
            Stacks to a single column below lg. */}
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 lg:mt-[112px] lg:grid-cols-[555fr_885fr]">
          <div className="flex flex-col gap-12 lg:justify-between lg:gap-0 lg:pb-[120px] lg:pl-[20px]">
            <p className="text-v1-body-lg-loose text-v1-frost">
              Find the right way to reach us →
            </p>

            <FormTestimonial />
          </div>

          <div className="flex flex-col gap-6">
            <fieldset className="flex flex-col gap-2 border-0 p-0">
              <legend className="p-0 text-v1-body-lg-loose text-v1-frost">
                What are you looking for?
              </legend>
              <div className="mt-1.5 flex flex-col gap-2 px-3">
                {INTEREST_OPTIONS.map((opt) => (
                  <RadioOption
                    key={opt.value}
                    name="interest"
                    value={opt.value}
                    label={opt.label}
                    checked={interest === opt.value}
                    onChange={() => setInterest(opt.value)}
                  />
                ))}
              </div>
            </fieldset>

            {/* Single-open accordion; `resetKey={interest}` collapses
                everything when the filter swaps the topic set, so a
                left-open row can't reveal mismatched copy. */}
            <Accordion resetKey={interest}>
              <ul className="flex list-none flex-col pl-0 lg:min-h-[629px]">
                {topics.map((t) => (
                  <TopicItem key={t.title} topic={t} />
                ))}
              </ul>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

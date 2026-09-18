import Image from "next/image";
import { V1_SECTION_GUTTER_X } from "@/components/v1/sections/shared/sectionShell";

// Sully Omar / Cohere pull-quote between the plan cards and the
// calculator. Unboxed full-bleed band — sheen texture on elevated
// charcoal, content aligned to the page rail.

export default function SavingsQuote() {
  return (
    <section
      aria-label="Sully Omar on Inngest"
      className="v1-textured w-full bg-v1-surfaceElevated py-6 lg:py-8"
      style={{ ["--v1-textured-pos" as string]: "20% 70%" }}
    >
      <figure
        className={`relative mx-auto flex w-full max-w-[1440px] flex-col gap-4 ${V1_SECTION_GUTTER_X}`}
      >
        <Image
          src="/assets/v1/logos/cohere.svg"
          alt="Cohere"
          width={208}
          height={32}
          className="mx-auto h-4 w-auto sm:h-5"
        />
        <div className="flex items-center gap-5 sm:gap-8 lg:gap-10">
          <div className="relative h-[112px] w-[96px] shrink-0 overflow-hidden sm:h-[128px] sm:w-[108px]">
            <Image
              src="/assets/v1/customers/otto-sully-omar.png"
              alt="Sully Omar, Co-founder of Otto, acquired by Cohere"
              fill
              sizes="108px"
              className="object-cover object-[center_18%]"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 sm:gap-2.5">
            <blockquote className="font-v1Heading text-[16px] leading-[1.4] tracking-[-0.01em] text-v1-frost sm:text-[20px] sm:leading-[1.35] lg:text-[22px]">
              &ldquo;Inngest completely transformed how Otto (by Cohere)
              handles AI orchestration. What would have taken us a month
              on other providers we evaluated took us only a couple
              hours.&rdquo;
            </blockquote>
            <figcaption className="flex flex-wrap items-baseline gap-x-2 text-v1-body-sm leading-tight">
              <span className="text-v1-frost">Sully Omar</span>
              <span className="text-v1-frost/70">
                Co-founder, Otto (acquired by Cohere)
              </span>
            </figcaption>
          </div>
        </div>
      </figure>
    </section>
  );
}

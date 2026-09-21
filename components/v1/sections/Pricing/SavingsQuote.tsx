import Image from "next/image";
import { V1_SECTION_GUTTER_X } from "@/components/v1/sections/shared/sectionShell";

// Sully Omar / Cohere pull-quote between the plan cards and the
// calculator. No background band — the quote sits on the page canvas
// so it doesn't compete with the cards above or the calculator below.

export default function SavingsQuote() {
  return (
    <section
      aria-label="Sully Omar on Inngest"
      className={`mx-auto w-full max-w-[1440px] ${V1_SECTION_GUTTER_X} py-8 lg:py-10`}
    >
      <figure className="mx-auto flex w-full flex-col items-center gap-4 text-center lg:gap-5">
        <Image
          src="/assets/v1/logos/cohere.svg"
          alt="Cohere"
          width={208}
          height={32}
          className="h-4 w-auto sm:h-5"
        />
        <blockquote className="font-v1Body font-normal text-[16px] leading-[1.5] text-v1-frost sm:text-[18px] sm:leading-[1.5]">
          <span className="lg:block lg:whitespace-nowrap">
            &ldquo;Inngest completely transformed how Otto (by Cohere)
            handles AI orchestration.
          </span>{" "}
          <span className="lg:block lg:whitespace-nowrap">
            What would have taken us a month on other providers we
            evaluated took us only a couple hours.&rdquo;
          </span>
        </blockquote>
        <figcaption className="flex items-center gap-3">
          <Image
            src="/assets/v1/customers/otto-sully-omar.png"
            alt="Sully Omar, Co-founder of Otto, acquired by Cohere"
            width={48}
            height={48}
            className="size-12 rounded-full object-cover object-[center_18%]"
          />
          <div className="flex flex-col items-start text-left text-v1-body-sm leading-tight">
            <span className="text-v1-frost">Sully Omar</span>
            <span className="text-v1-frost/70">
              Co-founder, Otto (acquired by Cohere)
            </span>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

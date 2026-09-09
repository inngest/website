import CodeBlock from "@/components/v1/sections/shared/CodeBlock";
import HoverCardShell from "@/components/v1/sections/shared/HoverCardShell";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { appendRef } from "@/utils/v1/ref";
import {
  KEEP_GOING_CODE,
  PAGE_REF,
  QUICKSTARTS,
  RESOURCE_LINKS,
} from "@/components/v1/sections/CodeTV/data";

export default function ResourceKit() {
  return (
    <Section
      id="resource-kit"
      aria-labelledby="codetv-kit-heading"
      className="scroll-mt-28"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="codetv-kit-heading"
        eyebrow="Resource kit"
        title="Everything you need to ship it."
        body="Same stack the teams used on set: a quickstart, a function that sleeps and waits, and the docs for the primitives behind it."
        bodyClassName="max-w-[640px]"
      />

      <ul
        className={`${V1_HEADER_CONTENT_MT} grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-3 lg:gap-y-8`}
      >
        {QUICKSTARTS.map((q) => (
          <li key={q.title}>
            <HoverCardShell
              href={appendRef(q.href, `${PAGE_REF}-kit`)}
              className="-mx-4 gap-8 px-4 pb-6 pt-5 lg:mx-0"
            >
              <div className="flex flex-col gap-2.5">
                <p className="text-v1-label-md uppercase motion-safe:transition-colors motion-safe:duration-[400ms] group-hover:text-v1-accent-salmon">
                  {q.eyebrow}
                </p>
                <h3 className="mt-1 font-whyte text-[24px] font-normal leading-[32px] lg:text-[32px]">
                  {q.title}
                </h3>
              </div>
              <span className="text-v1-label-md uppercase motion-safe:transition-colors motion-safe:duration-300 group-hover:text-v1-accent-salmon">
                Get started
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover:translate-x-[6px]"
                >
                  →
                </span>
              </span>
            </HoverCardShell>
          </li>
        ))}
      </ul>

      <div className={`${V1_HEADER_CONTENT_MT} grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12`}>
        <div className="lg:col-span-7">
          <p className="mb-4 text-v1-label-md uppercase text-v1-frost">
            Starter code
          </p>
          <CodeBlock
            label="keep-going.ts"
            lines={KEEP_GOING_CODE}
            animate={false}
            caret={false}
            maxHeight="none"
            maxWidth="100%"
          />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <p className="text-v1-label-md uppercase text-v1-frost">
            The primitives
          </p>
          <ul className="flex flex-col">
            {RESOURCE_LINKS.map((link) => (
              <li key={link.href} className="border-t border-v1-subtle last:border-b">
                <a
                  href={appendRef(link.href, `${PAGE_REF}-kit`)}
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="flex flex-col gap-1">
                    <span className="font-v1Label text-[12px] uppercase tracking-[0.06em] text-v1-frost motion-safe:transition-colors group-hover:text-v1-accent-salmon">
                      {link.title}
                    </span>
                    <span className="text-v1-body-sm text-v1-frost/60">
                      {link.body}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-v1Label text-[12px] text-v1-frost/40 motion-safe:transition-transform motion-safe:duration-[400ms] group-hover:translate-x-[4px] group-hover:text-v1-accent-salmon"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
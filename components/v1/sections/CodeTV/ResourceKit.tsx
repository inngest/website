import ButtonLink from "@/components/v1/ButtonLink";
import CodeBlock from "@/components/v1/sections/shared/CodeBlock";
import HoverCardShell from "@/components/v1/sections/shared/HoverCardShell";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import {
  V1_HEADER_CONTENT_MT,
  V1_SECTION_PADDING_Y_COMPACT,
} from "@/components/v1/sections/shared/sectionShell";
import { cn } from "@/utils/v1/cn";
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
      className={`scroll-mt-28 bg-v1-canvasMuted ${V1_SECTION_PADDING_Y_COMPACT}`}
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="codetv-kit-heading"
        eyebrow="Resource kit"
        title="Start building"
        body="Same stack the teams used on set: a quickstart, a function that sleeps and waits, and the docs for the primitives behind it."
        bodyClassName="max-w-[640px]"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink
              href={appendRef("/sign-up", "hackathon")}
              variant="accent"
              prefetch={false}
            >
              Build Free
            </ButtonLink>
            <ButtonLink
              href={appendRef("/docs", `${PAGE_REF}-kit`)}
              variant="secondary"
            >
              Read the Docs
            </ButtonLink>
          </div>
        }
      />

      <ul
        className={`${V1_HEADER_CONTENT_MT} grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-3 lg:gap-y-8`}
      >
        {QUICKSTARTS.map((q) => (
          <li key={q.title}>
            <HoverCardShell
              href={appendRef(q.href, `${PAGE_REF}-kit`)}
              className="gap-6 !border-v1-frost/20 bg-v1-surfaceElevated px-5 pb-6 pt-5 lg:px-6"
            >
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
                <img
                  src={q.logo}
                  alt=""
                  className={cn(
                    "h-12 w-12 object-contain",
                    q.invert && "invert"
                  )}
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-v1-label-md uppercase group-hover:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-[400ms]">
                  {q.eyebrow}
                </p>
                <h3 className="mt-1 font-whyte text-[24px] font-normal leading-[32px] lg:text-[32px]">
                  {q.title}
                </h3>
              </div>
              <span className="text-v1-label-md uppercase group-hover:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-300">
                Get started
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block group-hover:translate-x-[6px] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in"
                >
                  →
                </span>
              </span>
            </HoverCardShell>
          </li>
        ))}
      </ul>

      <div
        className={`${V1_HEADER_CONTENT_MT} grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12`}
      >
        <div className="lg:col-span-7">
          <p className="text-v1-label-md mb-4 uppercase text-v1-frost">
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
              <li
                key={link.href}
                className="border-t border-v1-frost/15 last:border-b"
              >
                <a
                  href={appendRef(link.href, `${PAGE_REF}-kit`)}
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="flex flex-col gap-1">
                    <span className="font-v1Label text-[12px] uppercase tracking-[0.06em] text-v1-frost group-hover:text-v1-accent-salmon motion-safe:transition-colors">
                      {link.title}
                    </span>
                    <span className="text-v1-body-sm text-v1-frost/60">
                      {link.body}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-v1Label text-[12px] text-v1-frost/40 group-hover:translate-x-[4px] group-hover:text-v1-accent-salmon motion-safe:transition-transform motion-safe:duration-[400ms]"
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

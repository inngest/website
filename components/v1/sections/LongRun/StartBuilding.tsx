import { appendRef } from "@/utils/v1/ref";
import { cn } from "@/utils/v1/cn";
import HoverCardShell from "@/components/v1/sections/shared/HoverCardShell";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { HOME_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { LR_QUICKSTARTS } from "@/components/v1/sections/LongRun/data";

/**
 * The /long-run page's own "Start building" section: the shared
 * Home/StartBuilding layout, but each quickstart card leads with the
 * framework's logo beside its name and a salmon "Get started" link, per
 * the design. Kept local so the homepage, SF and NYC cards don't change.
 */
export default function StartBuilding({
  refTag,
  title = "Start building.",
  body = "Pick a quickstart",
  className,
}: {
  refTag: string;
  title?: string;
  body?: string;
  className?: string;
}) {
  return (
    <Section
      aria-label="Start building"
      className={cn("relative", className)}
      containerClassName="flex flex-col gap-[58px]"
    >
      <SectionHeader
        className="!gap-5 lg:pl-4"
        titleClassName={cn(HOME_SECTION_TITLE, "text-balance normal-case")}
        title={title}
        body={body}
        bodyClassName="text-v1-heading-sm text-v1-frost"
      />

      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {LR_QUICKSTARTS.map((q) => (
          <li key={q.title}>
            <HoverCardShell
              href={appendRef(q.href, refTag)}
              className="gap-4 border-v1-frost/15 bg-v1-surfaceElevated px-5 pb-6 pt-5 hover:border-v1-frost/40 lg:px-6"
            >
              {/* Same rollover as the shared cards: a salmon tick grows in
                  before the eyebrow and the eyebrow turns salmon. `mr-2`
                  animates with the width (rather than a flex gap) so the
                  row stays collapsed at rest. */}
              <div className="flex items-center">
                <span
                  aria-hidden="true"
                  className="block h-[10px] w-0 origin-center scale-y-0 bg-v1-accent-salmon ease-v1-in group-hover:mr-2 group-hover:w-[2px] group-hover:scale-y-100 motion-safe:transition-[width,margin,transform] motion-safe:duration-[450ms]"
                />
                <p className="text-v1-label-md uppercase text-v1-frost/80 group-hover:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-[400ms]">
                  {q.eyebrow}
                </p>
              </div>
              <h3 className="flex items-center gap-3 font-whyte text-[28px] font-normal leading-none text-v1-frost lg:text-[36px]">
                {/* Decorative: the framework is named right beside it. */}
                <img
                  src={q.logo}
                  alt=""
                  width={40}
                  height={40}
                  className={cn(
                    "size-8 shrink-0 object-contain lg:size-10",
                    q.invert && "invert"
                  )}
                />
                {q.title}
              </h3>
              <span className="font-whyte text-[18px] leading-none text-v1-accent-salmon lg:text-[22px]">
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
    </Section>
  );
}

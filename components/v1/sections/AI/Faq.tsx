"use client";

import { motion } from "motion/react";
import Link from "@/components/v1/Link";
import { appendRef } from "@/utils/v1/ref";
import {
  Accordion,
  AccordionDot,
  AccordionItem,
} from "@/components/v1/sections/shared/Accordion";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { AI_PAGE_FAQS, type Faq } from "@/components/v1/sections/AI/faqData";

export type { Faq };
export { AI_PAGE_FAQS };

/**
 * AI page "FAQ" section — display headline on the left (1/3) paired
 * with a single-open accordion on the right (2/3). Each row's
 * disclosure dot turns salmon when expanded, grey when collapsed —
 * same dot vocabulary as Home's TrustedInBigLeagues and AI's
 * UseCases. Only one row is open at a time; clicking the active row
 * collapses it.
 */

/**
 * Reusable across landing pages. Defaults to the AI-page FAQ set
 * (`FAQS`) so existing call sites work unchanged; pass `faqs` to
 * override for other pages (e.g. /scheduled-jobs).
 */
export default function Faq({
  faqs = AI_PAGE_FAQS,
  heading = "FAQ",
  refTag = "ai",
}: {
  faqs?: Faq[];
  heading?: string;
  refTag?: string;
} = {}) {
  return (
    <Section
      aria-label="Frequently asked questions"
      className="relative"
      containerClassName="grid grid-cols-1 gap-x-4 gap-y-12 lg:grid-cols-3 lg:items-start"
    >
      <motion.h2
        {...reveals.heading}
        className={cn(V1_SECTION_TITLE, "lg:sticky lg:top-[22vh] lg:self-start")}
      >
        {heading}
      </motion.h2>

      <Accordion defaultOpenId={faqs[0]?.id ?? null}>
        <ul className="flex flex-col lg:col-span-2">
          {faqs.map((faq, i) => (
            <motion.li key={faq.id} {...reveals.item(i)}>
              <FaqRow faq={faq} refTag={refTag} />
            </motion.li>
          ))}
        </ul>
      </Accordion>
    </Section>
  );
}

function FaqRow({ faq, refTag }: { faq: Faq; refTag: string }) {
  return (
    <AccordionItem
      id={faq.id}
      // Horizontal chrome only — the spotlight sheen, group, transition,
      // baseline hover fill, and vertical rhythm come from the styled
      // AccordionItem.
      className="px-4"
      triggerClassName="gap-[10px]"
      bodyClassName="mt-4 flex flex-col gap-6 pl-[34px] pr-[45px] pb-1.5"
      trigger={(open) => (
        <>
          {/* Box reserves a 24px gutter and inherits the title's
              font-size + 1.45 line-height, so the dot centers on the
              first line for both single- and multi-line questions. */}
          <AccordionDot
            open={open}
            className="w-[24px] text-[18px] leading-[1.45] [height:1.45em] lg:[font-size:clamp(1rem,1.4vw,1.375rem)]"
          />
          <span className="flex-1 text-balance font-v1Heading text-[18px] leading-[1.45] tracking-[-0.01em] lg:[font-size:clamp(1rem,1.4vw,1.375rem)]">
            {faq.questionLines ? (
              faq.questionLines.map((line, i) => (
                <span key={i} className="lg:block lg:whitespace-nowrap">
                  {line}
                  {i < (faq.questionLines?.length ?? 0) - 1 ? " " : ""}
                </span>
              ))
            ) : (
              faq.question
            )}
          </span>
        </>
      )}
    >
      <p className="text-pretty text-v1-body-sm">{faq.answer}</p>
      {faq.link && (
        <Link
          href={appendRef(faq.link.href, refTag)}
          underline={false}
          // Same exact "Get Started →" treatment as Home/
          // StartBuilding's QuickstartCard. Color shift uses
          // `hover:` directly on the anchor (an element can't
          // be its own group-hover descendant — that was the
          // earlier bug); arrow translate keeps `group-hover/cta`
          // since the arrow IS a descendant of the group.
          // Closed-row links drop out of tab order via the panel's
          // `inert`, so no per-link tabIndex needed.
          className="text-v1-label-md group/cta inline-flex w-fit items-center uppercase motion-safe:transition-colors motion-safe:duration-300 hover:text-v1-accent-salmon"
        >
          <span>{faq.link.label}</span>
          <span
            aria-hidden="true"
            className="ml-2 inline-block motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover/cta:translate-x-[6px]"
          >
            →
          </span>
        </Link>
      )}
    </AccordionItem>
  );
}

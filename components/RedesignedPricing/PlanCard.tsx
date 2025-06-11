"use client";

import React, { useState, useEffect } from "react";
import { Button } from "src/components/RedesignedLanding/Button";
import { type Plan } from "./plans";
import {
  RiGitPrDraftLine,
  RiMistLine,
  RiCheckLine,
  RiArrowDownSLine,
  RiDiscussLine,
} from "@remixicon/react";
import * as Accordion from "@radix-ui/react-accordion";
import classNames from "src/utils/classNames";
import Link from "next/link";
import { cn } from "../utils/classNames";

const CLOSED_VALUE = "CLOSED";
export default function PlanCard({
  content,
  idx,
  total,
}: {
  content: Plan;
  idx: number;
  total: number;
}) {
  // Solves the radix bug on undefined values in single accordions https://github.com/radix-ui/primitives/discussions/824
  const [accordionValue, setAccordionValue] = useState(CLOSED_VALUE);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  const price = content.cost.between
    ? // Note: If we start showing basic free tier on PlanCard, we should use the following commented line instead
      `$${content.cost.basePrice}-${content.cost.endPrice}`
    : // ? `$${content.cost.basePrice}-${content.cost.endPrice}`
      content.cost.basePrice;

  return (
    <div
      className={classNames(
        `z-10 flex w-full flex-col justify-between text-left`,
        `rounded-lg md:rounded-l-none md:rounded-r-none md:first:rounded-l-lg md:last:rounded-r-lg`
      )}
    >
      <div
        className={classNames(
          `h-full bg-stone-900 px-6 py-8`,
          // Mobile: full border since cards stack vertically
          "border border-stone-600",
          // Desktop: conditional borders to prevent overlap
          "md:border-b md:border-l-0 md:border-r md:border-t",
          // First card in each row gets left border
          // md breakpoint: 2 columns, so cards 0, 2, 4... get left border
          idx % 2 === 0 && "md:border-l",
          // lg breakpoint: 3 columns, so cards 0, 3, 6... get left border
          idx % 3 === 0 && "lg:border-l",
          // Override md left border for lg when not first in lg row
          idx % 3 !== 0 && "lg:border-l-0"
        )}
      >
        {/* Prevent weird button wrap on enterprise from mis-aligning rows */}
        <div className="sm:min-h-[272px] min-[933px]:min-h-[252px] min-[1272px]:min-h-0">
          <h2 className="font-whyte text-3xl font-light text-white">
            {content.name}
          </h2>
          <p className="max-w-[250px] font-circular text-sm font-normal leading-[1.5] tracking-[-0.266px] text-stone-200">
            {content.description}
          </p>
          {content.cost.between ? (
            <p className="pt-4 text-xs font-bold uppercase text-inngestLux">
              Between
            </p>
          ) : content.cost.startsAt ? (
            <p className="pt-4 text-xs font-bold uppercase text-inngestLux">
              Starting at
            </p>
          ) : (
            <p className="pt-4 text-xs font-bold uppercase text-inngestLux">
              To learn more
            </p>
          )}
          <p className="font-whyte text-[40px] font-light leading-[1.2] tracking-[-2px] text-[#FAFAF9]">
            {typeof price === "string" ? price : "$" + price}
            <span
              className={`font-circular text-[24px] font-normal leading-[32px] text-[#FAFAF9]`}
            >
              {!!content.cost.period ? `/${content.cost.period}` : ""}
            </span>
          </p>
          <div className="my-8">
            <Button
              variant={content.primaryCTA ? "default" : "outline"}
              className={cn(
                content.primaryCTA
                  ? "bg-inngestLux"
                  : "border border-stone-600 bg-stone-900",
                "w-full"
              )}
              asChild
            >
              <Link href={content.cta.href}>{content.cta.text}</Link>
            </Button>
          </div>
          <hr className="border-muted " />
          <p className="pb-2 pt-6 font-circular text-sm font-[450] leading-5 text-inngestLux">
            INCLUDED USAGE
          </p>
          <div className="flex items-center gap-2">
            <RiMistLine className="text-inngestLux" />
            <div className="font-circular text-lg font-light leading-[1.4] text-stone-50">
              <span className="font-circular text-lg font-bold leading-[25.2px] text-stone-50">
                {content.highlights.runs.split(" ")[0]}
              </span>{" "}
              {content.highlights.runs.split(" ").slice(1).join(" ")}
            </div>
          </div>
          <hr className="my-2 w-11 border-muted" />
          <div className="mb-2 flex items-center gap-2">
            <RiGitPrDraftLine className="rotate-90 text-inngestLux" />
            <div className="font-circular text-lg font-light leading-[1.4] text-stone-50">
              <span className="font-circular text-lg font-bold leading-[25.2px] text-stone-50">
                {content.highlights.concurrency.split(" ")[0]}
              </span>{" "}
              {content.highlights.concurrency.split(" ").slice(1).join(" ")}
            </div>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <RiDiscussLine className="text-inngestLux" />
            <div className="font-circular text-lg font-light leading-[1.4] text-stone-50">
              <span className="font-circular text-lg font-bold leading-[25.2px] text-stone-50">
                {content.highlights.realtime.split(" ")[0]}
              </span>{" "}
              {content.highlights.realtime.split(" ").slice(1).join(" ")}
            </div>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <RiGitPrDraftLine className="rotate-90 text-inngestLux" />
            <div className="font-circular text-lg font-light leading-[1.4] text-stone-50">
              <span className="font-circular text-lg font-bold leading-[25.2px] text-stone-50">
                {content.highlights.users.split(" ")[0]}
              </span>{" "}
              {content.highlights.users.split(" ").slice(1).join(" ")}
            </div>
          </div>
        </div>

        <hr className="my-2 border-subtle" />

        {/* Desktop */}
        <div className="hidden md:block">
          <p className="text-inngestLux">FEATURES</p>
          <ul className="flex flex-col">
            {content.features.map((feature, i) => (
              <li
                key={i}
                className={`flex gap-2 py-2 font-circular text-lg font-light leading-[25.2px] text-stone-50 last:pb-0`}
              >
                <RiCheckLine className="text-matcha-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile */}
        <Accordion.Root
          type="single"
          value={accordionValue}
          onValueChange={(value) => {
            setAccordionValue(value || CLOSED_VALUE);
          }}
          collapsible
          className="md:hidden"
        >
          <Accordion.Item value={content.name}>
            <Accordion.Header className="flex items-center justify-between">
              <p className="text-inngestLux">{content.planIncludes}</p>
              <Accordion.Trigger className="group overflow-hidden rounded-full border border-contrast md:hidden">
                <RiArrowDownSLine className="transform-90 bg-canvasBase text-muted transition-transform duration-500 group-hover:bg-canvasSubtle group-data-[state=open]:-rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <ul className="flex flex-col">
                {content.features.map((feature, i) => (
                  <li key={i} className={`flex gap-2 py-2 last:pb-0`}>
                    <RiCheckLine className="text-matcha-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
}

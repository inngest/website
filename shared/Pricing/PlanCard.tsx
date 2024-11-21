"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../Button";
import { type Plan } from "../../pages/pricing";
import {
  RiGitPrDraftLine,
  RiMistLine,
  RiCheckLine,
  RiArrowDownSLine,
} from "@remixicon/react";
import * as Accordion from "@radix-ui/react-accordion";
import classNames from "src/utils/classNames";

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleMediaQueryChange = (e) => {
      setIsMediumScreen(e.matches);
      if (e.matches) {
        setAccordionValue(content.name);
      }
    };

    setIsMediumScreen(mediaQuery.matches);
    if (mediaQuery.matches) {
      setAccordionValue(content.name);
    }

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, [content.name]);

  const price = content.cost.between
    ? // Note: If we start showing basic free tier on PlanCard, we should use the following commented line instead
      `$${content.cost.basePrice}-${content.cost.endPrice}`
    : // ? `$${content.cost.basePrice}-${content.cost.endPrice}`
      content.cost.basePrice;

  return (
    <div
      className={classNames(
        `w-full flex flex-col justify-between text-left`,
        `rounded-lg md:rounded-l-none md:rounded-r-none md:first:rounded-l-lg md:last:rounded-r-lg`
      )}
    >
      <div
        className={classNames(
          `h-full py-8 px-6 border bg-canvasBase`,
          content.recommended ? "border-matcha-400" : "border-muted",
          `rounded-2xl`,
          idx === 0 && "xl:rounded-r-none",
          idx > 0 && idx < total - 1 && "xl:rounded-none",
          idx === total - 1 && "xl:rounded-l-none"
        )}
      >
        {content.recommended && (
          <div className="-mt-10 mb-3.5 block text-center">
            <div className="bg-gradient-to-b from-matcha-400 to-breeze-400 inline-block shadow-lg rounded-full text-onContrast text-sm font-semibold tracking-tight py-0.5 px-2">
              Recommended
            </div>
          </div>
        )}
        {/* Prevent weird button wrap on enterprise from mis-aligning rows */}
        <div className="sm:min-h-[272px] min-[933px]:min-h-[252px] min-[1272px]:min-h-0">
          <h2 className="text-3xl font-semibold">{content.name}</h2>
          <p className="text-sm pt-2">{content.description}</p>
          {content.cost.between ? (
            <p className="uppercase font-bold text-xs bg-gradient-to-b from-matcha-400 to-breeze-400 bg-clip-text text-transparent pt-4">
              Between
            </p>
          ) : content.cost.startsAt ? (
            <p className="uppercase font-bold text-xs bg-gradient-to-b from-matcha-400 to-breeze-400 bg-clip-text text-transparent pt-4">
              Starting at
            </p>
          ) : (
            <div className="pt-8" />
          )}
          <p
            className={`${
              typeof content.cost.basePrice === "string"
                ? "text-2xl leading-9 lg:text-5xl lg:leading-[3.75rem]"
                : "text-3xl	lg:text-6xl"
            } mt-4 font-medium tracking-tight`}
          >
            {typeof price === "string" ? price : "$" + price}
            <span className={`text-xl lg:text-2xl font-normal ml-0.5 `}>
              {!!content.cost.period ? `/${content.cost.period}` : ""}
            </span>
          </p>

          <div className="my-8">
            <Button
              href={content.cta.href}
              full
              variant={content.primaryCTA ? "primary" : "outline"}
              className={
                content.recommended &&
                "border border-transparent bg-primary-intense"
              }
            >
              {content.cta.text}
            </Button>
          </div>

          <hr className="border-muted my-8" />

          <p className="flex items-center gap-2 mb-3">
            <RiMistLine className="text-muted" />
            {content.highlights.runs}
          </p>
          <p className="flex items-center gap-2  mb-3">
            <RiGitPrDraftLine className="text-muted rotate-90" />
            {content.highlights.concurrency}
          </p>
        </div>

        <hr className="border-subtle my-8" />

        <Accordion.Root
          type="single"
          value={accordionValue}
          onValueChange={(value) => {
            if (!isMediumScreen) {
              setAccordionValue(value || CLOSED_VALUE);
            }
          }}
          collapsible
        >
          <Accordion.Item
            value={content.name}
            disabled={isMediumScreen}
            className={isMediumScreen ? "pointer-events-none" : ""}
          >
            <Accordion.Header className="flex items-center justify-between">
              <p className="font-medium text-xs bg-gradient-to-b from-matcha-400 to-breeze-400 bg-clip-text text-transparent pb-4">
                {content.planIncludes}
              </p>
              <Accordion.Trigger className="group border border-contrast rounded-full overflow-hidden md:hidden">
                <RiArrowDownSLine className="transform-90 bg-canvasBase text-muted group-hover:bg-canvasSubtle transition-transform duration-500 group-data-[state=open]:-rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <ul className="flex flex-col">
                {content.features.map((feature, i) => (
                  <li key={i} className={`flex gap-2 py-2 last:pb-0`}>
                    <RiCheckLine className="text-muted" />
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

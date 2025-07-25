"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/RedesignedLanding/Accordion";
import { Button } from "components/RedesignedLanding/Button";
import { cn } from "components/utils/classNames";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "components/RedesignedLanding/toggle-group";
import PrioritySVG from "./Priority";
import ConcurrencySVG from "./Concurrency";
import FairnessSVG from "./Fairness";
import FairnessWithoutInngestSVG from "./FairnessWithoutInngest";
import Lottie from "lottie-react";
import Fairness from "./Lottie/Fairness.json";
import WithoutInngest from "./Lottie/Without-Inngest.json";
import Concurrency from "./Lottie/Concurrency.json";
import Priority from "./Lottie/Priority.json";
import Link from "next/link";

export default function FlowAccordion() {
  const initialOpenItem = "item-1";
  const [openItemValue, setOpenItemValue] = useState<string>(initialOpenItem);

  // Toggle state for 'with Inngest' vs 'without Inngest' modes
  const [mode, setMode] = useState("with-inngest");

  // Handler to update the state when an accordion item is opened or closed
  const handleValueChange = (value: string) => {
    // For a collapsible single accordion, `value` is an empty string if all are closed.
    setOpenItemValue(value);
  };

  // Accordion items configuration
  const accordionItems = [
    {
      value: "item-1",
      triggerText: "Fairness",
      contentText:
        "Ensure fair resource distribution and eliminate noisy-neighbor issues to scale efficiently as your user base grows",
    },
    {
      value: "item-2",
      triggerText: "Concurrency",
      contentText:
        "Manage simultaneous requests effectively. Concurrency controls ensure your AI services remain responsive and stable under varying load conditions by intelligently queuing and processing tasks.",
    },
    {
      value: "item-3",
      triggerText: "Priority",
      contentText:
        "Allocate resources based on importance. Priority settings allow you to define which tasks or users get preferential treatment, ensuring critical operations are always handled swiftly.",
    },
  ];

  return (
    <>
      <div className="relative z-10 mx-auto mb-16 mt-20 flex max-w-7xl flex-col gap-8 bg-stone-950 p-8 lg:flex-row lg:items-start xl:gap-12">
        <div className="overflow-hidden text-gray-100 lg:flex-[3]">
          {/* Mode toggle visible for all sections */}
          <div className="mb-4 flex justify-center">
            <ToggleGroup
              type="single"
              defaultValue="with-inngest"
              value={mode}
              onValueChange={(value) => {
                if (value) setMode(value);
              }}
              className="rounded-full bg-neutral-800 p-1"
            >
              <ToggleGroupItem
                value="with-inngest"
                className="px-4 py-1.5 text-sm text-gray-300 hover:text-white data-[state=on]:rounded-full data-[state=on]:bg-neutral-700 data-[state=on]:text-white"
              >
                with Inngest
              </ToggleGroupItem>
              <ToggleGroupItem
                value="without-inngest"
                className="px-4 py-1.5 text-sm text-gray-300 hover:text-white data-[state=on]:rounded-full data-[state=on]:bg-neutral-700 data-[state=on]:text-white"
              >
                without Inngest
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex h-full w-full items-center justify-center">
            {openItemValue === "item-1" ? (
              mode === "with-inngest" ? (
                <Lottie animationData={Fairness} loop={true} />
              ) : (
                <Lottie animationData={WithoutInngest} loop={true} />
              )
            ) : openItemValue === "item-2" ? (
              mode === "with-inngest" ? (
                <Lottie animationData={Concurrency} loop={true} />
              ) : (
                <Lottie animationData={WithoutInngest} loop={true} />
              )
            ) : openItemValue === "item-3" ? (
              mode === "with-inngest" ? (
                <Lottie animationData={Priority} loop={true} />
              ) : (
                <Lottie animationData={WithoutInngest} loop={true} />
              )
            ) : (
              <Lottie animationData={Fairness} loop={true} />
            )}
          </div>
        </div>

        <div className="flex min-h-[420px] flex-col pb-8 text-stone-50 md:pt-0 lg:min-h-0 lg:flex-[2]">
          <h1 className="mb-3 font-whyte text-3xl font-light text-stone-50 md:text-4xl">
            Flow control
          </h1>
          <p className="mb-8 font-circular text-sm font-normal text-stone-300 md:text-base">
            Ensure that you all users get a great experience by dynamically
            allocating resources to your AI workflows with concurrency with
            keys, throttling and more
          </p>
          <Accordion
            type="single"
            collapsible={false}
            className="w-full"
            value={openItemValue}
            onValueChange={handleValueChange}
          >
            {accordionItems.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger
                  className={cn(
                    "pb-0 pt-4 text-left font-whyte text-xl font-light text-stone-500 hover:no-underline md:text-2xl",
                    "data-[state=open]:border-none data-[state=open]:text-stone-50"
                  )}
                >
                  {item.triggerText}
                </AccordionTrigger>
                <AccordionContent
                  className={cn(
                    "pb-4 pt-1 font-circular text-sm font-normal text-stone-300",
                    openItemValue === item.value && "border-b border-[#B7B7B7]"
                  )}
                >
                  {item.contentText}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-auto pt-8">
            <Button
              variant="outline"
              className="w-auto px-5 py-2.5 text-sm"
              asChild
            >
              <Link href="/docs/guides/flow-control?ref=homepage">
                Learn more
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/RedesignedLanding/Accordion";
import { Button } from "components/RedesignedLanding/Button";
import { cn } from "components/utils/classNames";
import { useState } from "react";
import CancellationSVG from "./Cancellation";
import MetricsSVG from "./Metrics";
import ReplaySVG from "./Replay";
import Link from "next/link";

export default function TestRecoverTools() {
  const initialOpenItem = "item-1";
  const [openItemValue, setOpenItemValue] = useState<string>(initialOpenItem);

  const handleValueChange = (value: string) => {
    setOpenItemValue(value);
  };

  const accordionItems = [
    {
      value: "item-1",
      triggerText: "Replay",
      contentText:
        "Recover from bugs or system issues by re-running failed workflows in bulk. Forget dead-letter queues.",
    },
    {
      value: "item-2",
      triggerText: "Bulk Cancellation",
      contentText:
        "Manage unanticipated backlogs or runaway failures by cancelling thousands of workflows in bulk. Fix the issue, then replay.",
    },
    {
      value: "item-3",
      triggerText: "Metrics",
      contentText:
        "Get full visibility over your workflows and agents with live traces and metrics",
    },
  ];

  return (
    <>
      <div className="relative z-10 mx-auto my-20 flex max-w-7xl flex-col gap-8 bg-stone-950 p-8 lg:flex-row lg:items-start xl:gap-12">
        <div className="overflow-hidden text-gray-100 lg:flex-[3]">
          {openItemValue === "item-1" && (
            <div className="flex w-full items-center justify-center">
              <ReplaySVG />
            </div>
          )}

          {openItemValue === "item-2" && (
            <div className="flex w-full items-center justify-center">
              <CancellationSVG />
            </div>
          )}

          {openItemValue === "item-3" && (
            <div className="flex w-full items-center justify-center">
              <MetricsSVG />
            </div>
          )}
        </div>

        <div className="flex min-h-[420px] flex-col pb-8 text-stone-50 md:pt-0 lg:min-h-0 lg:flex-[2]">
          <h1 className="mb-3 font-whyte text-3xl font-light text-stone-50 md:text-4xl">
            Recovery Tools
          </h1>
          <p className="mb-8 font-circular text-sm font-normal text-stone-300 md:text-base">
            Quickly identify any issue with the Inngest Cloud alerting and
            metrics and rapidly act on thousands of runs with Replay, Bulk
            Cancellation.
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
              <Link href="/docs/platform/replay?ref=homepage">Learn more</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

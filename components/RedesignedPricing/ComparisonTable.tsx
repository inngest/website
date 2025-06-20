"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  RiExternalLinkLine,
  RiCloseCircleFill,
  RiCheckboxCircleFill,
  RiArrowDownSLine,
  RiCheckboxFill,
} from "@remixicon/react";
import * as Accordion from "@radix-ui/react-accordion";

export default function ComparisonTable({ plans, features, sections }) {
  const [selectedPlan, setSelectedPlan] = useState(plans[0].name);

  const renderPlanTabs = () => (
    <div className="sticky top-14 z-10 mb-4 grid grid-cols-3 justify-center bg-stone-900 px-4 pt-4 md:hidden">
      {plans.map((plan, i) => (
        <button
          key={i}
          className={`border-b-2 border-disabled px-1.5 py-2 text-sm font-medium text-basis ${
            plan.name === "Pro" && "text-primary-intense"
          } ${
            plan.name === "Enterprise" &&
            "bg-gradient-to-b from-matcha-400 to-breeze-400 bg-clip-text text-transparent"
          } ${selectedPlan === plan.name && "border-b-carbon-0"}`}
          onClick={() => setSelectedPlan(plan.name)}
        >
          {plan.name === "Basic (free tier)" ? (
            <>
              Basic <div className="text-xs">(free tier)</div>
            </>
          ) : (
            plan.name
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-stone-900 px-4 py-24 text-basis">
      <h2 className="font-whyte-inktrap text-center text-[48px] font-normal leading-[1.2] tracking-[-2.4px] text-[#FAFAF9] md:py-11">
        Plan features
      </h2>
      {renderPlanTabs()}
      {sections.map((section) => {
        const sectionFeatures = features.filter(
          (feature) => feature.section === section.key
        );
        return sectionFeatures.length > 0 ? (
          <div key={section.key}>
            {renderTable(sectionFeatures, section.name, plans, selectedPlan)}
          </div>
        ) : null;
      })}
    </div>
  );
}

const renderTable = (sectionFeatures, sectionName, plans, selectedPlan) => {
  const CLOSED_VALUE = "CLOSED";
  // Solves the radix bug on undefined values in single accordions https://github.com/radix-ui/primitives/discussions/824
  // Initialize with the section name so that the accordion starts **open** on mobile.
  const [accordionValue, setAccordionValue] = useState(sectionName);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleMediaQueryChange = (e) => {
      setIsMediumScreen(e.matches);
      if (e.matches) {
        setAccordionValue(sectionName);
      }
    };

    setIsMediumScreen(mediaQuery.matches);
    if (mediaQuery.matches) {
      setAccordionValue(sectionName);
    }

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, [sectionName]);

  return (
    <Accordion.Root
      type="single"
      value={accordionValue}
      onValueChange={(value) => {
        if (!isMediumScreen) {
          setAccordionValue(value || CLOSED_VALUE);
        }
      }}
      className="bg-stone-900"
      collapsible
    >
      <Accordion.Item
        value={sectionName}
        disabled={isMediumScreen}
        className={isMediumScreen ? "" : ""}
      >
        <table className="mx-auto my-8 w-full max-w-[1222px] table-fixed text-left">
          <Accordion.Header asChild>
            <thead>
              {/* Sticky header height */}
              <tr className="top-[84px] border-b border-muted bg-stone-900 md:sticky">
                <th className="py-4 text-lg font-bold">{sectionName}</th>
                <th className="absolute right-6 py-4 md:hidden">
                  <Accordion.Trigger className="group overflow-hidden rounded-full border border-contrast">
                    <RiArrowDownSLine className="transform-90 bg-stone-900 text-muted transition-transform duration-500 group-hover:bg-canvasSubtle group-data-[state=open]:-rotate-180" />
                  </Accordion.Trigger>
                </th>
                {plans.map((plan, i) => (
                  <th
                    className={`hidden px-6 py-4 md:table-cell ${
                      plan.name === "Pro" && "text-[#B17A50]"
                    } ${plan.name === "Enterprise" && "text-matcha-500"}`}
                    key={i}
                  >
                    <h2 className="text-sm font-medium">{plan.name} </h2>
                  </th>
                ))}
              </tr>
            </thead>
          </Accordion.Header>
          <Accordion.Content asChild>
            <tbody>
              {sectionFeatures.map((feature, i) => (
                <tr
                  key={i}
                  className="h-11 border-t border-subtle last:border-b"
                >
                  <td className="py-3 text-sm">
                    <div className="font-medium">
                      {feature.name}
                      {Boolean(feature.infoUrl) && (
                        <Link
                          href={feature.infoUrl}
                          target="_blank"
                          className="ml-1 inline-flex align-text-top text-muted transition-all hover:text-white"
                        >
                          <RiExternalLinkLine className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                    {feature.description && (
                      <div className="mt-0.5 text-muted">
                        {feature.description}
                      </div>
                    )}
                  </td>
                  {plans.map((plan, j) => {
                    const planValue = feature.plans?.[plan.name] ?? feature.all;

                    let value = null;
                    let description = null;
                    let bool = null;

                    if (typeof planValue === "string") {
                      value = planValue;
                    } else if (typeof planValue === "boolean") {
                      bool = planValue;
                    } else if (planValue && typeof planValue === "object") {
                      value = planValue.value;
                      description = planValue.description;
                    }

                    return (
                      <td
                        key={j}
                        className={`px-6 text-sm font-medium ${
                          plan.name !== selectedPlan
                            ? "hidden md:table-cell"
                            : ""
                        }`}
                      >
                        {value ? (
                          <>
                            {value}
                            {description && (
                              <div className="mt-0.5 text-muted">
                                {description}
                              </div>
                            )}
                          </>
                        ) : bool !== null ? (
                          bool ? (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z"
                                fill="#027A48"
                              />
                              <path
                                d="M7.94999 10.6653L12.7758 5.83899L13.5187 6.58134L7.94999 12.15L4.60889 8.80891L5.35124 8.06656L7.94999 10.6653Z"
                                fill="#FBFAF5"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width="14" height="14" fill="#44403C" />
                              <path
                                d="M6.99979 6.25769L9.59854 3.65894L10.3409 4.40129L7.74214 7.00004L10.3409 9.59879L9.59854 10.3411L6.99979 7.74239L4.40104 10.3411L3.65869 9.59879L6.25744 7.00004L3.65869 4.40129L4.40104 3.65894L6.99979 6.25769Z"
                                fill="#F5F5F4"
                              />
                            </svg>
                          )
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Accordion.Content>
        </table>
      </Accordion.Item>
    </Accordion.Root>
  );
};

const renderHighlightGrid = (
  sectionFeatures,
  sectionName,
  sectionDescription
) => (
  <div className="my-16 w-full rounded-2xl bg-gradient-to-b from-matcha-400 to-breeze-400 p-px text-center">
    <div className="rounded-2xl bg-stone-900 px-6 py-8">
      <div className="pb-6 text-lg font-bold">
        {sectionName}
        <div className="text-sm font-normal">{sectionDescription}</div>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm md:grid-cols-4 lg:gap-10">
        {sectionFeatures.map((feature, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="font-medium">
              {feature.name}
              {Boolean(feature.infoUrl) && (
                <Link
                  href={feature.infoUrl}
                  target="_blank"
                  className="ml-1 inline-flex align-text-top text-muted transition-all hover:text-white"
                >
                  <RiExternalLinkLine className="h-4 w-4" />
                </Link>
              )}
            </div>
            {feature.description && (
              <div className="mt-0.5 text-muted">{feature.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

"use client";
import { Button } from "src/components/RedesignedLanding/Button";
import { BaerskinLogo } from "./header";
import { Tabs, TabsList, TabsTrigger } from "./caseStudyTabs";
import { cn } from "src/components/utils/classNames";
import { useEffect, useState } from "react";

export default function BaerskinTacticalContent() {
  const [activeTab, setActiveTab] = useState("first");
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Don't update tabs during programmatic scrolling
      if (isScrolling) return;

      const sections = ["first", "second", "third"];
      const offset = 150; // Offset to account for sticky header + tabs

      for (const section of sections) {
        const element = document.querySelector(`.${section}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom > offset) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolling]);

  const scrollToSection = (section: string) => {
    const element = document.querySelector(`.${section}`);
    if (element) {
      setIsScrolling(true);

      const headerHeight = 73; // Header height
      const tabsHeight = 70; // Approximate tabs height with padding
      const offset = headerHeight + tabsHeight;

      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Re-enable scroll detection after animation completes
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000); // Smooth scroll typically takes ~500-1000ms
    }
  };

  const getSectionNumber = (section: string) => {
    switch (section) {
      case "first":
        return 1;
      case "second":
        return 2;
      case "third":
        return 3;
      default:
        return 1;
    }
  };

  const navigateToSection = (direction: "prev" | "next") => () => {
    const sections = ["first", "second", "third"];
    const currentIndex = sections.indexOf(activeTab);

    if (direction === "prev" && currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      setActiveTab(prevSection);
      scrollToSection(prevSection);
    } else if (direction === "next" && currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      setActiveTab(nextSection);
      scrollToSection(nextSection);
    }
  };
  return (
    <>
      <div className="relative mx-auto flex flex-col bg-carbon-100 py-20">
        {/* Content for third section will go here */}
        <div className="mx-auto w-full max-w-container-desktop px-8">
          <div className="max-w-[60rem] border-carbon-1000 pb-20">
            <div className="relative z-10 flex h-full">
              <p className="font-whyte text-base font-light leading-[140%] tracking-[-0.8px] text-[#242424] md:text-[32px] md:leading-[140%] md:tracking-[-1.6px] md:text-[#292524]">
                BÆRSkin Tactical Supply Co. adopted a unique approach to
                e-commerce, taking data-driven decisions to target niche markets
                worldwide. This strategy is backed by the choice to build an
                in-house e-commerce platform, bringing them complete flexibility
                and control of the shopping experience compared to solutions
                like Shopify.
              </p>
            </div>
          </div>
          {/* replace bottom border with switcher */}
          <div className="flex justify-end border-t border-carbon-1000 py-10">
            <div className="origin-left scale-90 md:scale-75 lg:scale-90 xl:scale-100">
              <BaerskinLogo />
            </div>
          </div>
        </div>
        {/* Sticky tabs container positioned below the header */}
        <div className="sticky top-[73px] z-40 bg-carbon-100 py-4 shadow-sm">
          <div className="mx-auto w-full max-w-container-desktop px-8">
            <div className="flex w-full items-center">
              {/* Desktop tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="hidden w-full md:block"
              >
                <TabsList className="w-full bg-transparent">
                  <TabsTrigger
                    value="first"
                    onClick={() => scrollToSection("first")}
                    className="cursor-pointer font-whyteMono"
                  >
                    [01]
                  </TabsTrigger>
                  <TabsTrigger
                    value="second"
                    onClick={() => scrollToSection("second")}
                    className="cursor-pointer font-whyteMono"
                  >
                    [02]
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Mobile navigation */}
              <div className="flex w-full items-center justify-between md:hidden">
                <div className="flex-1">
                  <span className="text-sm font-medium text-stone-800">
                    Section {getSectionNumber(activeTab)} of 3
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={navigateToSection("prev")}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 disabled:opacity-50"
                    disabled={activeTab === "first"}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="rotate-180"
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={navigateToSection("next")}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 disabled:opacity-50"
                    disabled={activeTab === "third"}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-container-desktop px-8">
          <ContentSection section="first" />
          <ContentSection section="second" />

          <div className="mx-auto mt-20 border-t border-stone-800 pt-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center justify-start gap-3">
                <div className="h-3 w-3 bg-stone-800"></div>
                <p className="max-w-xs font-whyte text-2xl font-light leading-tight tracking-tight text-stone-800">
                  Check out other customer success stories
                </p>
              </div>
              <div className="w-full md:-ml-[15rem] md:w-auto">
                <div className="w-full border-t border-stone-800 md:hidden"></div>
                <div className="-mr-9 flex max-w-xs items-start gap-3 font-whyte text-2xl font-light leading-tight tracking-tight text-stone-800">
                  <div className="mt-2 h-3 w-3 flex-shrink-0 bg-stone-800"></div>
                  <p>Talk to an Inngest product expert today.</p>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:items-center md:gap-8">
                <Button className="flex h-[52px] w-[212px] flex-shrink-0 items-center justify-center gap-[10px] bg-stone-800 px-[13px] py-[15px] text-right font-whyte text-2xl font-normal leading-[120%] text-alwaysWhite transition-colors hover:bg-stone-800/60">
                  Get in touch [+]
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-16 flex shrink flex-col items-end gap-2">
            <div className="h-[52px] w-[11.6%] bg-stone-800"></div>
            <div className="h-[52px] w-[19.4%] bg-stone-800"></div>
            <div className="h-[52px] w-full bg-stone-800"></div>
            <div className="h-[52px] w-[50.6%] self-start bg-stone-800"></div>
            <div className="mr-[19.4%] h-[52px] w-[30%] bg-stone-800"></div>
            <div className="h-[52px] w-[19.4%] bg-stone-800"></div>
          </div>
        </div>
      </div>
    </>
  );
}
interface Requirement {
  label: string;
  description: string;
}

interface RequirementsListProps {
  requirements: Requirement[];
}
function RequirementsList({ requirements }: RequirementsListProps) {
  return (
    <div className="space-y-16 border-t border-stone-800 pt-8">
      {requirements.map((requirement, index) => (
        <div key={index}>
          <div className="flex gap-8 pb-10">
            <div className="w-1/5 flex-shrink-0">
              <div className="font-whyte text-base font-normal leading-[140%] tracking-[-0.8px] text-[#292524] md:text-[32px] md:leading-[140%] md:tracking-[-1.6px]">
                [X]
                <br />
                {requirement.label.split("\n").map((line, lineIndex) => (
                  <span key={lineIndex}>
                    {line}
                    {lineIndex < requirement.label.split("\n").length - 1 && (
                      <br />
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-4/5">
              <p className="font-whyte text-base font-light leading-[140%] tracking-[-0.8px] text-[#292524] md:text-[32px] md:leading-[140%] md:tracking-[-1.6px]">
                {requirement.description}
              </p>
            </div>
          </div>
          {index < requirements.length - 1 && (
            <hr className="border-t border-stone-800" />
          )}
        </div>
      ))}
    </div>
  );
}

function ContentSection({ section }: { section: string }) {
  return (
    <div
      id={section}
      className={cn(
        `my-12 flex scroll-mt-[140px] flex-col gap-6 md:flex-row md:justify-between ${section}`
      )}
    >
      {/* Left column - Title + SVG on mobile, Title + SVG side by side on desktop */}
      <div className="flex flex-col gap-6 md:min-h-[800px] md:justify-between">
        <p className="font-abc-whyte-mono max-w-md text-[24px] font-normal leading-[1.3] tracking-[0.07em] text-[#292524]">
          THE KAFKA REPLATFORMING FAILURE: 6% EVENT LOSS
        </p>
        {/* SVG - shows below title on mobile, in flex layout on desktop */}
        <div className="flex items-center justify-start md:flex-1">
          <PlaceholderImage />
        </div>
      </div>
      <div>
        <div className="mx-auto max-w-[60rem]">
          {/* Header Section */}
          <div className="mb-8">
            <p className="font-whyte text-2xl font-light leading-[120%] tracking-[-1.2px] text-[#242424] md:text-[48px] md:leading-[120%] md:tracking-[-2.4px]">
              BÆRSkin Tactical Supply Co. adopted Kafka in late 2023 to power
              their analytics and order processing systems. As the replatforming
              progressed, they realized that some events were dropped, resulting
              in customers' complaints about missing orders.
            </p>

            {/* Black square element */}
            <div className="my-8 h-6 w-6 bg-[#242424]"></div>
          </div>

          {/* Problem Description */}
          <div className="mb-8 border-t border-stone-800 pt-8">
            <p className="font-whyteInktrapVariable text-base font-light leading-[140%] tracking-[-0.8px] text-[#242424] md:text-[32px] md:leading-[140%] md:tracking-[-1.6px]">
              Events dropped by Kafka, combined with its lack of native
              production tooling, made it hard for the engineering team to
              identify the root cause and impact on customers. Facing this
              challenge, Gus started to research a new technology to replace
              Kafka, matching the following requirements:
            </p>
          </div>

          {/* Requirements Section */}
          <RequirementsList
            requirements={[
              {
                label: "Reliability:",
                description:
                  "Events should be delivered reliably and can be replayed in case of processing issues. Producing and consuming events should be scalable without requiring extra infrastructure work.",
              },
              {
                label: "Event-driven:",
                description:
                  "The researched solution needs to match BÆRSkin Tactical Supply Co.' event-driven architecture.",
              },
              {
                label: "Observability:",
                description:
                  "Events and their associated processing should be easily monitored with metrics and alerts.",
              },
              {
                label: "Monitoring & Recovery tooling:",
                description:
                  "Events should be delivered reliably and can be replayed in case of processing issues. Producing and consuming events should be scalable without requiring extra infrastructure work.",
              },
            ]}
          />

          {/* Conclusion */}
          <div className="border-t border-stone-800 pt-8">
            <p className="font-whyte text-base font-light leading-[140%] tracking-[-0.8px] text-[#242424] md:text-[32px] md:leading-[140%] md:tracking-[-1.6px]">
              Compared to other solutions like Temporal, Inngest stood out as a
              promising candidate with the added value of its{" "}
              <span className="underline">great DX</span> and{" "}
              <span className="underline">Bun</span> support, which is the
              primary runtime of BÆRSkin Tactical Supply Co.'s codebase.
            </p>
          </div>

          {/* CTA Section */}
          <div className="mx-auto mt-20 border-t border-stone-800 pt-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex max-w-xs items-start gap-3 font-whyte text-2xl font-light leading-tight tracking-tight text-stone-800">
                <div className="mt-2 h-3 w-3 flex-shrink-0 bg-stone-800"></div>
                <p>Talk to an Inngest product expert today.</p>
              </div>
              <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:items-center md:gap-8">
                <Button className="flex h-[52px] w-[212px] flex-shrink-0 items-center justify-center gap-[10px] bg-stone-800 px-[13px] py-[15px] text-right font-whyte text-2xl font-normal leading-[120%] text-alwaysWhite transition-colors hover:bg-stone-800/60">
                  Read more [↗]
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderImage() {
  return (
    <svg
      width="385"
      height="777"
      viewBox="0 0 385 777"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto h-auto w-full max-w-[200px] md:max-w-[385px]"
    >
      <g clipPath="url(#clip0_321_29285)">
        <path
          d="M255.87 86.484C279.267 86.484 298.233 67.5176 298.233 44.1214C298.233 20.7252 279.267 1.75879 255.87 1.75879C232.474 1.75879 213.508 20.7252 213.508 44.1214C213.508 67.5176 232.474 86.484 255.87 86.484Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 44.1211H213.506"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M298.2 44.1211H340.563"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 171.177H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 171.177H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M298.2 171.177H340.563"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 213.54C279.267 213.54 298.233 194.573 298.233 171.177C298.233 147.781 279.267 128.814 255.87 128.814C232.474 128.814 213.508 147.781 213.508 171.177C213.508 194.573 232.474 213.54 255.87 213.54Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 186.122L270.85 156.198"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 156.198L270.85 186.122"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 325.681C279.267 325.681 298.233 306.715 298.233 283.319C298.233 259.922 279.267 240.956 255.87 240.956C232.474 240.956 213.508 259.922 213.508 283.319C213.508 306.715 232.474 325.681 255.87 325.681Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 298.296L270.85 268.34"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 268.34L270.85 298.296"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 437.856C279.267 437.856 298.233 418.89 298.233 395.493C298.233 372.097 279.267 353.131 255.87 353.131C232.474 353.131 213.508 372.097 213.508 395.493C213.508 418.89 232.474 437.856 255.87 437.856Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 410.471L270.85 380.515"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 380.515L270.85 410.471"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 550.03C279.267 550.03 298.233 531.064 298.233 507.667C298.233 484.271 279.267 465.305 255.87 465.305C232.474 465.305 213.508 484.271 213.508 507.667C213.508 531.064 232.474 550.03 255.87 550.03Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 522.613L270.85 492.688"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 492.688L270.85 522.613"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 662.172C279.267 662.172 298.233 643.205 298.233 619.809C298.233 596.413 279.267 577.446 255.87 577.446C232.474 577.446 213.508 596.413 213.508 619.809C213.508 643.205 232.474 662.172 255.87 662.172Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 634.787L270.85 604.863"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 604.863L270.85 634.787"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 774.347C279.267 774.347 298.233 755.381 298.233 731.985C298.233 708.588 279.267 689.622 255.87 689.622C232.474 689.622 213.508 708.588 213.508 731.985C213.508 755.381 232.474 774.347 255.87 774.347Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 746.962L270.85 717.006"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 717.006L270.85 746.962"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M382.924 128.814C382.924 152.194 363.973 171.177 340.562 171.177"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M340.562 44.1211C363.941 44.1211 382.924 63.0719 382.924 86.4837"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M382.923 86.4512V128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 86.4515C1.75879 63.0723 20.7096 44.0889 44.1214 44.0889"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1214 171.177C20.7422 171.177 1.75879 152.226 1.75879 128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 286.119H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 286.119H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 286.118C20.7422 286.118 1.75879 267.168 1.75879 243.756"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 400.116H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 400.116H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 400.116C20.7422 400.116 1.75879 381.166 1.75879 357.754"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 508.613H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 508.613H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 508.612C20.7422 508.612 1.75879 489.661 1.75879 466.249"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 622.61H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 622.61H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 622.611C20.7422 622.611 1.75879 603.66 1.75879 580.248"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 731.105H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 731.105H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 731.106C20.7422 731.106 1.75879 712.155 1.75879 688.743"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 128.814V86.4512"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 245.678V130.605"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 359.676V244.604"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 467.552V352.479"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 581.55V466.478"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 693.106V578.033"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M235.629 43.4941H279.666"
          stroke="#0C0A09"
          strokeWidth="3.52"
          strokeMiterlimit="10"
        />
        <path
          d="M254.001 24.0003L234 43.332L254.001 62.6638"
          stroke="#292524"
          strokeWidth="3.52"
        />
      </g>
      <defs>
        <clipPath id="clip0_321_29285">
          <rect width="384.682" height="776.105" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

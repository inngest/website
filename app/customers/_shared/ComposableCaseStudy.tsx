"use client";
import Image from "next/image";
import { Button } from "components/RedesignedLanding/Button";
import { Tabs, TabsList, TabsTrigger } from "./CaseStudyTabs";
import { cn } from "components/utils/classNames";
import { useEffect, useState } from "react";
import Link from "next/link";

// Interfaces for composable content structure
interface Requirement {
  label: string;
  description: string;
  symbol?: "X" | "✓";
}

interface QuoteBlock {
  quote: string;
  author: string;
  company: string;
  highlightedWords?: string[]; // Words to underline in the quote
  label?: string; // Optional label section above the quote
}

interface NumberedSection {
  number: string;
  text: string;
  highlightedText?: string;
}

type ContentBlock =
  | {
      id: string;
      type: "paragraph";
      content: string;
      label?: string;
      imagePath?: string;
    }
  | {
      id: string;
      type: "requirements";
      requirements: Requirement[];
      defaultSymbol?: "X" | "✓";
      imagePath?: string;
    }
  | { id: string; type: "quote"; quote: QuoteBlock; imagePath?: string }
  | { id: string; type: "label"; content: string; imagePath?: string }
  | {
      id: string;
      type: "numbered";
      numbered: NumberedSection;
      imagePath?: string;
    }
  | {
      id: string;
      type: "cta";
      ctaText: string;
      ctaDescription?: string;
      imagePath?: string;
    };

interface ContentSectionData {
  id: string;
  title: string;
  header: string;
  contentBlocks: ContentBlock[];
  image?: React.ReactNode;
}

interface ComposableCaseStudyProps {
  intro: {
    title: string;
    logo: React.ReactNode;
  };
  sections: ContentSectionData[];
  footer: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
}

// Constants for scroll behavior
const SCROLL_OFFSET = 150;
const HEADER_HEIGHT = 73;
const TABS_HEIGHT = 70;
const SCROLL_ANIMATION_TIMEOUT = 1000;

export function ComposableCaseStudy({
  intro,
  sections,
  footer,
}: ComposableCaseStudyProps) {
  const [activeTab, setActiveTab] = useState(sections[0]?.id || "");
  const [isScrolling, setIsScrolling] = useState(false);

  const sectionIds = sections.map((section) => section.id);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Don't update tabs during programmatic scrolling
          if (isScrolling) {
            ticking = false;
            return;
          }

          for (const sectionId of sectionIds) {
            const element = document.querySelector(`.${sectionId}`);
            if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top <= SCROLL_OFFSET && rect.bottom > SCROLL_OFFSET) {
                setActiveTab(sectionId);
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolling, sectionIds]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`.${sectionId}`);
    if (element) {
      setIsScrolling(true);

      const offset = HEADER_HEIGHT + TABS_HEIGHT;

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
      }, SCROLL_ANIMATION_TIMEOUT);
    }
  };

  return (
    <>
      <div className="relative mx-auto flex flex-col bg-carbon-100 py-20">
        <div className="mx-auto w-full max-w-container-desktop px-8">
          <div className="max-w-[60rem] border-carbon-1000 pb-14 md:pb-32">
            <div className="relative z-10 flex h-full">
              <p className="whitespace-pre-line font-whyte text-base font-light leading-[140%] text-stone-950 md:text-[32px] md:leading-[140%] md:tracking-[-1.6px] md:text-carbon-800">
                {intro.title}
              </p>
            </div>
          </div>
          <div className="border-t border-carbon-400"></div>
        </div>
        <div className="mx-auto w-full max-w-container-desktop px-8 md:hidden">
          <div className="flex justify-start border-b border-carbon-400 py-4 md:py-10">
            <div className="origin-left scale-[80%] md:scale-75 lg:scale-90 xl:scale-100">
              {intro.logo}
            </div>
          </div>
        </div>
        <div className="sticky top-[73px] z-40 hidden bg-carbon-100 md:block">
          <div className="mx-auto w-full max-w-container-desktop px-8">
            <div className="flex justify-end py-10">
              <div className="origin-left scale-90 md:scale-75 lg:scale-90 xl:scale-[100%]">
                {intro.logo}
              </div>
            </div>
            <div className="pb-24">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full bg-transparent">
                  {sections.map((section, index) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="cursor-pointer pl-0 font-whyteMono"
                    >
                      [{(index + 1).toString().padStart(2, "0")}]
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        <div className="mx-auto mb-12 w-full max-w-container-desktop px-8">
          {sections.map((section, index) => (
            <ContentSection
              key={section.id}
              sectionData={section}
              isFirst={index === 0}
            />
          ))}

          <div className="flex shrink flex-col items-end gap-1 opacity-20 md:mx-0 md:hidden md:gap-2">
            <div className="h-4 w-[11.6%] bg-stone-800 md:h-[52px]"></div>
            <div className="h-4 w-[19.4%] bg-stone-800 md:h-[52px]"></div>
            <div className="h-4 w-full bg-stone-800 md:h-[52px]"></div>
            <div className="h-4 w-[50.6%] self-start bg-stone-800 md:h-[52px]"></div>
            <div className="mr-[19.4%] h-4 w-[30%] bg-stone-800 md:h-[52px]"></div>
            <div className="h-4 w-[19.4%] bg-stone-800 md:h-[52px]"></div>
          </div>

          <div className="mx-auto mt-12 border-t border-stone-800 pt-6 md:mt-20 md:pt-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
              <div className="flex items-start justify-start gap-3">
                <div className="mt-1 h-3 w-3 bg-stone-800 md:mt-2"></div>
                <p className="font-whyte text-base font-light leading-tight tracking-tight text-stone-800 md:text-2xl">
                  {footer.title}
                </p>
              </div>
              <div className="w-full md:-ml-[1rem] md:w-auto">
                <div className="w-full border-t border-stone-800 md:hidden"></div>
                <div className="flex items-start justify-start gap-3 pt-6 md:pt-0">
                  <div className="flex max-w-xs items-start gap-3 font-whyte text-base font-light leading-tight tracking-tight text-stone-800 md:text-2xl">
                    <div className="mt-1 h-3 w-3 flex-shrink-0 bg-stone-800 md:mt-2"></div>
                    <p>{footer.subtitle}</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:items-center md:gap-8">
                <Button
                  className="flex w-full flex-shrink-0 items-center justify-center gap-[7.153px] bg-stone-800 py-6 text-right font-whyte text-base font-normal leading-[120%] text-alwaysWhite transition-colors hover:bg-stone-800/60 md:h-[52px] md:w-[212px] md:gap-[10px] md:px-[13px] md:py-[15px] md:text-xl"
                  asChild
                >
                  <Link href="/contact?ref=customers-case-study-content-cta">
                    {footer.ctaText}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-16 hidden shrink flex-col items-end gap-2 opacity-20 md:flex">
            <div className="h-8 w-[11.6%] bg-stone-800 md:h-[52px]"></div>
            <div className="h-8 w-[19.4%] bg-stone-800 md:h-[52px]"></div>
            <div className="h-8 w-full bg-stone-800 md:h-[52px]"></div>
            <div className="h-8 w-[50.6%] self-start bg-stone-800 md:h-[52px]"></div>
            <div className="mr-[19.4%] h-8 w-[30%] bg-stone-800 md:h-[52px]"></div>
            <div className="h-8 w-[19.4%] bg-stone-800 md:h-[52px]"></div>
          </div>
        </div>
      </div>
    </>
  );
}

interface RequirementsListProps {
  requirements: Requirement[];
  defaultSymbol?: "X" | "✓";
}

function RequirementsList({
  requirements,
  defaultSymbol = "X",
}: RequirementsListProps) {
  return (
    <div className="space-y-6">
      {requirements.map((requirement, index) => (
        <div key={`req-${requirement.label}-${index}`}>
          <div
            className={cn(
              "flex flex-col gap-4 md:flex-row md:gap-8",
              index < requirements.length - 1 && "pb-10"
            )}
          >
            <div className="md:w-1/5 md:flex-shrink-0">
              <div className="font-whyte text-base font-semibold leading-[140%] tracking-[-0.8px] text-carbon-800 md:text-2xl md:leading-[140%]">
                [{requirement.symbol || defaultSymbol}]
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
            <div className="md:w-4/5">
              <p className="font-whyte text-base font-light leading-[140%] tracking-[-0.8px] text-carbon-800 md:text-2xl md:leading-[140%]">
                {requirement.description}
              </p>
            </div>
          </div>
          {index < requirements.length - 1 && (
            <hr className="border-t border-stone-400" />
          )}
        </div>
      ))}
    </div>
  );
}

function ContentSection({
  sectionData,
  isFirst,
}: {
  sectionData: ContentSectionData;
  isFirst?: boolean;
}) {
  return (
    <div
      id={sectionData.id}
      className={cn(
        `mt-6 flex scroll-mt-[140px] flex-col gap-6 md:mb-24 md:flex-row md:justify-between ${sectionData.id}`,
        !isFirst && "border-t border-stone-800 pt-6 md:pt-12"
      )}
    >
      <div className="flex flex-col gap-6 md:min-h-[800px] md:justify-between">
        <p className="max-w-[13rem] font-whyteMono text-xs font-normal uppercase leading-[130%] tracking-[0.84px] text-carbon-800 md:max-w-xs md:text-lg md:leading-[1.3] md:tracking-[0.07em]">
          {sectionData.title}
        </p>
        <div className="flex items-center justify-start md:flex-1 [&>*]:origin-left">
          {sectionData.image}
        </div>
      </div>
      <div>
        <div className="mx-auto max-w-[57.5rem]">
          <div className="mb-8">
            <p className="font-whyte text-2xl font-light leading-[120%] tracking-[-1.2px] text-carbon-800 md:text-4xl md:leading-[120%] md:tracking-[-1px]">
              {sectionData.header}
            </p>
            <div className="my-8 h-6 w-6 bg-carbon-800"></div>
          </div>

          {sectionData.contentBlocks.map((block, index) => (
            <ContentBlock
              key={block.id}
              block={block}
              isLast={index === sectionData.contentBlocks.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentBlock({
  block,
  isLast,
}: {
  block: ContentBlock;
  isLast: boolean;
}) {
  const containerClasses =
    isLast && block.type === "cta"
      ? "mx-auto mb-12 mt-12 pt-6 md:mt-20 md:pt-8"
      : "border-t border-stone-400 pt-4 pb-8";

  const renderQuoteWithHighlights = (
    quote: string,
    highlightedWords?: string[]
  ) => {
    if (!highlightedWords || highlightedWords.length === 0) {
      return quote;
    }

    // Split the quote into words and map over them
    const words = quote.split(/(\s+)/); // Split on whitespace but keep the spaces

    return (
      <>
        {words.map((word, index) => {
          const cleanWord = word.replace(/[.,!?"]/g, "").trim(); // Remove punctuation for matching
          const shouldUnderline = highlightedWords.some(
            (highlightWord) =>
              cleanWord.toLowerCase() === highlightWord.toLowerCase()
          );

          return (
            <span
              key={`quote-word-${index}-${cleanWord}`}
              className={cn(
                shouldUnderline &&
                  "decoration-skip-ink-none font-whyte text-[32px] font-normal leading-[140%] tracking-[-1.6px] text-carbon-800 underline decoration-auto underline-offset-auto"
              )}
            >
              {word}
            </span>
          );
        })}
      </>
    );
  };

  const renderImage = (imagePath?: string) => {
    if (!imagePath) return null;

    return (
      <div className="justify-left flex">
        <Image
          src={imagePath}
          alt="Content block image"
          width={800}
          height={600}
          className="h-auto w-full max-w-2xl pt-11"
        />
      </div>
    );
  };

  switch (block.type) {
    case "paragraph":
      return (
        <div className={containerClasses}>
          {block.label && (
            <div className="mb-6 font-whyteMono text-sm font-normal leading-[1.4] tracking-[-0.05em] text-stone-800 md:mb-14 md:text-lg">
              {block.label}
            </div>
          )}
          <p className="whitespace-pre-line font-whyteInktrapVariable text-base font-light leading-[140%] text-carbon-800 md:text-2xl md:leading-[140%] ">
            {block.content}
          </p>
          {renderImage(block.imagePath)}
        </div>
      );

    case "requirements":
      return (
        <div className={containerClasses}>
          <RequirementsList
            requirements={block.requirements}
            defaultSymbol={block.defaultSymbol}
          />
          {renderImage(block.imagePath)}
        </div>
      );

    case "quote":
      return (
        <div className={containerClasses}>
          {block.quote.label && (
            <div className="mb-6 font-whyteMono text-sm font-normal leading-[1.3] text-stone-800 md:mb-14 md:text-lg">
              {block.quote.label}
            </div>
          )}
          <div className="relative">
            <div className="absolute -left-[0.34rem] -top-[0.07rem] font-whyte text-base font-light text-carbon-800 md:-left-2 md:top-0 md:text-2xl md:leading-[140%]">
              “
            </div>
            <blockquote className="font-whyte text-base font-light leading-[140%] tracking-[-0.8px] text-carbon-800 md:text-2xl md:leading-[140%]">
              {renderQuoteWithHighlights(
                block.quote.quote,
                block.quote.highlightedWords
              )}
              ”
            </blockquote>
          </div>
          <p className="max-w-sm pt-6 font-whyteMono text-sm font-normal leading-[140%] text-stone-800 md:pt-12 md:text-base md:leading-[1.3] md:tracking-[0.075em]">
            {block.quote.author}
            <br />
            {block.quote.company}
          </p>
          {renderImage(block.imagePath)}
        </div>
      );

    case "label":
      return (
        <div className={containerClasses}>
          <div className="font-whyteMono text-base font-normal leading-[140%] tracking-[-0.8px] text-carbon-800 md:max-w-2xl md:text-lg md:leading-[1.4] md:tracking-[-0.05em] md:text-stone-800">
            {block.content}
          </div>
          {renderImage(block.imagePath)}
        </div>
      );

    case "numbered":
      return (
        <div className={containerClasses}>
          <div className="font-whyte text-base font-normal leading-[1.4] tracking-[1.4] text-stone-800 md:text-2xl">
            [{block.numbered.number}]{" "}
            {block.numbered.highlightedText && (
              <span className="underline">
                {block.numbered.highlightedText}{" "}
              </span>
            )}
            {block.numbered.text}
          </div>
          {renderImage(block.imagePath)}
        </div>
      );

    case "cta":
      return (
        <div
          className={cn(
            containerClasses,
            "hidden md:border-t md:border-stone-800 md:pt-6"
          )}
        >
          <div className="flex-col items-start justify-between gap-6 md:flex md:flex-row md:items-start md:border-t md:border-stone-800 md:pt-6">
            <div className="flex max-w-xs items-start gap-3 font-whyte text-2xl font-light leading-tight tracking-tight text-stone-800">
              <div className="mt-2 h-3 w-3 flex-shrink-0 bg-stone-800"></div>
              <p>
                {block.ctaDescription ||
                  "Talk to an Inngest product expert today."}
              </p>
            </div>
            <div className="flex w-full flex-col items-start gap-6 md:w-auto md:flex-row md:items-center md:gap-8">
              <Button
                className="flex h-[52px] w-[212px] flex-shrink-0 items-center justify-center gap-[10px] bg-stone-800 px-[13px] py-[15px] text-right font-whyte text-xl font-normal leading-[120%] text-alwaysWhite transition-colors hover:bg-stone-800/60"
                asChild
              >
                <Link href="/blog?ref=blog-cta">{block.ctaText}</Link>
              </Button>
            </div>
          </div>
          {renderImage(block.imagePath)}
        </div>
      );

    default:
      return null;
  }
}

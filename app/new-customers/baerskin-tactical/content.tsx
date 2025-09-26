"use client";
import { Button } from "src/components/RedesignedLanding/Button";
import { BaerskinLogo } from "./header";
import { Tabs, TabsList, TabsTrigger } from "./caseStudyTabs";
import { cn } from "src/components/utils/classNames";
import { useEffect, useState } from "react";

// Interfaces for composable content structure
interface Requirement {
  label: string;
  description: string;
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
  | { type: "paragraph"; content: string; label?: string; imagePath?: string }
  | {
      type: "requirements";
      requirements: Requirement[];
      imagePath?: string;
    }
  | { type: "quote"; quote: QuoteBlock; imagePath?: string }
  | { type: "label"; content: string; imagePath?: string }
  | { type: "numbered"; numbered: NumberedSection; imagePath?: string }
  | {
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

// Default content for Baerskin case study
const BAERSKIN_CONTENT: ComposableCaseStudyProps = {
  intro: {
    title:
      "BÆRSkin Tactical Supply Co. adopted a unique approach to e-commerce, taking data-driven decisions to target niche markets worldwide. This strategy is backed by the choice to build an in-house e-commerce platform, bringing them complete flexibility and control of the shopping experience compared to solutions like Shopify.",
    logo: <BaerskinLogo />,
  },
  sections: [
    {
      id: "first",
      title: "BUILDING IN-HOUSE E-COMMERCE PLATFORM",
      header:
        "BÆRSkin Tactical Supply Co. adopted a unique approach to e-commerce, taking data-driven decisions to target niche markets worldwide. This strategy is backed by the choice to build an in-house e-commerce platform, bringing them complete flexibility and control of the shopping experience compared to solutions like Shopify.",
      contentBlocks: [
        {
          type: "quote",
          quote: {
            author: "Gus Fune → CTO",
            company: "[ BÆRSkin Tactical Supply Co. ]",
            quote:
              "We ended up developing our own E commerce platform in house. So we didn't use Shopify or anything like that because we want to keep control of a few elements that they don't allow us to controllike checkout",
            highlightedWords: ["control", "checkout"], // Example of words to underline
          },
        },
        {
          type: "paragraph",
          content:
            "BÆRSkin Tactical Supply Co. is built as a multi-cloud and multi-region event-driven system, composed of analytics systems used internally to make data-driven decisions, as well as operational data processing that powers core e-commerce features, such as order processing and logistics. \n\n In late 2024, Gus and his team started to face issues with their recent Kafka replatforming (migrating an existing application without major rewrites).",
        },
      ],
      image: <PlaceholderImage2 />,
    },
    {
      id: "deez",
      title: "THE KAFKA REPLATFORMING FAILURE: 6% EVENT LOSS",
      header:
        "BÆRSkin Tactical Supply Co. adopted Kafka in late 2023 to power their analytics and order processing systems. As the replatforming progressed, they realized that some events were dropped, resulting in customers' complaints about missing orders.",
      contentBlocks: [
        {
          type: "paragraph",
          content:
            "Events dropped by Kafka, combined with its lack of native production tooling, made it hard for the engineering team to identify the root cause and impact on customers. Facing this challenge, Gus started to research a new technology to replace Kafka, matching the following requirements:",
        },
        {
          type: "requirements",
          requirements: [
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
          ],
        },
        {
          type: "paragraph",
          content:
            "Compared to other solutions like Temporal, Inngest stood out as a promising candidate with the added value of its great DX and Bun support, which is the primary runtime of BÆRSkin Tactical Supply Co.'s codebase.",
        },
      ],
      image: <PlaceholderImage />,
    },
    {
      id: "second",
      title:
        "CHOOSING INNGEST: A RELIABLE EVENT-DRIVEN WORKFLOW ENGINE, COMING WITH ESSENTIAL PRODUCTION TOOLS",
      header:
        "BÆRSkin Tactical Supply Co. adopted a unique approach to e-commerce, taking data-driven decisions to target niche markets worldwide. This strategy is backed by the choice to build an in-house e-commerce platform, bringing them complete flexibility and control of the shopping experience compared to solutions like Shopify.",
      contentBlocks: [
        {
          type: "requirements",
          requirements: [
            {
              label: "Beyond Reliability:",
              description:
                "( observability / monitoring / recovery tools ) Beyond solving the reliability issues faced with Kafka, replatforming to Inngest brought a set of new advantages in operating their operational data and analytics processing in production. ",
            },
          ],
        },
        {
          type: "quote",
          quote: {
            author: "Gus Fune → CTO",
            company: "[ BÆRSkin Tactical Supply Co. ]",
            quote:
              "The reliable transportation of events and making sure the replayability, being able to monitor how things are going, and catch things before they become a problem. Those are super important for us.",
          },
        },
        {
          type: "label",
          content:
            "Using Inngest, Gus's team got access to ready-to-use monitoring dashboards, production recovery tools such as Replays  [↙ ]",
          imagePath: "/assets/customers/baerskin/baerskinImage.png",
        },
      ],
    },
    {
      id: "third",
      title: "Achieving 10x performance improvements on their logistics system",
      header:
        "Once the initial reliability issue was resolved by replatforming to Inngest, Gus and his team began exploring ways to expand Inngest to address other challenges they faced with their logistics system.",
      contentBlocks: [
        {
          type: "paragraph",
          content:
            "BÆRSkin Tactical Supply Co.'s logistics system faced a recurring challenge during Black Friday and Cyber Monday, a well-known challenge for most E-Commerce actors. The large number of orders concentrated during this short period was putting a lot of pressure on their database-based queuing system (utilizing Postgres's SKIP LOCKED design), which failed to process orders and initiate shipments in a reasonable timeframe. \n\n While short-term solutions such as drastically upscaling their infrastructure helped, Gus and his team started a PoC to evaluate the performance of their logistics system once powered by Inngest. Again, the results were there.",
        },
        {
          type: "quote",
          quote: {
            author: "Gus Fune → CTO",
            company: "[ BÆRSkin Tactical Supply Co. ]",
            quote:
              "The preliminary results show that from 40 orders per minute we managed to increase to 500 orders per minute to process in the new system. So this is probably the biggest gain we've seen in the new system.",
          },
        },
      ],
    },
    {
      id: "fourth",
      title: "INNGEST FOR E-COMMERCE",
      header:
        "For BÆRSkin Tactical Supply Co., what started as a replatforming effort to address Kafka reliability issues ultimately evolved into a modernization of their analytical and operational data processing, resulting in significant gains in processing performance (a 10x faster logistics system) and operational productivity (through production tools like Replay).",
      contentBlocks: [
        {
          type: "paragraph",
          content:
            "BÆRSkin Tactical Supply Co.'s logistics system faced a recurring challenge during Black Friday and Cyber Monday, a well-known challenge for most E-Commerce actors. The large number of orders concentrated during this short period was putting a lot of pressure on their database-based queuing system (utilizing Postgres's SKIP LOCKED design), which failed to process orders and initiate shipments in a reasonable timeframe. \n\n Finally, where alternatives like Kafka, AWS SQS, or Temporal require significant investment in infrastructure, monitoring, and production tools, Inngest comes with a fully managed and auto-scaled service that provides essential production monitoring and recovery tools.",
        },
        {
          type: "paragraph",
          content:
            "If you’re interested in learning how Inngest can help your team? → Reach out to us to chat with an expert.",
        },
        {
          type: "cta",
          ctaText: "Read more [↗]",
          ctaDescription: "Want to learn more about Inngest for e-commerce?",
        },
      ],
    },
  ],
  footer: {
    title: "Check out other customer success stories",
    subtitle: "Talk to an Inngest product expert today.",
    ctaText: "Get in touch [+]",
  },
};

export default function BaerskinTacticalContent() {
  return <ComposableCaseStudy {...BAERSKIN_CONTENT} />;
}

// Export the composable component for reuse
export { ComposableCaseStudy };

// Main composable component
function ComposableCaseStudy({
  intro,
  sections,
  footer,
}: ComposableCaseStudyProps) {
  const [activeTab, setActiveTab] = useState(sections[0]?.id || "");
  const [isScrolling, setIsScrolling] = useState(false);

  const sectionIds = sections.map((section) => section.id);

  useEffect(() => {
    const handleScroll = () => {
      // Don't update tabs during programmatic scrolling
      if (isScrolling) return;

      const offset = 150; // Offset to account for sticky header + tabs

      for (const sectionId of sectionIds) {
        const element = document.querySelector(`.${sectionId}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom > offset) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolling, sectionIds]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`.${sectionId}`);
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

  return (
    <>
      <div className="relative mx-auto flex flex-col bg-carbon-100 py-20">
        {/* Content for third section will go here */}
        <div className="mx-auto w-full max-w-container-desktop px-8">
          <div className="max-w-[60rem] border-carbon-1000 pb-20">
            <div className="relative z-10 flex h-full">
              <p className="whitespace-pre-line font-whyte text-base font-light leading-[140%] tracking-[-0.8px] text-carbon-800 md:text-[32px] md:leading-[140%] md:tracking-[-1.6px] md:text-carbon-800">
                {intro.title}
              </p>
            </div>
          </div>
          {/* replace bottom border with switcher */}
          <div className="border-t border-carbon-1000"></div>
        </div>
        {/* Desktop sticky container with logo and tabs */}
        <div className="sticky top-[73px] z-40 hidden bg-carbon-100 md:block">
          <div className="mx-auto w-full max-w-container-desktop px-8 pb-12">
            {/* Logo section */}
            <div className="flex justify-end py-10">
              <div className="origin-left scale-90 md:scale-75 lg:scale-90 xl:scale-100">
                {intro.logo}
              </div>
            </div>
            {/* Tabs section */}
            <div className="py-4">
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
                      className="cursor-pointer font-whyteMono"
                    >
                      [{(index + 1).toString().padStart(2, "0")}]
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Mobile navigation - Right edge of screen */}
        <div className="sticky top-[73px] z-40 flex justify-end py-4 pr-4 md:hidden">
          <div className="flex flex-col gap-1">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveTab(section.id);
                  scrollToSection(section.id);
                }}
                className={`flex h-6 w-10 items-center justify-center font-whyteMono text-xs font-normal ${
                  activeTab === section.id
                    ? "bg-stone-800 text-white"
                    : "bg-transparent text-stone-600 hover:bg-stone-100"
                }`}
              >
                [{(index + 1).toString().padStart(2, "0")}]
              </button>
            ))}
          </div>
        </div>
        <div className="mx-auto w-full max-w-container-desktop px-8">
          {sections.map((section) => (
            <ContentSection key={section.id} sectionData={section} />
          ))}

          <div className="mx-auto mt-20 border-t border-stone-800 pt-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
              <div className="w-full md:w-auto">
                <div className="w-full border-t border-stone-800 md:hidden"></div>
                <div className="-mr-9 flex max-w-xs items-start gap-3 font-whyte text-2xl font-light leading-tight tracking-tight text-stone-800">
                  <div className="mt-2 h-3 w-3 flex-shrink-0 bg-stone-800"></div>
                  <p>{footer.title}</p>
                </div>
              </div>
              <div className="w-full md:-ml-[11rem] md:w-auto">
                <div className="w-full border-t border-stone-800 md:hidden"></div>
                <div className="-mr-28 flex max-w-xs items-start gap-3 font-whyte text-2xl font-light leading-tight tracking-tight text-stone-800">
                  <div className="mt-2 h-3 w-3 flex-shrink-0 bg-stone-800"></div>
                  <p>{footer.subtitle}</p>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:items-center md:gap-8">
                <Button className="flex h-[52px] w-[212px] flex-shrink-0 items-center justify-center gap-[10px] bg-stone-800 px-[13px] py-[15px] text-right font-whyte text-2xl font-normal leading-[120%] text-alwaysWhite transition-colors hover:bg-stone-800/60">
                  {footer.ctaText}
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
interface RequirementsListProps {
  requirements: Requirement[];
}
function RequirementsList({ requirements }: RequirementsListProps) {
  return (
    <div className="space-y-16">
      {requirements.map((requirement, index) => (
        <div key={index}>
          <div className="flex gap-8 pb-10">
            <div className="w-1/5 flex-shrink-0">
              <div className="font-whyte text-base font-medium leading-[140%] tracking-[-0.8px] text-carbon-800 md:text-[32px] md:leading-[140%] md:tracking-[-1.6px]">
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
              <p className="font-whyte text-base font-light leading-[140%] tracking-[-0.8px] text-carbon-800 md:text-[32px] md:leading-[140%] md:tracking-[-1.6px]">
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

function ContentSection({ sectionData }: { sectionData: ContentSectionData }) {
  return (
    <div
      id={sectionData.id}
      className={cn(
        `my-12 flex scroll-mt-[140px] flex-col gap-6 border-t border-stone-800 pt-12 md:flex-row md:justify-between ${sectionData.id}`
      )}
    >
      {/* Left column - Title + SVG on mobile, Title + SVG side by side on desktop */}
      <div className="flex flex-col gap-6 md:min-h-[800px] md:justify-between">
        <p className="max-w-md font-whyteMono text-[24px] font-normal uppercase leading-[1.3] tracking-[0.07em] text-carbon-800">
          {sectionData.title}
        </p>
        {/* SVG - shows below title on mobile, in flex layout on desktop */}
        <div className="flex items-center justify-start md:flex-1">
          {sectionData.image}
        </div>
      </div>
      <div>
        <div className="mx-auto max-w-[60rem]">
          {/* Header Section */}
          <div className="mb-16">
            <p className="font-whyte text-2xl font-light leading-[120%] tracking-[-1.2px] text-carbon-800 md:text-[48px] md:leading-[120%] md:tracking-[-2.4px]">
              {sectionData.header}
            </p>

            {/* Black square element */}
            <div className="my-8 h-6 w-6 bg-carbon-800"></div>
          </div>

          {/* Dynamic Content Blocks */}
          {sectionData.contentBlocks.map((block, index) => (
            <ContentBlock
              key={index}
              block={block}
              isLast={index === sectionData.contentBlocks.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Component to render different types of content blocks
function ContentBlock({
  block,
  isLast,
}: {
  block: ContentBlock;
  isLast: boolean;
}) {
  const containerClasses =
    isLast && block.type === "cta"
      ? "mx-auto mt-20 border-t border-stone-800 pt-8"
      : "py-14 border-t border-stone-800";

  // Helper function to render quote with highlighted words
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
              key={index}
              className={cn(
                shouldUnderline &&
                  "font-whyte text-[32px] font-normal leading-[140%] tracking-[-1.6px] text-carbon-800 underline decoration-solid"
              )}
              style={
                shouldUnderline
                  ? {
                      textDecorationSkipInk: "none",
                      textDecorationThickness: "auto",
                      textUnderlineOffset: "auto",
                      textUnderlinePosition: "from-font",
                    }
                  : {}
              }
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
        <img
          src={imagePath}
          alt="Content block image"
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
            <div className="mb-6 font-whyteMono text-[28px] font-normal leading-[1.4] tracking-[-0.05em] text-stone-800">
              {block.label}
            </div>
          )}
          <p className="whitespace-pre-line font-whyteInktrapVariable text-base font-light leading-[140%] tracking-[-0.8px] text-carbon-800 md:text-[32px] md:leading-[140%] md:tracking-[-1.6px]">
            {block.content}
          </p>
          {renderImage(block.imagePath)}
        </div>
      );

    case "requirements":
      return (
        <div className={containerClasses}>
          <RequirementsList requirements={block.requirements} />
          {renderImage(block.imagePath)}
        </div>
      );

    case "quote":
      return (
        <div className={containerClasses}>
          {block.quote.label && (
            <div className="mb-6 font-whyteMono text-[28px] font-normal leading-[1.4] tracking-[-0.05em] text-stone-800">
              {block.quote.label}
            </div>
          )}
          <div className="relative">
            {/* Hanging quote mark - positioned outside the content flow */}
            <div className="absolute top-0 font-whyte text-base font-light leading-[140%] tracking-[-0.8px] text-carbon-800 md:-left-3 md:text-[32px] md:leading-[140%] md:tracking-[-1.6px]">
              ‟
            </div>
            <blockquote className="font-whyte text-base font-light leading-[140%] tracking-[-0.8px] text-carbon-800 md:text-[32px] md:leading-[140%] md:tracking-[-1.6px]">
              {renderQuoteWithHighlights(
                block.quote.quote,
                block.quote.highlightedWords
              )}
              "
            </blockquote>
          </div>
          <p className="max-w-sm pt-12 font-whyteMono font-normal leading-[140%] text-stone-800 md:leading-[1.3] md:tracking-[0.075em]">
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
          <div className="font-whyteMono text-[28px] font-normal leading-[1.4] tracking-[-0.05em] text-stone-800">
            {block.content}
          </div>
          {renderImage(block.imagePath)}
        </div>
      );

    case "numbered":
      return (
        <div className={containerClasses}>
          <div className="font-whyte text-3xl font-normal leading-[1.4] tracking-[-0.05em] text-stone-800">
            {block.numbered.number}{" "}
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
        <div className={containerClasses}>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
            <div className="flex max-w-xs items-start gap-3 font-whyte text-2xl font-light leading-tight tracking-tight text-stone-800">
              <div className="mt-2 h-3 w-3 flex-shrink-0 bg-stone-800"></div>
              <p>
                {block.ctaDescription ||
                  "Talk to an Inngest product expert today."}
              </p>
            </div>
            <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:items-center md:gap-8">
              <Button className="flex h-[52px] w-[212px] flex-shrink-0 items-center justify-center gap-[10px] bg-stone-800 px-[13px] py-[15px] text-right font-whyte text-2xl font-normal leading-[120%] text-alwaysWhite transition-colors hover:bg-stone-800/60">
                {block.ctaText}
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

function PlaceholderImage2() {
  return (
    <svg
      width="542"
      height="401"
      viewBox="0 0 542 401"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="542" height="401" fill="url(#pattern0_321_29280)" />
      <defs>
        <pattern
          id="pattern0_321_29280"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use transform="matrix(0.000731079 0 0 0.000988142 -0.0760906 0)" />
        </pattern>
        <image
          id="image0_321_29280"
          width="1576"
          height="1012"
          preserveAspectRatio="none"
        />
      </defs>
    </svg>
  );
}

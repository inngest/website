import Image from "next/image";
import Link from "next/link";
import { Button } from "src/components/RedesignedLanding/Button";

interface TestimonialData {
  quote: string;
  highlightedParts: string[];
  author: string;
  title: string;
  company: string;
  image: string;
  imageAlt: string;
}

interface CTAData {
  primaryText: string;
  secondaryText: string;
  buttonText: string;
}

interface ComposableAboutProps {
  testimonial: TestimonialData;
  cta: CTAData;
}

function DecorativeBars() {
  return (
    <div className="mx-4 flex shrink flex-col items-end gap-1 md:mx-0 md:gap-2">
      <div className="h-4 w-[11.6%] bg-white md:h-[52px]"></div>
      <div className="h-4 w-[19.4%] bg-white md:h-[52px]"></div>
      <div className="h-4 w-full bg-white md:h-[52px]"></div>
      <div className="h-4 w-[50.6%] self-start bg-white md:h-[52px]"></div>
      <div className="mr-[19.4%] h-4 w-[30%] bg-white md:h-[52px]"></div>
      <div className="h-4 w-[19.4%] bg-white md:h-[52px]"></div>
    </div>
  );
}

export function ComposableAbout({ testimonial, cta }: ComposableAboutProps) {
  const renderQuoteWithHighlights = (
    quote: string,
    highlightedParts: string[]
  ) => {
    let processedQuote = quote;
    const elements: React.ReactNode[] = [];
    let currentSearchStartIndex = 0;

    highlightedParts.forEach((highlight, index) => {
      const highlightIndex = processedQuote.indexOf(
        highlight,
        currentSearchStartIndex
      );
      if (highlightIndex !== -1) {
        // Add text before highlight
        if (highlightIndex > currentSearchStartIndex) {
          elements.push(
            <span key={`text-${index}`}>
              {processedQuote.substring(
                currentSearchStartIndex,
                highlightIndex
              )}
            </span>
          );
        }

        // Add highlighted text
        elements.push(
          <span
            key={`highlight-${index}`}
            className="font-whyte text-[28px] font-light leading-[140%] tracking-[-1.6px] text-carbon-50 underline md:text-[32px]"
          >
            {highlight}
          </span>
        );

        currentSearchStartIndex = highlightIndex + highlight.length;
      }
    });

    // Add remaining text
    if (currentSearchStartIndex < processedQuote.length) {
      elements.push(
        <span key="text-end">
          {processedQuote.substring(currentSearchStartIndex)}
        </span>
      );
    }

    return elements;
  };

  return (
    <>
      <div className="relative z-10 bg-stone-950 p-6 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-container-desktop md:px-8">
          <div className="m-auto">
            <div className="flex flex-col justify-between md:flex-row">
              <div className="order-1 max-w-[48rem] md:order-2">
                <div className="flex">
                  <div className="font-whyte text-[28px] font-light leading-[140%] tracking-[-1.6px] text-carbon-50 md:text-[32px]">
                    ‟
                  </div>
                  <blockquote className="max-w-4xl font-whyte text-[28px] font-light leading-[140%] tracking-[-1.6px] text-carbon-50 md:text-[32px]">
                    {renderQuoteWithHighlights(
                      testimonial.quote,
                      testimonial.highlightedParts
                    )}
                    "
                  </blockquote>
                </div>
              </div>

              <div className="order-2 mx-4 flex items-start gap-6 pt-10 md:order-1 md:mx-0 md:flex-shrink-0 md:pt-0">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-white md:h-48 md:w-48">
                  <Image
                    width={224}
                    height={224}
                    src={testimonial.image}
                    alt={testimonial.imageAlt}
                    className="h-full w-full object-cover filter"
                  />
                </div>
                <div className="max-w-sm border-t-[0.75px] pt-2 font-whyteMono text-sm font-normal leading-[140%] tracking-[-0.24px] text-carbon-0 md:text-2xl md:leading-[1.3] md:tracking-[0.075em]">
                  <p>{testimonial.author}</p>
                  <p>{testimonial.company}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <DecorativeBars />
          </div>

          <div className="mx-4 mt-10 border-t-[0.75px] border-stone-50 pt-6 md:mx-0">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div className="flex items-center justify-start gap-3">
                <div className="h-3 w-3 bg-inngestLux"></div>
                <p className="font-whyte text-base font-light leading-tight tracking-tight text-white">
                  {cta.primaryText}
                </p>
              </div>
              <div className="-mr-[19rem] w-full md:w-auto">
                <div className="w-full border-t-[0.75px] border-stone-50 md:hidden"></div>
                <div className="flex items-start justify-start gap-3 pt-6 md:pt-0">
                  <div className="flex max-w-xs items-start gap-3 font-whyte text-base font-light leading-tight tracking-tight text-white">
                    <div className="mt-1 h-3 w-3 flex-shrink-0 bg-inngestLux md:mt-2"></div>
                    <p>{cta.secondaryText}</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:items-center md:gap-8">
                <Button
                  className="flex w-full flex-shrink-0 items-center justify-center gap-[7.153px] py-6 text-right font-whyte text-base font-normal leading-[120%] text-stone-950 transition-colors md:h-[52px] md:w-[212px] md:gap-[10px] md:px-[13px] md:py-[15px] md:text-xl"
                  asChild
                >
                  <Link href="/contact?ref=blog-cta">{cta.buttonText}</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-16 hidden md:block">
            <DecorativeBars />
          </div>
        </div>
      </div>
    </>
  );
}

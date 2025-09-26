import Image from "next/image";
import { Button } from "src/components/RedesignedLanding/Button";

// Interfaces for composable About section
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
  backgroundColor?: string;
}

// Default Baerskin About data
const BAERSKIN_ABOUT_DATA: ComposableAboutProps = {
  testimonial: {
    quote:
      "We figured out we were losing roughly 6% of events going through Kafka with customers complaining they didn't get their order confirmation emails. But it was super hard to tackle. Now that we switched to Inngest, we're super confident that everything is working as what I'll call tip top shape.",
    highlightedParts: [
      "we were losing roughly 6% of events going through Kafka",
      "Now that we switched to Inngest, we're super confident that everything is working",
    ],
    author: "Gus Fune → CEO",
    title: "CEO",
    company: "[ BÆRSkin Tactical Supply Co. ]",
    image: "/assets/customers/baerskin/gusDither.png",
    imageAlt: "Gus Fune, CEO",
  },
  cta: {
    primaryText: "Interested in Inngest?",
    secondaryText: "Talk to an Inngest product expert today.",
    buttonText: "Get in touch [+]",
  },
  backgroundColor: "stone-800",
};

export default function About() {
  return <ComposableAbout {...BAERSKIN_ABOUT_DATA} />;
}

// Export the composable component for reuse
export { ComposableAbout };

// Main composable About component
function ComposableAbout({
  testimonial,
  cta,
  backgroundColor = "stone-950",
}: ComposableAboutProps) {
  // Helper function to render quote with highlighted parts
  const renderQuoteWithHighlights = (
    quote: string,
    highlightedParts: string[]
  ) => {
    let processedQuote = quote;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    highlightedParts.forEach((highlight, index) => {
      const highlightIndex = processedQuote.indexOf(highlight, lastIndex);
      if (highlightIndex !== -1) {
        // Add text before highlight
        if (highlightIndex > lastIndex) {
          elements.push(
            <span key={`text-${index}`}>
              {processedQuote.substring(lastIndex, highlightIndex)}
            </span>
          );
        }

        // Add highlighted text
        elements.push(
          <span
            key={`highlight-${index}`}
            className="font-whyte text-[32px] font-light leading-[140%] tracking-[-1.6px] text-carbon-50 underline"
          >
            {highlight}
          </span>
        );

        lastIndex = highlightIndex + highlight.length;
      }
    });

    // Add remaining text
    if (lastIndex < processedQuote.length) {
      elements.push(
        <span key="text-end">{processedQuote.substring(lastIndex)}</span>
      );
    }

    return elements;
  };

  return (
    <>
      {/* Testimonial section */}
      <div className="relative z-10 bg-stone-950 p-6 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-container-desktop md:px-8">
          <div className="m-auto">
            <div className="flex flex-col justify-between md:flex-row">
              {/* Quote */}
              <div className="order-1 max-w-[48rem] md:order-2">
                <div className="flex">
                  {/* Hanging quote mark */}
                  <div className="font-whyte text-[32px] font-light leading-[140%] tracking-[-1.6px] text-carbon-50">
                    ‟
                  </div>
                  <blockquote className="max-w-4xl font-whyte text-[32px] font-light leading-[140%] tracking-[-1.6px] text-carbon-50">
                    {renderQuoteWithHighlights(
                      testimonial.quote,
                      testimonial.highlightedParts
                    )}
                    ”
                  </blockquote>
                </div>
              </div>

              {/* Portrait and attribution */}
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
                <div className="max-w-sm border-t pt-2 font-whyteMono text-xs font-normal leading-[140%] tracking-[-0.24px] text-carbon-800 md:text-2xl md:leading-[1.3] md:tracking-[0.075em] md:text-carbon-0">
                  <p>{testimonial.author}</p>
                  <p>{testimonial.company}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-4 mt-10 border-t border-stone-50 pt-6 md:mx-0">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div className="flex items-center justify-start gap-3">
                <div className="h-3 w-3 bg-inngestLux"></div>
                <p className="font-whyte text-2xl font-light leading-tight tracking-tight text-white">
                  {cta.primaryText}
                </p>
              </div>
              <div className="-mr-[19rem] w-full md:w-auto">
                <div className="w-full border-t border-stone-50 md:hidden"></div>
                <div className="flex items-start justify-start gap-3 pt-6 md:pt-0">
                  <div className="flex max-w-xs items-start gap-3 font-whyte text-2xl font-light leading-tight tracking-tight text-white">
                    <div className="mt-2 h-3 w-3 flex-shrink-0 bg-inngestLux"></div>
                    <p>{cta.secondaryText}</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:items-center md:gap-8">
                <Button className="flex w-full flex-shrink-0 items-center justify-center gap-[7.153px] py-6 text-right font-whyte text-2xl font-normal leading-[120%] text-stone-950 transition-colors md:h-[52px] md:w-[212px] md:gap-[10px] md:px-[13px] md:py-[15px] md:text-2xl">
                  {cta.buttonText}
                </Button>
              </div>
            </div>
          </div>

          <div className="mx-4 mt-16 flex shrink flex-col items-end gap-2 md:mx-0">
            <div className="h-8 w-[11.6%] bg-white md:h-[52px]"></div>
            <div className="h-8 w-[19.4%] bg-white md:h-[52px]"></div>
            <div className="h-8 w-full bg-white md:h-[52px]"></div>
            <div className="h-8 w-[50.6%] self-start bg-white md:h-[52px]"></div>
            <div className="mr-[19.4%] h-8 w-[30%] bg-white md:h-[52px]"></div>
            <div className="h-8 w-[19.4%] bg-white md:h-[52px]"></div>
          </div>
        </div>
      </div>
    </>
  );
}

// Export types for reuse
export type { ComposableAboutProps, TestimonialData, CTAData };

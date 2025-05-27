"use client";

import { Card, CardContent } from "components/RedesignedLanding/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/RedesignedLanding/Carousel";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "components/RedesignedLanding/Button";
import { useState } from "react";
import GridBackground from "./GridBackground";
import Image from "next/image";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    company: "Resend",
    logo: {
      src: "/assets/customers/resend.svg",
      name: "Resend",
      scale: 0.8,
    },
    testimonial:
      "The DX and visibility with Inngest is really incredible. We are able to develop functions locally easier and faster that with our previous queue. Also, Inngest's tools give us the visibility to debug issues much quicker than before.",
    author: "BU KINOSHITA",
    role: "Co-founder, Resend",
    highlight: ["DX", "visibility"],
  },
  {
    id: 2,
    company: "SoundCloud",
    logo: {
      src: "/assets/customers/soundcloud-logo-white-horizontal.svg",
      name: "SoundCloud",
      scale: 1.5,
    },
    testimonial:
      "Switching from GCP Composer (Airflow) to Inngest unified our backend and reduced our costs by 50%! Switching from GCP Composer (Airflow) to Inngest unified our backend and reduced our costs by 50%!",
    author: "JANE SMITH",
    role: "Engineering Lead, SoundCloud",
    highlight: ["costs by 50%"],
  },
  {
    id: 3,
    company: "TripAdvisor",
    logo: {
      src: "/assets/customers/tripadvisor.svg",
      name: "TripAdvisor",
      scale: 1.4,
    },
    testimonial:
      "The developer experience with Inngest has been phenomenal. The local development tools and debugging capabilities have significantly improved our workflow and productivity.",
    author: "ALEX JOHNSON",
    role: "Senior Developer, TripAdvisor",
    highlight: ["developer experience", "debugging capabilities"],
  },
  {
    id: 4,
    company: "Contentful",
    logo: {
      src: "/assets/customers/contentful-logo-white.svg",
      name: "Contentful",
      scale: 1.2,
    },
    testimonial:
      "The developer experience with Inngest has been phenomenal. The local development tools and debugging capabilities have significantly improved our workflow and productivity.",
    author: "SARAH WILSON",
    role: "Product Manager, Contentful",
    highlight: ["developer experience", "debugging capabilities"],
  },
  {
    id: 5,
    company: "Browser Use",
    logo: {
      src: "/assets/customers/browser-use-white.svg",
      name: "Browser Use",
      scale: 1.5,
    },
    testimonial:
      "The developer experience with Inngest has been phenomenal. The local development tools and debugging capabilities have significantly improved our workflow and productivity.",
    author: "MIKE CHEN",
    role: "CTO, Browser Use",
    highlight: ["developer experience", "debugging capabilities"],
  },
  {
    id: 6,
    company: "Gitbook",
    logo: {
      src: "/assets/customers/gitbook-logo-white.svg",
      name: "Gitbook",
      scale: 1.3,
    },
    testimonial:
      "The developer experience with Inngest has been phenomenal. The local development tools and debugging capabilities have significantly improved our workflow and productivity.",
    author: "EMMA DAVIS",
    role: "Head of Engineering, Gitbook",
    highlight: ["developer experience", "debugging capabilities"],
  },
];

function highlightText(text: string, highlights: string[]) {
  let highlightedText = text;
  highlights.forEach((highlight) => {
    const regex = new RegExp(`(${highlight})`, "gi");
    highlightedText = highlightedText.replace(
      regex,
      '<span class="bg-inngestLux text-stone-900 px-1 rounded">$1</span>'
    );
  });
  return highlightedText;
}

const getRandomBackgroundSVG = (id: number) => {
  // Use the testimonial ID as seed for consistent randomization
  const svgType = id % 2; // Alternates between 0 and 1

  // Card dimensions: h-80 = 320px height, variable width
  // SVG original dimensions: 666w x 376h
  // Calculate scale to fit card height: 320/376 ≈ 0.85
  const baseScale = 320 / 376; // Scale to match card height

  const positions = [
    { top: "-35%", right: "-40%", scale: baseScale * 1.3 },
    { bottom: "-40%", left: "-35%", scale: baseScale * 1.2 },
    { top: "-30%", left: "-45%", scale: baseScale * 1.4 },
    { bottom: "-35%", right: "-40%", scale: baseScale * 1.1 },
    { top: "-45%", right: "-30%", scale: baseScale * 1.3 },
    { bottom: "-25%", left: "-50%", scale: baseScale * 1.2 },
  ];

  const position = positions[id % positions.length];

  return {
    component: svgType === 0 ? CircleSVG : CircleSVG2,
    style: {
      position: "absolute" as const,
      ...position,
      transform: `scale(${position.scale})`,
      opacity: 0.15,
      zIndex: 0,
    },
  };
};

export default function TestimonialsCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  const scrollPrev = () => {
    api?.scrollPrev();
  };

  const scrollNext = () => {
    api?.scrollNext();
  };

  return (
    <div className="relative bg-stone-950 py-48 text-white md:px-4">
      <GridBackground />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between">
          <div className="max-w-lg font-whyte">
            <h2 className="text-3xl font-light leading-tight md:text-4xl">
              Trusted by software companies
              <br />
              at scale, <span className="font-semibold">worldwide.</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="border-zinc-700 bg-stone-800 text-stone-50 hover:bg-stone-700 hover:text-stone-50"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="border-zinc-700 bg-stone-800 text-stone-50 hover:bg-stone-700 hover:text-stone-50"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            containScroll: "trimSnaps",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 pl-8 md:pl-16 lg:pl-24">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="basis-[90%] pl-4 md:basis-[70%] lg:basis-[50%]"
              >
                <Card className="h-80 rounded-none border-stone-900 bg-stone-900">
                  <CardContent className="relative h-full overflow-hidden p-8">
                    {(() => {
                      const bgSVG = getRandomBackgroundSVG(testimonial.id);
                      const SVGComponent = bgSVG.component;
                      return (
                        <div style={bgSVG.style}>
                          <SVGComponent />
                        </div>
                      );
                    })()}
                    <div className="relative z-10 grid h-full grid-cols-1 md:grid-cols-2">
                      <div className="flex flex-col justify-between">
                        <div>
                          <Image
                            src={testimonial.logo.src}
                            alt={testimonial.logo.name}
                            title={testimonial.logo.name}
                            width={120 * testimonial.logo.scale}
                            height={30 * testimonial.logo.scale}
                            className="width-auto opacity-90"
                          />
                        </div>

                        <div className="space-y-6">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {testimonial.author}
                            </div>
                            <div className="text-sm text-gray-400">
                              {testimonial.role}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start justify-between">
                        <div>
                          <p
                            className="text-sm leading-relaxed text-gray-300"
                            dangerouslySetInnerHTML={{
                              __html: highlightText(
                                testimonial.testimonial,
                                testimonial.highlight
                              ),
                            }}
                          />
                        </div>

                        <div>
                          <Link
                            href="/customers"
                            className="group inline-flex items-center border-b border-transparent pb-0.5 text-sm text-stone-50 transition-all hover:border-inngestLux hover:text-inngestLux"
                          >
                            Read customer story
                            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

function CircleSVG() {
  return (
    <svg
      width="666"
      height="376"
      viewBox="0 0 666 376"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M685.617 332.977C685.617 651.874 427.1 910.391 108.203 910.391C-210.694 910.391 -469.211 651.874 -469.211 332.977C-469.211 14.0796 -210.694 -244.438 108.203 -244.438C427.1 -244.438 685.617 14.0796 685.617 332.977ZM-124.537 332.977C-124.537 461.515 -20.3357 565.717 108.203 565.717C236.742 565.717 340.943 461.515 340.943 332.977C340.943 204.438 236.742 100.236 108.203 100.236C-20.3357 100.236 -124.537 204.438 -124.537 332.977Z"
        fill="#44403c"
      />
    </svg>
  );
}

function CircleSVG2() {
  return (
    <svg
      width="666"
      height="376"
      viewBox="0 0 666 376"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1186.44 399.299C1186.44 727.771 920.163 994.051 591.69 994.051C263.218 994.051 -3.06152 727.771 -3.06152 399.299C-3.06152 70.8264 263.218 -195.453 591.69 -195.453C920.163 -195.453 1186.44 70.8264 1186.44 399.299ZM320.136 399.299C320.136 549.274 441.715 670.853 591.69 670.853C741.666 670.853 863.245 549.274 863.245 399.299C863.245 249.323 741.666 127.744 591.90 127.744C441.715 127.744 320.136 249.323 320.136 399.299Z"
        fill="#44403c"
      />
    </svg>
  );
}

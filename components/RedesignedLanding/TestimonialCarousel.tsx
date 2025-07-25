"use client";

import {
  Card,
  CardContent,
} from "src/components/RedesignedLanding/FeatureNavigate/Card";
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
import Image from "next/image";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    company: "Aomni",
    href: "/customers/aomni",
    logo: {
      src: "/assets/customers/aomni-logo.svg",
      name: "Aomni",
      scale: 0.8,
    },
    testimonial:
      "For anyone who is building multi-step AI agents, I highly recommend building it on top of Inngest, the traceability it provides is super useful, plus you get timeouts & retries for free.",
    author: "David Zhang",
    role: "Founder, Aomni",
    highlight: ["traceability", "timeouts & retries"],
  },
  {
    id: 2,
    company: "SoundCloud",
    href: "/customers/soundcloud",
    logo: {
      src: "/assets/customers/soundcloud-logo-white-horizontal.svg",
      name: "SoundCloud",
      scale: 1.5,
    },
    testimonial:
      "Our context switching dropped significantly, because the code is just business logic. If you read the code, you know that the steps that will execute without having to manage any infrastructure.",
    author: "Matthew Drooker",
    role: "CTO, SoundCloud",
    highlight: ["business logic", "infrastructure"],
  },
  {
    id: 3,
    company: "Otto",
    href: "/customers/otto",
    logo: {
      src: "/assets/customers/otto-logo.svg",
      name: "Otto",
      scale: 0.75,
    },
    testimonial:
      "Inngest completely transformed how we handle AI orchestration for us. Its intuitive DX, built-in multi-tenant concurrency, and flow control allowed us to scale without the complexity of other tools.",
    author: "Sully Omar",
    role: "Co-founder, CEO, Otto",
    highlight: ["developer experience", "multi-tenant concurrency"],
  },
  // {
  //   id: 4,
  //   company: "Contentful",
  //   logo: {
  //     src: "/assets/customers/contentful-logo-white.svg",
  //     name: "Contentful",
  //     scale: 1.2,
  //   },
  //   testimonial:
  //     "The developer experience with Inngest has been phenomenal. The local development tools and debugging capabilities have significantly improved our workflow and productivity.",
  //   author: "SARAH WILSON",
  //   role: "Product Manager, Contentful",
  //   highlight: ["developer experience", "debugging capabilities"],
  // },
  // {
  //   id: 5,
  //   company: "Browser Use",
  //   logo: {
  //     src: "/assets/customers/browser-use-white.svg",
  //     name: "Browser Use",
  //     scale: 1.5,
  //   },
  //   testimonial:
  //     "The developer experience with Inngest has been phenomenal. The local development tools and debugging capabilities have significantly improved our workflow and productivity.",
  //   author: "MIKE CHEN",
  //   role: "CTO, Browser Use",
  //   highlight: ["developer experience", "debugging capabilities"],
  // },
  {
    id: 6,
    company: "Gitbook",
    href: "/customers/gitbook",
    logo: {
      src: "/assets/customers/gitbook-logo-white.svg",
      name: "Gitbook",
      scale: 1.3,
    },
    testimonial:
      "When we read our code base, we can immediately understand what it is and what it does. We are going to be gradually migrating most features to Inngest.",
    author: "Johan Preynat",
    role: "Engineering Lead, GitBook",
    highlight: [" immediately understand"],
  },
];

function highlightText(text: string, highlights: string[]) {
  let highlightedText = text;
  highlights.forEach((highlight) => {
    const regex = new RegExp(`(${highlight})`, "gi");
    highlightedText = highlightedText.replace(
      regex,
      '<span class="bg-inngestLux text-stone-900 px-1 rounded whitespace-nowrap">$1</span>'
    );
  });
  return highlightedText;
}

const getRandomBackgroundSVG = (id: number) => {
  const baseScale = 320 / 1156;

  const positions = [
    { left: "10%", top: "25%", scale: baseScale * 3.2 },
    { left: "90%", top: "25%", scale: baseScale * 3.5 },
    { left: "15%", top: "75%", scale: baseScale * 2.9 },
    { left: "85%", top: "75%", scale: baseScale * 3.3 },
    { left: "20%", top: "15%", scale: baseScale * 3.1 },
    { left: "80%", top: "85%", scale: baseScale * 3.4 },
    { left: "5%", top: "50%", scale: baseScale * 3.0 },
    { left: "95%", top: "50%", scale: baseScale * 3.2 },
    { left: "15%", top: "35%", scale: baseScale * 3.1 },
    { left: "85%", top: "65%", scale: baseScale * 3.3 },
    { left: "25%", top: "80%", scale: baseScale * 3.0 },
    { left: "75%", top: "20%", scale: baseScale * 3.2 },
  ];

  const position = positions[id % positions.length];

  return {
    component: FullCircleSVG,
    style: {
      position: "absolute" as const,
      left: position.left,
      top: position.top,
      transform: `scale(${position.scale}) translate(-50%, -50%)`,
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
    <div className="relative bg-stone-950 py-24 text-white md:px-4 md:py-48">
      <div className="relative z-10 xl:mx-[calc((100vw-72rem)/2)]">
        <div className="mb-12  flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-0">
          <div className="max-w-lg font-whyte">
            <h2 className="text-3xl font-light leading-tight md:text-4xl">
              Trusted by software companies
              <br />
              at scale, <span className="font-semibold">worldwide.</span>
            </h2>
          </div>
          <div className="flex gap-2 self-end md:self-auto">
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
      </div>
      <div className="ml-0 xl:ml-[calc((100vw-72rem)/2)]">
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
                className="basis-[95%] pl-4 sm:basis-[85%] md:basis-[65%] lg:basis-[45%] xl:basis-[38%] 2xl:basis-[40%]"
              >
                <Card className="h-80 rounded-none border-stone-900 bg-stone-900">
                  <CardContent className="relative h-full overflow-hidden p-6 md:p-8">
                    {(() => {
                      const bgSVG = getRandomBackgroundSVG(testimonial.id);
                      const SVGComponent = bgSVG.component;
                      return (
                        <div style={bgSVG.style}>
                          <SVGComponent />
                        </div>
                      );
                    })()}
                    <div className="relative z-10 flex h-full flex-col justify-between lg:grid lg:grid-cols-2 lg:gap-6">
                      <div className="flex flex-col justify-between">
                        <div className="mb-4 lg:mb-0">
                          <Image
                            src={testimonial.logo.src}
                            alt={testimonial.logo.name}
                            title={testimonial.logo.name}
                            width={120 * testimonial.logo.scale}
                            height={30 * testimonial.logo.scale}
                            className="width-auto opacity-90"
                          />
                        </div>

                        <div className="space-y-4 lg:space-y-6">
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
                        <div className="mb-4 lg:mb-0">
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
                            href={`${testimonial.href}?ref=homepage-testimonials`}
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

function FullCircleSVG() {
  return (
    <svg
      width="1156"
      height="1156"
      viewBox="0 0 1156 1156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1155.62 577.977C1155.62 896.874 897.1 1155.39 578.203 1155.39C259.306 1155.39 0.789062 896.874 0.789062 577.977C0.789062 259.08 259.306 0.5625 578.203 0.5625C897.1 0.5625 1155.62 259.08 1155.62 577.977ZM345.463 577.977C345.463 706.515 449.664 810.717 578.203 810.717C706.742 810.717 810.943 706.515 810.943 577.977C810.943 449.438 706.742 345.236 578.203 345.236C449.664 345.236 345.463 449.438 345.463 577.977Z"
        fill="#44403c"
      />
    </svg>
  );
}

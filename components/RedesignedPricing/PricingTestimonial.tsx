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
    company: "SoundCloud",
    logo: {
      src: "/assets/customers/soundcloud-logo-white-horizontal.svg",
      name: "SoundCloud",
      scale: 1.5,
    },
    testimonial: "Deployed within in 1 week",
  },
  {
    id: 2,
    company: "Fey",
    logo: {
      src: "/assets/customers/fey/fey-icon-name.svg",
      name: "Fey",
      scale: 0.8,
    },
    testimonial: "50x faster processing",
  },
  {
    id: 3,
    company: "Gitbook",
    logo: {
      src: "/assets/customers/gitbook-logo-white.svg",
      name: "Gitbook",
      scale: 1.4,
    },
    testimonial: "Solved bi-directional synchronization",
  },
];

const getBackgroundPosition = (id: number) => {
  return {
    position: "absolute" as const,
    inset: 0,
    width: "100%",
    height: "100%",
    // opacity: 0.15,
    zIndex: 0,
  };
};

export default function PricingTestimonial() {
  const [api, setApi] = useState<CarouselApi>();

  const scrollPrev = () => {
    api?.scrollPrev();
  };

  const scrollNext = () => {
    api?.scrollNext();
  };

  const getCardDimensions = (company: string) => {
    return "sm:h-[188px] sm:w-[470px]";
  };

  const getBackgroundSVG = (company: string) => {
    switch (company) {
      case "SoundCloud":
        return <SoundCloudBackgroundSVG />;
      case "Fey":
        return <FeyBackgroundSVG />;
      case "Gitbook":
        return <GitbookBackgroundSVG />;
      default:
        return <SoundCloudBackgroundSVG />;
    }
  };

  const TestimonialCard = ({
    testimonial,
  }: {
    testimonial: typeof testimonials[0];
  }) => (
    <Card
      className={`h-48 rounded-none border-stone-900 bg-stone-900 ${getCardDimensions(
        testimonial.company
      )}`}
    >
      <CardContent className="relative h-full overflow-hidden p-4 sm:p-8">
        <div style={getBackgroundPosition(testimonial.id)}>
          {getBackgroundSVG(testimonial.company)}
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="mb-3 sm:mb-6">
            <div className="relative h-6 w-full max-w-[120px] sm:h-8">
              <Image
                src={testimonial.logo.src}
                alt={testimonial.logo.name}
                fill
                className="object-contain opacity-90"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <p className="mb-3 whitespace-nowrap text-sm font-light leading-5 text-stone-50 sm:mb-6 sm:text-base sm:leading-6 md:font-whyteInktrap md:text-2xl md:font-normal md:leading-9 md:tracking-[-0.05em]">
              {testimonial.testimonial}
            </p>
            <Link
              href="/customers"
              className="group inline-flex w-fit items-center border-b border-transparent pb-0.5 text-sm text-stone-50 transition-all hover:border-inngestLux hover:text-inngestLux"
            >
              Read customer story
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="relative bg-stone-950 py-24 text-white md:px-4 md:py-48">
      <div className="relative z-10 mx-auto max-w-[1440px] px-4">
        <div className="mb-12 flex justify-between gap-4 md:flex-row md:items-center md:justify-center">
          <div className="max-w-lg font-whyte">
            <h2 className="font-whyteInktrap text-3xl font-light leading-tight sm:text-center">
              Trusted and used in production by companies across the world
            </h2>
          </div>
          <div className="flex gap-2 self-end sm:hidden">
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

        <div className="sm:hidden">
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
            <CarouselContent className="-ml-4 pl-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="basis-[90%] pl-4">
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="hidden sm:block">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SoundCloudBackgroundSVG() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 407 188"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <circle cx="96.1431" cy="-29.25" r="310.083" fill="#655279" />
    </svg>
  );
}

function FeyBackgroundSVG() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 404 188"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <circle cx="93.1426" cy="-21.25" r="310.083" fill="#2C9B63" />
    </svg>
  );
}

function GitbookBackgroundSVG() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 470 188"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <circle cx="183.922" cy="-21.25" r="310.083" fill="#CB5C32" />
    </svg>
  );
}

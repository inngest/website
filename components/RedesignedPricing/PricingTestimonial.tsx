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
  },
];

const getBackgroundPosition = (id: number) => {
  // Generate random position pushed extremely close to top left corner (0-2% left, 0-2% top)
  const leftPercent = Math.floor(Math.random() * 2);
  const topPercent = Math.floor(Math.random() * 2);

  return {
    position: "absolute" as const,
    left: `${leftPercent}%`,
    top: `${topPercent}%`,
    transform: "scale(0.8) translate(-50%, -50%)",
    opacity: 0.15,
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

  const TestimonialCard = ({
    testimonial,
  }: {
    testimonial: typeof testimonials[0];
  }) => (
    <Card className="h-80 rounded-none border-stone-900 bg-stone-900">
      <CardContent className="relative h-full overflow-hidden p-8">
        <div style={getBackgroundPosition(testimonial.id)}>
          <FullCircleSVG />
        </div>

        <div className="relative z-10 grid h-full grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-between">
            <Image
              src={testimonial.logo.src}
              alt={testimonial.logo.name}
              width={120 * testimonial.logo.scale}
              height={30 * testimonial.logo.scale}
              className="width-auto opacity-90"
            />

            <div>
              <div className="text-sm font-medium text-white">
                {testimonial.author}
              </div>
              <div className="text-sm text-gray-400">{testimonial.role}</div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <p className="text-sm leading-relaxed text-gray-300">
              {testimonial.testimonial}
            </p>

            <Link
              href="/customers"
              className="group inline-flex items-center border-b border-transparent pb-0.5 text-sm text-stone-50 transition-all hover:border-inngestLux hover:text-inngestLux"
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
      <div className="relative z-10 mx-auto max-w-7xl px-4">
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

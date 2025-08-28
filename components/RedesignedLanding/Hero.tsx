"use client";
import Typewriter from "typewriter-effect";
import Link from "next/link";
import GridBackground from "./GridBackground";
import { MultipleDraggableElements } from "./MultipleDraggableElements";
import Image from "next/image";
import { Button } from "src/components/RedesignedLanding/Button";
import { useCallback, useState } from "react";

const h1s = [
  "The leading orchestration engine",
  "Leading workflows orchestration",
];

export default function Hero() {
  const [h1Index, updateH1Index] = useState(0);

  const onClick = useCallback(() => {
    updateH1Index((prev) => (prev + 1) % h1s.length);
  }, []);

  return (
    <div className="bg-stone-950" onClick={onClick}>
      <main className="relative mx-auto w-full max-w-[1800px] bg-stone-950 px-4 pb-12 pt-20 md:pt-52 lg:pt-56">
        <GridBackground
          lineColor="rgba(70, 70, 70, 0.3)"
          gridSize={{
            default: "75px",
            md: "50px",
            sm: "30px",
          }}
        />
        <MultipleDraggableElements />
        <div className="relative isolate overflow-hidden">
          <div className="relative z-10 mb-16">
            <div className="mx-auto mb-16 mt-4 max-w-[76%] text-[2.5rem] leading-[2.75rem] sm:mt-0 md:ml-16 md:max-w-4xl md:text-6xl lg:mx-auto lg:text-7xl">
              <span className="font-whyteInktrap">{h1s[h1Index]}</span>
              <span className="font-whyt inline-flex gap-2 pl-2">
                {" for "}
                <Typewriter
                  options={{
                    strings: ["AI Agents", "E-Commerce", "Ambitious products"],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </span>
            </div>
            <div className="relative z-10 mx-auto max-w-[76%] text-left font-circular text-[1.25rem] md:max-w-sm md:text-base lg:mr-44 lg:max-w-[500px] lg:text-xl 2xl:mr-96">
              <p className="mb-8 font-circular text-[1.25rem] font-normal leading-8 text-stone-200 md:font-light lg:text-2xl">
                Inngest's orchestration engine empowers the best product teams
                from experiment to production.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  variant="default"
                  asChild
                  className="max-[520px]:py-6 max-[520px]:text-[1.1rem]"
                >
                  <a
                    href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=homepage-hero`}
                  >
                    Start building for free
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="max-[520px]:py-6 max-[520px]:text-[1.1rem]"
                >
                  <Link href="/docs?ref=homepage-hero">
                    Read the docs<span aria-hidden="true">→</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-8 max-w-7xl px-6 sm:mt-24 lg:px-8">
          <h2 className="text-center font-circular text-base font-light text-stone-50">
            Trusted by product teams at
          </h2>
          <div className="mx-auto mt-10 grid grid-cols-2 items-center justify-items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {[
              {
                src: "/assets/customers/soundcloud-logo-white-horizontal.svg",
                name: "SoundCloud",
                scale: 1.5,
              },
              {
                src: "/assets/customers/tripadvisor.svg",
                name: "TripAdvisor",
                scale: 1.4,
              },
              {
                src: "/assets/customers/resend.svg",
                name: "Resend",
                scale: 0.8,
              },
              {
                src: "/assets/customers/contentful-logo-white.svg",
                name: "Contentful",
                scale: 1.2,
              },
              {
                src: "/assets/customers/browser-use-white.svg",
                name: "Browser Use",
                scale: 1.5,
              },
              {
                src: "/assets/customers/gitbook-logo-white.svg",
                name: "Gitbook",
                scale: 1.3,
              },
            ].map(({ src, name, scale = 1 }, idx) => (
              <Image
                key={idx}
                src={src}
                alt={name}
                title={name}
                width={120 * 0.8 * scale}
                height={30 * 0.8 * scale}
                className="width-auto col-span-1 m-auto opacity-80 grayscale transition-all sm:col-span-1 lg:col-span-1"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

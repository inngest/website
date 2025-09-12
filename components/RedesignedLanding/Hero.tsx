import Link from "next/link";
import GridBackground from "./GridBackground";
import { MultipleDraggableElements } from "./MultipleDraggableElements";
import Image from "next/image";
import { Button } from "src/components/RedesignedLanding/Button";

export default function Hero() {
  return (
    <div className="bg-stone-950">
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
            <div className="mx-auto max-w-[76%] md:ml-16 md:max-w-5xl lg:mx-auto">
              <div className="mb-16 mt-4 text-[2.5rem] leading-[2.75rem] sm:mt-0 md:text-6xl lg:text-7xl">
                <h1 className="block font-whyte">
                  Build unbreakable workflows.
                </h1>
                <h2 className="block max-w-[52rem] font-whyteInktrap">
                  Scale to millions of users in a day.
                </h2>
              </div>
              <div className="relative z-10 text-left font-circular text-[1.25rem] md:max-w-sm md:text-base lg:max-w-lg lg:text-xl">
                <p className="mb-8 font-circular text-[1.25rem] font-normal leading-8 text-stone-200 md:font-light lg:text-2xl">
                  Inngest lets you auto-scale queues, monitor runs, and replay
                  errors—without touching infrastructure. Ship fast, iterate
                  faster.
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
                    <Link href="/contact?ref=homepage-hero">
                      Get a demo<span aria-hidden="true">→</span>
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-8 sm:mt-24">
                <h2 className="font-circular text-base font-light text-stone-50">
                  Trusted by product teams at
                </h2>
                <div className="mt-10 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 md:justify-between lg:mx-auto lg:grid-cols-6">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

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
                  Make <strong>any</strong> code durable <br /> by default
                </h1>
              </div>
              <div className="relative z-10 text-left font-circular text-[1.25rem] md:max-w-sm md:text-base lg:max-w-lg lg:text-xl">
                <p className="mb-8 font-circular text-[1.25rem] font-normal leading-8 text-stone-200 md:font-light lg:text-2xl">
                  Workflows, agents, endpoints, background jobs—however it's written, wherever it runs—Inngest makes it unbreakable.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    variant="default"
                    asChild
                    className="max-[520px]:py-6 max-[520px]:text-[1.1rem]"
                  >
                    <Link
                      href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=homepage-hero`}
                    >
                      Start building for free
                    </Link>
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
                  Trusted in production at
                </h2>
                <div className="mt-10 grid grid-cols-2 place-items-center gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-7 lg:mx-auto">
                  {[
                    {
                      src: "/assets/customers/replit-logo.svg",
                      name: "Replit",
                      scale: 1.5,
                      className: "scale-[2.5]",
                    },
                    {
                      src: "/assets/customers/soundcloud-logo-white-horizontal.svg",
                      name: "SoundCloud",
                      scale: 1.5,
                    },
                    {
                      src: "/assets/customers/cohere-logo-white.svg",
                      name: "Cohere",
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
                      className: "w-4/5",
                    },
                    {
                      src: "/assets/customers/outtake/outtake-logo.svg",
                      name: "Outtake",
                      scale: 1.2,
                    },
                    {
                      src: "/assets/customers/elevenlabs-logo-white.svg",
                      name: "ElevenLabs",
                      scale: 1.5,
                    },
                    // {
                    //   src: "/assets/customers/contentful-logo-white.svg",
                    //   name: "Contentful",
                    //   scale: 1.2,
                    // },
                  ].map(({ src, name, className: logoClassName = "w-full" }, idx, arr) => (
                    <div key={idx} className={`flex h-8 w-32 items-center justify-center overflow-hidden lg:w-auto${idx === arr.length - 1 && arr.length % 2 !== 0 ? " col-span-2 sm:col-span-1" : ""}`}>
                      <Image
                        src={src}
                        alt={name}
                        title={name}
                        width={120}
                        height={40}
                        className={`h-full object-contain opacity-80 grayscale transition-all ${logoClassName}`}
                      />
                    </div>
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

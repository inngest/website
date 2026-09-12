import Image from "next/image";
import Chip from "@/components/v1/sections/shared/Chip";
import ButtonLink from "@/components/v1/ButtonLink";
import RunConsole from "@/components/v1/sections/CodeTV/RunConsole";

const NAV = [
  { href: "#episode", label: "Episode" },
  { href: "#teams", label: "Teams" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#resource-kit", label: "Resource kit" },
  { href: "#from-the-set", label: "From the set" },
] as const;

export default function Hero() {
  return (
    <section
      aria-labelledby="codetv-hero-heading"
      className="relative w-full overflow-hidden text-v1-frost"
    >
      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-6 pb-16 pt-[104px] sm:px-9 lg:grid-cols-12 lg:gap-10 lg:px-[70px] lg:pb-20 lg:pt-[152px]">
        <div className="flex flex-col gap-8 lg:col-span-7 lg:gap-10">
          <Chip variant="solid" size="sm" className="self-start font-normal">
            CodeTV × Inngest · Challenge open
          </Chip>

          <h1
            id="codetv-hero-heading"
            className="text-v1-display-sm uppercase [font-size:clamp(2.25rem,7vw,4.75rem)] [line-height:1.05]"
          >
            Build an app
            <span className="block">that works while</span>
            <span className="block text-v1-accent-salmon">you&apos;re away</span>
          </h1>

          <p className="text-v1-body-lg-loose max-w-[34rem] text-v1-frost/80">
            Three teams. Four hours. One brief that sounds like a dare: ship
            something that keeps running even when you walk away. Inngest made
            sure that was actually possible.
          </p>

          <nav
            aria-label="On this page"
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-v1Label text-[12px] uppercase tracking-[0.08em] text-v1-frost/70 hover:text-v1-accent-salmon motion-safe:transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="#teams" variant="accent" size="md">
              Meet the teams
            </ButtonLink>
            <ButtonLink href="#resource-kit" variant="secondary">
              Resource kit
            </ButtonLink>
          </div>
        </div>

        <div className="relative flex flex-col gap-4 lg:col-span-5 lg:pt-6">
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
            <Image
              src="/assets/v1/events/codetv/group.jpg"
              alt="The CodeTV Web Dev Challenge cast"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <RunConsole />
        </div>
      </div>
    </section>
  );
}

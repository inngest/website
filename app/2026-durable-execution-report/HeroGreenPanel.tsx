"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "src/shared/Icons/Logo";

const LOGOS = [
  { name: "Cohere",             src: "/assets/report-assets/logos/Cohere.png",      w: 100 },
  { name: "11x",                src: "/assets/report-assets/logos/11x.png",         w: 56  },
  { name: "LiveKit",            src: "/assets/report-assets/logos/Livekit.png",     w: 80  },
  { name: "mintlify",           src: "/assets/report-assets/logos/Mintlify.png",    w: 84  },
  { name: "BÆRSkin",           src: "/assets/report-assets/logos/Bearskin.png",    w: 100 },
  { name: "Stuut Technologies", src: "/assets/report-assets/logos/Stuut.png",       w: 96  },
  { name: "Mercury",            src: "/assets/report-assets/logos/Mercury.png",     w: 88  },
  { name: "Wealthfront",        src: "/assets/report-assets/logos/Wealthfront.png", w: 104 },
  { name: "Gnosis Freight",     src: "/assets/report-assets/logos/Gnosis.png",      w: 96  },
  { name: "Remitly",            src: "/assets/report-assets/logos/Remintly.png",    w: 84  },
];

export function HeroGreenPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Clamp so parallax stops once hero is scrolled past
  const heroH = ref.current?.offsetHeight ?? 900;
  const progress = Math.min(scrollY, heroH);

  return (
    <div
      ref={ref}
      className="relative mr-3 flex min-h-[640px] flex-col overflow-hidden rounded-r-2xl p-8 md:mr-4 md:min-h-[820px] md:p-12 lg:min-h-[900px]"
      style={{
        background:
          "linear-gradient(135deg, rgba(220,240,210,0.85) 6%, #2C9B63 33%, #79D617 49%, #2C9B63 64%, rgba(220,240,210,0.85) 100%)",
      }}
    >
      {/* Grain texture — scrolls slower than page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-8%]"
        style={{
          backgroundImage: "url('/assets/report-assets/report_texture.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "soft-light",
          opacity: 0.25,
          transform: `translateY(${progress * 0.12}px)`,
        }}
      />

      {/* Shape — scrolls at a different rate for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-8%]"
        style={{
          backgroundImage: "url('/assets/report-assets/report_shape.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          mixBlendMode: "multiply",
          opacity: 0.05,
          transform: `translateY(${progress * 0.22}px)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col">
        <div>
          <Logo width={130} fill="#0c1f10" />
        </div>

        <div className="mb-8 mt-10 flex flex-col gap-5">
          <h1 className="font-whyteInktrap text-5xl font-black leading-[1.05] text-[#0c1f10] sm:text-6xl xl:text-7xl">
            AI in Production: The 2026 Benchmark Report
          </h1>
          <p className="max-w-2xl text-xl font-semibold italic text-[#0c1f10]">
            How engineering teams are building, breaking, and scaling AI in
            production.
          </p>
          <p className="max-w-2xl text-base font-medium text-[#0c1f10]">
            We surveyed 130 backend, full-stack, and AI engineers about
            what it takes to run reliable AI workflows in production. We
            wanted to know what&apos;s causing failures, and which infrastructure
            choices—across orchestration, observability, evals, and agent
            frameworks—actually reduce the burden of reliability.
            <br />
            <br />
            Explore the patterns that predict scaling confidence.
          </p>
        </div>

        {/* Logos */}
        <div className="mt-auto pt-8">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-[#0c1f10]/50">
            With participation from engineers at
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            {LOGOS.map((l) => (
              <Image
                key={l.name}
                src={l.src}
                alt={l.name}
                width={l.w}
                height={32}
                style={{
                  height: 28,
                  width: "auto",
                  filter: "brightness(0) opacity(0.55)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "src/shared/Icons/Logo";

// h = target optical height in px — adjust per-logo for visual balance
const LOGOS = [
  { name: "Cohere",             src: "/assets/report-assets/logos/Cohere.png",      h: 20 },
  { name: "11x",                src: "/assets/report-assets/logos/11x.png",         h: 22 },
  { name: "LiveKit",            src: "/assets/report-assets/logos/Livekit.png",     h: 18 },
  { name: "mintlify",           src: "/assets/report-assets/logos/Mintlify.png",    h: 18 },
  { name: "BÆRSkin",           src: "/assets/report-assets/logos/Bearskin.png",    h: 26 },
  { name: "Stuut Technologies", src: "/assets/report-assets/logos/Stuut.png",       h: 22 },
  { name: "Mercury",            src: "/assets/report-assets/logos/Mercury.png",     h: 28 },
  { name: "Wealthfront",        src: "/assets/report-assets/logos/Wealthfront.png", h: 16 },
  { name: "Gnosis Freight",     src: "/assets/report-assets/logos/Gnosis.png",      h: 22 },
  { name: "Remitly",            src: "/assets/report-assets/logos/Remintly.png",    h: 22 },
];

export function HeroGreenPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroH = ref.current?.offsetHeight ?? 900;
  const progress = Math.min(scrollY, heroH);

  return (
    <div
      ref={ref}
      className="relative mr-3 flex min-h-0 flex-col overflow-hidden md:mr-4"
      style={{
        background:
          "linear-gradient(135deg, #2C9B63 0%, #79D617 22%, #a8ef3c 50%, #79D617 78%, #2C9B63 100%)",
      }}
    >
      {/* Grain texture — dramatic scroll parallax */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-12%]"
        style={{
          backgroundImage: "url('/assets/report-assets/report_texture.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "soft-light",
          opacity: 0.1,
          transform: `translateY(${progress * 0.35}px)`,
          willChange: "transform",
        }}
      />

      {/* Shape — scrolls fastest for max depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-12%]"
        style={{
          backgroundImage: "url('/assets/report-assets/report_shape.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          mixBlendMode: "multiply",
          opacity: 0.06,
          transform: `translateY(${progress * 0.55}px)`,
          willChange: "transform",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col px-8 pb-4 pt-8 md:px-12 md:pb-6 md:pt-12">

        {/* Logo link — left */}
        <Link
          href="/"
          className="mb-4 self-start transition-opacity hover:opacity-60 md:mb-6"
          aria-label="Inngest homepage"
        >
          <Logo width={110} fill="#0c1f10" />
        </Link>

        {/* Copy — left-aligned, vertically centered in available space */}
        <div className="flex flex-1 flex-col justify-center gap-3">
          <h1 className="font-whyteInktrap text-5xl font-black leading-[1.05] text-[#0c1f10] sm:text-5xl xl:text-6xl">
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
            <br /><br />
            Explore the patterns that predict scaling confidence.
          </p>
        </div>

        {/* Logos — 5 per row */}
        <div className="pt-5">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#0c1f10]/70">
            With participation from engineers at
          </p>
          <div className="grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-3 sm:grid-cols-5">
            {LOGOS.map((l) => (
              <div
                key={l.name}
                className={`flex items-center justify-center${l.name === "Remitly" ? " hidden sm:flex" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={l.src}
                  alt={l.name}
                  style={{
                    maxHeight: l.h,
                    maxWidth: "100%",
                    height: "auto",
                    width: "auto",
                    display: "block",
                    filter: "brightness(0)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import Logo from "src/shared/Icons/Logo";

export function HeroGreenPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setOffset({
      x: e.clientX - (rect.left + rect.width / 2),
      y: e.clientY - (rect.top + rect.height / 2),
    });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const transition = "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mr-3 flex min-h-[640px] flex-col overflow-hidden rounded-r-2xl p-8 md:mr-4 md:min-h-[820px] md:p-12 lg:min-h-[900px]"
      style={{
        background:
          "linear-gradient(135deg, rgba(220,240,210,0.85) 6%, #2C9B63 33%, #79D617 49%, #2C9B63 64%, rgba(220,240,210,0.85) 100%)",
      }}
    >
      {/* Grain texture — deep layer */}
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
          transform: `translate(${offset.x * 0.018}px, ${offset.y * 0.018}px)`,
          transition,
        }}
      />

      {/* Shape accent — mid layer */}
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
          transform: `translate(${offset.x * 0.05}px, ${offset.y * 0.05}px)`,
          transition,
        }}
      />

      {/* Content — foreground, counter-drifts for depth */}
      <div
        className="relative z-10 flex flex-col"
        style={{
          transform: `translate(${offset.x * -0.007}px, ${offset.y * -0.007}px)`,
          transition,
        }}
      >
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
      </div>
    </div>
  );
}

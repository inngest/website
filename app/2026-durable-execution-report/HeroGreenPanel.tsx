"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Logo from "src/shared/Icons/Logo";

export function HeroGreenPanel() {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });

  // Texture drifts gently with the mouse (deep background layer)
  const texX = useTransform(springX, (v) => v * 0.018);
  const texY = useTransform(springY, (v) => v * 0.018);

  // Shape drifts more (mid layer)
  const shapeX = useTransform(springX, (v) => v * 0.05);
  const shapeY = useTransform(springY, (v) => v * 0.05);

  // Content counter-drifts subtly (foreground — moves opposite for depth illusion)
  const contentX = useTransform(springX, (v) => v * -0.007);
  const contentY = useTransform(springY, (v) => v * -0.007);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - (rect.left + rect.width / 2));
    rawY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

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
      {/* Grain texture — deep layer, drifts with mouse */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-8%]"
        style={{
          backgroundImage: "url('/assets/report-assets/report_texture.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "soft-light",
          opacity: 0.25,
          x: texX,
          y: texY,
        }}
      />

      {/* Shape accent — mid layer, drifts more */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-8%]"
        style={{
          backgroundImage: "url('/assets/report-assets/report_shape.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          mixBlendMode: "multiply",
          opacity: 0.05,
          x: shapeX,
          y: shapeY,
        }}
      />

      {/* Content — foreground, counter-drifts for depth */}
      <motion.div
        className="relative z-10 flex flex-col"
        style={{ x: contentX, y: contentY }}
      >
        <div>
          <Logo width={130} fill="#0c1f10" />
        </div>

        <div className="mb-8 mt-10 flex flex-col gap-5">
          <span className="self-start rounded border border-[#0c1f10]/50 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-[#0c1f10]">
            AI in Production
          </span>
          <h1 className="font-whyteInktrap text-5xl font-bold leading-[1.05] text-[#0c1f10] sm:text-6xl xl:text-7xl">
            AI in Production: The 2026 Benchmark Report
          </h1>
          <p className="max-w-lg text-xl italic text-[#0c1f10]/80">
            How engineering teams are building, breaking, and scaling AI in
            production.
          </p>
          <p className="max-w-lg text-base text-[#0c1f10]/70">
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
      </motion.div>
    </div>
  );
}

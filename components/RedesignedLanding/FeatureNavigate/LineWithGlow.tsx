"use client";
import React from "react";
import { motion } from "motion/react";
import GlowDot from "./GlowDot";

export type Orientation = "horizontal" | "vertical";

interface LineWithGlowProps {
  path: string;
  dotPos: { x: number; y: number } | null;
  /**
   * Index is used solely to create unique gradient IDs and apply any
   * index-specific styling tweaks (e.g. z-index on the 3rd desktop path).
   */
  index: number;
  /**
   * Tailwind visibility utility classes that control when the line/dot is shown.
   * e.g. "hidden xl:block" (desktop), "hidden md:block xl:hidden" (medium), "block sm:hidden" (mobile)
   */
  visibilityClass: string;
  orientation?: Orientation;
  /**
   * When true, the line is rendered with a solid stone color instead of the gradient.
   */
  solid?: boolean;
}

export default function LineWithGlow({
  path,
  dotPos,
  index,
  visibilityClass,
  orientation = "horizontal",
  solid = false,
}: LineWithGlowProps) {
  const gradientId = `feature-nav-gradient-${index}-${visibilityClass.replace(
    /\s+/g,
    "-"
  )}`;
  const svgClasses = `pointer-events-none absolute left-0 top-0 z-10 ${visibilityClass}`;

  const strokeValue = solid
    ? "#57534E" /* Tailwind stone-neutral shade used in original gradient */
    : `url(#${gradientId})`;

  return (
    <>
      <svg width="100%" height="100%" className={svgClasses}>
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2={orientation === "horizontal" ? "100%" : "0%"}
            y2={orientation === "horizontal" ? "0%" : "100%"}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#CBB26A" />
            <stop offset="100%" stopColor="#57534E" />
          </linearGradient>
        </defs>
        {path && (
          <motion.path
            d={path}
            stroke={strokeValue}
            strokeWidth={1}
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
            // Path 3 needs a higher z-index so it sits above the deploy card.
            className={index === 2 ? "z-20" : undefined}
          />
        )}
      </svg>

      {dotPos && (
        <div
          className={`pointer-events-none absolute z-20 ${visibilityClass}`}
          style={{
            left: dotPos.x,
            top: dotPos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <GlowDot />
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { SCOTT } from "@/components/v1/sections/CodeTV/data";
import { cn } from "@/utils/v1/cn";

const SPARKS = [
  { x: "12%", y: "18%", dx: -42, dy: -58, delay: 0, size: 10, tone: "salmon" },
  { x: "28%", y: "12%", dx: 18, dy: -64, delay: 40, size: 7, tone: "frost" },
  { x: "46%", y: "8%", dx: -8, dy: -70, delay: 20, size: 12, tone: "green" },
  { x: "64%", y: "14%", dx: 36, dy: -54, delay: 80, size: 8, tone: "salmon" },
  { x: "82%", y: "22%", dx: 52, dy: -48, delay: 30, size: 9, tone: "frost" },
  { x: "8%", y: "42%", dx: -58, dy: -12, delay: 60, size: 8, tone: "green" },
  { x: "90%", y: "38%", dx: 62, dy: -18, delay: 50, size: 11, tone: "salmon" },
  { x: "18%", y: "62%", dx: -46, dy: 28, delay: 90, size: 7, tone: "frost" },
  { x: "50%", y: "48%", dx: -22, dy: -36, delay: 10, size: 13, tone: "salmon" },
  { x: "72%", y: "58%", dx: 40, dy: 22, delay: 70, size: 8, tone: "green" },
  { x: "38%", y: "78%", dx: -18, dy: 48, delay: 110, size: 9, tone: "frost" },
  { x: "58%", y: "82%", dx: 24, dy: 52, delay: 40, size: 7, tone: "salmon" },
  { x: "86%", y: "70%", dx: 48, dy: 36, delay: 100, size: 10, tone: "green" },
  { x: "24%", y: "30%", dx: -30, dy: -28, delay: 25, size: 6, tone: "frost" },
  { x: "70%", y: "32%", dx: 34, dy: -40, delay: 15, size: 8, tone: "salmon" },
  { x: "44%", y: "56%", dx: 12, dy: 18, delay: 85, size: 6, tone: "green" },
] as const;

const TONE: Record<(typeof SPARKS)[number]["tone"], string> = {
  salmon: "text-v1-accent-salmon",
  green: "text-v1-accent-green",
  frost: "text-v1-frost",
};

export default function GiveScott() {
  const [given, setGiven] = useState(false);
  const [burst, setBurst] = useState(0);

  function toggle() {
    if (given) {
      setGiven(false);
      return;
    }
    setGiven(true);
    setBurst((n) => n + 1);
  }

  return (
    <li className="h-full lg:col-span-4">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={given}
        aria-label={
          given ? "Take Inngest away from Scott" : "Give Scott Inngest"
        }
        className="group relative flex h-full w-full cursor-pointer flex-col rounded-lg border border-v1-frost/25 bg-v1-surfaceElevated p-3 pb-4 text-left"
      >
        <span className="relative aspect-[3/2] min-h-0 w-full flex-1 overflow-hidden rounded-sm bg-v1-carbon-400 lg:aspect-auto">
          <Image
            src={SCOTT.before}
            alt={given ? "" : SCOTT.beforeAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn(
              "object-cover object-center motion-safe:transition-[opacity,filter] motion-safe:duration-700",
              given ? "opacity-0 grayscale" : "grayscale group-hover:grayscale-[0.65]",
            )}
          />
          <Image
            src={SCOTT.after}
            alt={given ? SCOTT.afterAlt : ""}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn(
              "object-cover object-center motion-safe:transition-opacity motion-safe:duration-700",
              given ? "opacity-100" : "opacity-0",
            )}
          />
          {burst > 0 && given && (
            <span key={burst} className="pointer-events-none absolute inset-0" aria-hidden="true">
              {SPARKS.map((spark, i) => (
                <span
                  key={`${burst}-${i}`}
                  className={cn(
                    "v1-codetv-sparkle absolute",
                    TONE[spark.tone],
                  )}
                  style={{
                    left: spark.x,
                    top: spark.y,
                    width: spark.size,
                    height: spark.size,
                    animationDelay: `${spark.delay}ms`,
                    ["--dx" as string]: `${spark.dx}px`,
                    ["--dy" as string]: `${spark.dy}px`,
                  }}
                />
              ))}
            </span>
          )}
        </span>
        <span className="mt-3 flex items-center justify-center gap-2 font-v1Label text-[12px] uppercase tracking-[0.08em] text-v1-frost">
          <span aria-hidden="true" className="text-v1-accent-salmon">
            ✦
          </span>
          {given ? "Take Inngest away from Scott" : "Give Scott Inngest"}
          <span aria-hidden="true" className="text-v1-accent-salmon">
            ✦
          </span>
        </span>
      </button>
    </li>
  );
}

"use client";
import { useState } from "react";
import Image from "next/image";

export default function ScreenshotTabs() {
  const [selected, setSelected] = useState(0);
  const screenshots = [
    {
      title: "Tracing",
      src: "/assets/homepage/hero/2024-12-12-runs.png",
      alt: "Inngest function runs and traces",
    },
    {
      title: "Observability",
      src: "/assets/homepage/hero/2024-12-12-metrics.png",
      alt: "Inngest metrics dashboard",
    },
    {
      title: "Management",
      src: "/assets/homepage/hero/2024-12-12-function-list.png",
      alt: "Inngest function dashboard",
    },
  ];
  const screenshot = screenshots[selected];

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="p-1 flex flex-row gap-1 rounded-lg text-sm font-semibold bg-carbon-50/10 backdrop-blur">
        {screenshots.map((s, idx) => (
          <button
            key={idx}
            className={
              "py-1 px-4 rounded-md transition-all hover:bg-carbon-50/10 data-[state=active]:bg-carbon-50 data-[state=active]:text-carbon-800"
            }
            data-state={idx === selected ? "active" : "inactive"}
            aria-selected={idx === selected}
            onClick={() => setSelected(idx)}
          >
            {s.title}
          </button>
        ))}
      </div>
      <Image
        alt={`Screenshot of ${screenshot.alt}`}
        className="rounded-t-md mx-auto"
        src={screenshot.src}
        width={3026 * 0.35}
        height={1850 * 0.35}
      />
    </div>
  );
}

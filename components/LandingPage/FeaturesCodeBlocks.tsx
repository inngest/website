"use client";
import { useState } from "react";
import clsx from "clsx";
import CodeWindow from "src/shared/CodeWindow";

export default function FeaturesCodeBlocks({
  features,
}: {
  features: {
    title: string;
    description: string;
    codeBlock: string;
  }[];
}) {
  const [selected, setSelected] = useState<number>(0);
  return (
    <div className="max-w-6xl mx-auto my-12 px-4 lg:px-0 flex flex-col gap-12 items-center justify-center">
      <div className="flex flex-row md:flex-col gap-2 md:gap-1.5">
        <div
          className={`order-last md:order-first grid grid-cols-1 grid-rows-${features.length} md:grid-cols-${features.length} md:grid-rows-1 gap-6`}
        >
          {features.map(({ title, description }, idx) => (
            <div key={idx}>
              <div
                className={clsx(
                  "h-full md:h-auto", // mobile
                  "p-3 flex flex-col gap-2 cursor-pointer rounded hover:bg-canvasMuted",
                  selected === idx && "border-bottom border-primary"
                )}
                role="button"
                onClick={() => setSelected(idx)}
              >
                <h3 className="text-basis font-medium text-lg">{title}</h3>
                <p className="text-subtle">{description}</p>
              </div>
            </div>
          ))}
        </div>
        <TabSelectorBar
          length={3}
          selected={selected}
          gap="1.5rem" /* gap-2 */
        />
      </div>
      <div className="w-full">
        <CodeWindow
          snippet={features[selected].codeBlock}
          className="md:px-7 md:py-4"
          style={{
            background: `linear-gradient(108deg, rgba(204, 204, 204, 0.12) 9.67%, rgba(0, 0, 0, 0.00) 49.19%), #141414`,
          }}
        ></CodeWindow>
      </div>
    </div>
  );
}

function TabSelectorBar({
  length = 3,
  selected,
  gap = "1rem",
}: {
  length: number;
  selected: number;
  gap: string;
}) {
  return (
    <div className="relative">
      {/* Horizontal */}
      <div className="hidden md:block h-0.5 w-full bg-canvasMuted"></div>
      <div
        className={clsx(
          `hidden md:block absolute top-0 left-0 h-0.5`,
          `bg-[rgb(var(--color-foreground-success))]`,
          `transform transition-transform duration-300`
        )}
        style={{
          width: `calc((100% - ${length - 1} * ${gap}) * ${1 / length})`,
          transform: `translateX(calc(${
            selected * 100
          }% + ${selected} * ${gap}))`,
        }}
      ></div>
      {/* Vertical */}
      <div className="md:hidden w-0.5 h-full bg-canvasMuted"></div>
      <div
        className={clsx(
          `md:hidden absolute top-0 left-0 w-0.5`,
          `bg-[rgb(var(--color-foreground-success))]`,
          `transform transition-transform duration-300`
        )}
        style={{
          height: `calc((100% - ${length - 1} * ${gap}) * ${1 / length})`,
          transform: `translateY(calc(${
            selected * 100
          }% + ${selected} * ${gap}))`,
        }}
      ></div>
    </div>
  );
}

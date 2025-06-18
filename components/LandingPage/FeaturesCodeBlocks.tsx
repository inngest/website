"use client";
import { useState } from "react";
import clsx from "clsx";
import CodeWindow from "src/shared/CodeWindow";

export default function FeaturesCodeBlocks({
  features,
}: {
  features: {
    title: string | React.ReactNode;
    description: string;
    codeBlock: string;
  }[];
}) {
  const [selected, setSelected] = useState<number>(0);
  return (
    <div className="mx-auto my-12 flex max-w-6xl flex-col items-center justify-center gap-12 px-4 lg:px-0">
      <div className="flex flex-row gap-2 md:flex-col md:gap-1.5">
        <div
          className={`order-last grid grid-cols-1 md:order-first grid-rows-${features.length} md:grid-cols-${features.length} gap-6 md:grid-rows-1`}
        >
          {features.map(({ title, description }, idx) => (
            <div key={idx}>
              <div
                className={clsx(
                  "h-full md:h-auto", // mobile
                  "flex cursor-pointer flex-col gap-2 rounded p-3 hover:bg-canvasMuted",
                  selected === idx && "border-bottom border-primary"
                )}
                role="button"
                onClick={() => setSelected(idx)}
              >
                <h3 className="text-lg font-medium text-basis">{title}</h3>
                <p className="text-subtle">{description}</p>
              </div>
            </div>
          ))}
        </div>
        <TabSelectorBar
          length={features.length}
          selected={selected}
          gap="1.5rem" /* gap-2 */
        />
      </div>
      <div className="w-full">
        <CodeWindow
          snippet={features[selected].codeBlock}
          className="md:px-7 md:py-4"
          style={{
            background: `bg-stone-700`,
          }}
        />
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
      <div className="hidden h-0.5 w-full bg-canvasMuted md:block"></div>
      <div
        className={clsx(
          `absolute left-0 top-0 hidden h-0.5 md:block`,
          `bg-inngestLux`,
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
      <div className="h-full w-0.5 bg-canvasMuted md:hidden"></div>
      <div
        className={clsx(
          `absolute left-0 top-0 w-0.5 md:hidden`,
          `bg-inngestLux`,
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

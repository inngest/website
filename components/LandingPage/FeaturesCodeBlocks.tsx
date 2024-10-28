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
    <div className="max-w-6xl mx-auto my-12 flex flex-col gap-12 items-center justify-center">
      <div>
        <div className={`grid grid-cols-${features.length} gap-6 mb-1.5`}>
          {features.map(({ title, description }, idx) => (
            <div key={idx}>
              <div
                className={clsx(
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
      <div className="h-0.5 w-full bg-canvasMuted"></div>
      <div
        className={clsx(
          `absolute top-0 left-0 h-0.5`,
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
    </div>
  );
}

import { ComponentType } from "react";
import clsx from "clsx";

type TabItem = {
  title: string;
  icon?: any; // TODO
};

export function Tabs<T extends TabItem>({
  content,
  setSelected,
  selected,
}: {
  content: T[];
  setSelected: (idx: number) => void;
  selected: number;
}) {
  return (
    <div
      className={`relative grid grid-cols-${content.length} gap-y-2 justify-stretch`}
    >
      {content.map(({ title, ...tab }, idx) => (
        <Tab
          key={idx}
          isSelected={selected === idx}
          onClick={() => setSelected(idx)}
        >
          {tab.icon && (
            <tab.icon className="hidden md:inline-block sm:h-4 sm:w-4 md:h-6 md:w-6 fill-[#1CB4D5]" />
          )}
          {title}
        </Tab>
      ))}
      <div
        className={clsx(
          `absolute -bottom-px left-0 w-1/${content.length} h-0.5`,
          `bg-[#1CB4D5] bg-gradient-to-b from-cyan-500 to-blue-500`,
          `transform transition-transform duration-300`
        )}
        style={{
          transform: `translateX(${selected * 100}%)`,
        }}
      ></div>
    </div>
  );
}

export function Tab({ isSelected = false, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `flex flex-row grow gap-2 items-center justify-center p-4 -mb-px whitespace-nowrap `,
        `font-semibold transition-all`,
        isSelected
          ? "border-[#1CB4D5] text-basis"
          : "text-muted hover:text-basis border-transparent"
      )}
    >
      {children}
    </button>
  );
}
